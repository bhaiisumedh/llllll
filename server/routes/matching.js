import express from 'express';
import db from '../database/init.js';

const router = express.Router();

// Blood type compatibility matrix
const bloodCompatibility = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+']
};

// Calculate distance between two points (simplified)
function calculateDistance(city1, state1, city2, state2) {
  if (city1 === city2 && state1 === state2) return 0;
  if (state1 === state2) return 50; // Same state
  return 200; // Different state (simplified)
}

// Calculate compatibility score
function calculateCompatibilityScore(donation, request, donorLocation, recipientLocation) {
  let score = 0;

  // Blood type compatibility (40 points)
  if (donation.type === 'blood') {
    const compatibleTypes = bloodCompatibility[donation.blood_type] || [];
    if (compatibleTypes.includes(request.blood_type)) {
      score += 40;
    }
  }

  // Organ type match (40 points)
  if (donation.type === 'organ' && donation.organ_type === request.organ_type) {
    score += 40;
  }

  // Urgency match (20 points)
  const urgencyScores = { critical: 20, high: 15, normal: 10, low: 5 };
  score += urgencyScores[request.urgency] || 0;

  // Location proximity (20 points)
  const distance = calculateDistance(
    donorLocation.city, donorLocation.state,
    recipientLocation.city, recipientLocation.state
  );
  if (distance === 0) score += 20;
  else if (distance <= 50) score += 15;
  else if (distance <= 100) score += 10;
  else if (distance <= 200) score += 5;

  // Quantity match (20 points)
  if (donation.quantity >= request.quantity) {
    score += 20;
  }

  return { score, distance };
}

// Find matches for a request
router.get('/find-matches/:requestId', (req, res) => {
  try {
    const requestId = req.params.requestId;

    // Get the request details
    const request = db.prepare(`
      SELECT r.*, u.location_city, u.location_state
      FROM requests r
      JOIN users u ON r.recipient_id = u.id
      WHERE r.id = ? AND r.status = 'active'
    `).get(requestId);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Find compatible donations
    const donations = db.prepare(`
      SELECT d.*, u.location_city, u.location_state, u.first_name, u.last_name, u.phone
      FROM donations d
      JOIN users u ON d.donor_id = u.id
      WHERE d.type = ? AND d.status = 'available' AND u.is_active = 1 AND u.is_eligible = 1
    `).all(request.type);

    const matches = [];

    for (const donation of donations) {
      const compatibility = calculateCompatibilityScore(
        donation,
        request,
        { city: donation.location_city, state: donation.location_state },
        { city: request.location_city, state: request.location_state }
      );

      if (compatibility.score > 40) { // Minimum compatibility threshold
        matches.push({
          donationId: donation.id,
          requestId: request.id,
          donor: {
            name: `${donation.first_name} ${donation.last_name}`,
            phone: donation.phone,
            location: `${donation.location_city}, ${donation.location_state}`
          },
          donation: {
            type: donation.type,
            organType: donation.organ_type,
            bloodType: donation.blood_type,
            quantity: donation.quantity,
            unit: donation.unit,
            urgency: donation.urgency
          },
          compatibilityScore: compatibility.score,
          distance: compatibility.distance,
          createdAt: donation.created_at
        });
      }
    }

    // Sort by compatibility score (highest first)
    matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json(matches);
  } catch (error) {
    console.error('Find matches error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a match
router.post('/create-match', (req, res) => {
  try {
    const { donationId, requestId, compatibilityScore, distance } = req.body;

    const stmt = db.prepare(`
      INSERT INTO matches (donation_id, request_id, compatibility_score, distance_km)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(donationId, requestId, compatibilityScore, distance);

    // Update donation status to reserved
    db.prepare('UPDATE donations SET status = ? WHERE id = ?').run('reserved', donationId);

    // Emit real-time notification
    const io = req.app.get('io');
    io.emit('match-created', {
      matchId: result.lastInsertRowid,
      donationId,
      requestId
    });

    res.status(201).json({
      message: 'Match created successfully',
      matchId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Accept a match
router.put('/accept-match/:matchId', (req, res) => {
  try {
    const matchId = req.params.matchId;
    const userId = req.user.id;

    // Get match details to verify user is involved
    const match = db.prepare(`
      SELECT m.*, d.donor_id, r.recipient_id
      FROM matches m
      JOIN donations d ON m.donation_id = d.id
      JOIN requests r ON m.request_id = r.id
      WHERE m.id = ?
    `).get(matchId);

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Check if user is involved in this match
    if (match.donor_id !== userId && match.recipient_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to modify this match' });
    }

    // Update match status
    const updateMatch = db.prepare(`
      UPDATE matches 
      SET status = 'accepted', decision_at = CURRENT_TIMESTAMP, notes = ?
      WHERE id = ?
    `);

    updateMatch.run(`Accepted by user ${userId}`, matchId);

    // Update donation status to used
    db.prepare('UPDATE donations SET status = ? WHERE id = ?').run('used', match.donation_id);

    // Update request status to fulfilled
    db.prepare('UPDATE requests SET status = ? WHERE id = ?').run('fulfilled', match.request_id);

    // Emit real-time notification
    const io = req.app.get('io');
    io.emit('match-accepted', {
      matchId,
      donationId: match.donation_id,
      requestId: match.request_id
    });

    res.json({ message: 'Match accepted successfully' });
  } catch (error) {
    console.error('Accept match error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Decline a match
router.put('/decline-match/:matchId', (req, res) => {
  try {
    const matchId = req.params.matchId;
    const userId = req.user.id;
    const { reason } = req.body;

    // Get match details to verify user is involved
    const match = db.prepare(`
      SELECT m.*, d.donor_id, r.recipient_id
      FROM matches m
      JOIN donations d ON m.donation_id = d.id
      JOIN requests r ON m.request_id = r.id
      WHERE m.id = ?
    `).get(matchId);

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Check if user is involved in this match
    if (match.donor_id !== userId && match.recipient_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to modify this match' });
    }

    // Update match status
    const updateMatch = db.prepare(`
      UPDATE matches 
      SET status = 'rejected', decision_at = CURRENT_TIMESTAMP, notes = ?
      WHERE id = ?
    `);

    updateMatch.run(`Declined by user ${userId}: ${reason || 'No reason provided'}`, matchId);

    // Update donation status back to available
    db.prepare('UPDATE donations SET status = ? WHERE id = ?').run('available', match.donation_id);

    // Emit real-time notification
    const io = req.app.get('io');
    io.emit('match-declined', {
      matchId,
      donationId: match.donation_id,
      requestId: match.request_id
    });

    res.json({ message: 'Match declined successfully' });
  } catch (error) {
    console.error('Decline match error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get matches for user
router.get('/my-matches', (req, res) => {
  try {
    const matches = db.prepare(`
      SELECT m.*, d.type, d.organ_type, d.blood_type, d.quantity, d.unit,
             r.urgency, r.medical_justification,
             donor.first_name as donor_name, donor.phone as donor_phone,
             recipient.first_name as recipient_name, recipient.phone as recipient_phone
      FROM matches m
      JOIN donations d ON m.donation_id = d.id
      JOIN requests r ON m.request_id = r.id
      JOIN users donor ON d.donor_id = donor.id
      JOIN users recipient ON r.recipient_id = recipient.id
      WHERE (d.donor_id = ? OR r.recipient_id = ?)
      ORDER BY m.matched_at DESC
    `).all(req.user.id, req.user.id);

    res.json(matches);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Auto-create matches for new requests
router.post('/auto-match/:requestId', (req, res) => {
  try {
    const requestId = req.params.requestId;

    // Get the request details
    const request = db.prepare(`
      SELECT r.*, u.location_city, u.location_state
      FROM requests r
      JOIN users u ON r.recipient_id = u.id
      WHERE r.id = ? AND r.status = 'active'
    `).get(requestId);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Find compatible donations
    const donations = db.prepare(`
      SELECT d.*, u.location_city, u.location_state, u.first_name, u.last_name, u.phone
      FROM donations d
      JOIN users u ON d.donor_id = u.id
      WHERE d.type = ? AND d.status = 'available' AND u.is_active = 1 AND u.is_eligible = 1
    `).all(request.type);

    let matchesCreated = 0;

    for (const donation of donations) {
      const compatibility = calculateCompatibilityScore(
        donation,
        request,
        { city: donation.location_city, state: donation.location_state },
        { city: request.location_city, state: request.location_state }
      );

      if (compatibility.score > 60) { // Higher threshold for auto-matching
        // Create the match
        const stmt = db.prepare(`
          INSERT INTO matches (donation_id, request_id, compatibility_score, distance_km)
          VALUES (?, ?, ?, ?)
        `);

        stmt.run(donation.id, request.id, compatibility.score, compatibility.distance);
        matchesCreated++;
      }
    }

    res.json({
      message: `Auto-matching completed. Created ${matchesCreated} matches.`,
      matchesCreated
    });
  } catch (error) {
    console.error('Auto-match error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;