import express from 'express';
import db from '../database/init.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require admin role
router.use(requireRole(['admin']));

// Get all donations (admin only)
router.get('/all-donations', (req, res) => {
  try {
    const donations = db.prepare(`
      SELECT d.*, u.first_name, u.last_name, u.email, u.phone,
             u.location_city, u.location_state
      FROM donations d
      JOIN users u ON d.donor_id = u.id
      ORDER BY d.created_at DESC
    `).all();

    res.json(donations);
  } catch (error) {
    console.error('Get all donations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all requests (admin only)
router.get('/all-requests', (req, res) => {
  try {
    const requests = db.prepare(`
      SELECT r.*, u.first_name, u.last_name, u.email, u.phone,
             u.location_city, u.location_state
      FROM requests r
      JOIN users u ON r.recipient_id = u.id
      ORDER BY r.created_at DESC
    `).all();

    res.json(requests);
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all matches (admin only)
router.get('/all-matches', (req, res) => {
  try {
    const matches = db.prepare(`
      SELECT m.*, 
             d.type, d.organ_type, d.blood_type, d.quantity, d.unit,
             r.urgency, r.medical_justification,
             donor.first_name as donor_first_name, donor.last_name as donor_last_name,
             donor.email as donor_email, donor.phone as donor_phone,
             recipient.first_name as recipient_first_name, recipient.last_name as recipient_last_name,
             recipient.email as recipient_email, recipient.phone as recipient_phone
      FROM matches m
      JOIN donations d ON m.donation_id = d.id
      JOIN requests r ON m.request_id = r.id
      JOIN users donor ON d.donor_id = donor.id
      JOIN users recipient ON r.recipient_id = recipient.id
      ORDER BY m.matched_at DESC
    `).all();

    res.json(matches);
  } catch (error) {
    console.error('Get all matches error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get platform statistics (admin only)
router.get('/statistics', (req, res) => {
  try {
    const stats = {};

    // User statistics
    const userStats = db.prepare(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN role = 'donor' AND is_active = 1 THEN 1 ELSE 0 END) as active_donors,
        SUM(CASE WHEN role = 'recipient' AND is_active = 1 THEN 1 ELSE 0 END) as active_recipients,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users
      FROM users
    `).get();

    // Donation statistics
    const donationStats = db.prepare(`
      SELECT 
        COUNT(*) as total_donations,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available_donations,
        SUM(CASE WHEN status = 'used' THEN 1 ELSE 0 END) as used_donations,
        SUM(CASE WHEN urgency = 'critical' THEN 1 ELSE 0 END) as critical_donations
      FROM donations
    `).get();

    // Request statistics
    const requestStats = db.prepare(`
      SELECT 
        COUNT(*) as total_requests,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_requests,
        SUM(CASE WHEN status = 'fulfilled' THEN 1 ELSE 0 END) as fulfilled_requests,
        SUM(CASE WHEN urgency = 'critical' AND status = 'active' THEN 1 ELSE 0 END) as critical_requests
      FROM requests
    `).get();

    // Match statistics
    const matchStats = db.prepare(`
      SELECT 
        COUNT(*) as total_matches,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_matches,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_matches,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_matches
      FROM matches
    `).get();

    // Blood type distribution
    const bloodTypeStats = db.prepare(`
      SELECT blood_type, COUNT(*) as count
      FROM users 
      WHERE blood_type IS NOT NULL
      GROUP BY blood_type
      ORDER BY count DESC
    `).all();

    // Location statistics
    const locationStats = db.prepare(`
      SELECT location_state, COUNT(*) as count
      FROM users 
      WHERE location_state IS NOT NULL
      GROUP BY location_state
      ORDER BY count DESC
      LIMIT 10
    `).all();

    res.json({
      users: userStats,
      donations: donationStats,
      requests: requestStats,
      matches: matchStats,
      bloodTypes: bloodTypeStats,
      locations: locationStats
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update donation status (admin only)
router.put('/donations/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const donationId = req.params.id;

    const stmt = db.prepare(`
      UPDATE donations SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(status, donationId);

    res.json({ message: 'Donation status updated successfully' });
  } catch (error) {
    console.error('Update donation status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update request status (admin only)
router.put('/requests/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;

    const stmt = db.prepare(`
      UPDATE requests SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(status, requestId);

    res.json({ message: 'Request status updated successfully' });
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Force create match (admin only)
router.post('/force-match', (req, res) => {
  try {
    const { donationId, requestId, notes } = req.body;

    // Verify donation and request exist and are compatible
    const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(donationId);
    const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(requestId);

    if (!donation || !request) {
      return res.status(404).json({ error: 'Donation or request not found' });
    }

    if (donation.type !== request.type) {
      return res.status(400).json({ error: 'Donation and request types do not match' });
    }

    // Create the match
    const stmt = db.prepare(`
      INSERT INTO matches (donation_id, request_id, compatibility_score, distance_km, status, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(donationId, requestId, 100, 0, 'pending', notes || 'Admin forced match');

    // Update donation status
    db.prepare('UPDATE donations SET status = ? WHERE id = ?').run('reserved', donationId);

    res.status(201).json({
      message: 'Match created successfully',
      matchId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Force match error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;