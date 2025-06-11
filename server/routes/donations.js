import express from 'express';
import db from '../database/init.js';

const router = express.Router();

// Create donation
router.post('/', (req, res) => {
  try {
    const {
      type,
      organType,
      bloodType,
      quantity,
      unit,
      urgency,
      expiryDate,
      specialRequirements
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO donations (
        donor_id, type, organ_type, blood_type, quantity, unit,
        urgency, expiry_date, special_requirements
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      req.user.id, type, organType, bloodType, quantity,
      unit, urgency, expiryDate, specialRequirements
    );

    res.status(201).json({
      message: 'Donation created successfully',
      donationId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's donations
router.get('/my-donations', (req, res) => {
  try {
    const donations = db.prepare(`
      SELECT * FROM donations
      WHERE donor_id = ?
      ORDER BY created_at DESC
    `).all(req.user.id);

    res.json(donations);
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Create request
router.post('/requests', (req, res) => {
  try {
    const {
      type,
      organType,
      bloodType,
      quantity,
      unit,
      urgency,
      specialRequirements,
      medicalJustification,
      requiredByDate
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO requests (
        recipient_id, type, organ_type, blood_type, quantity, unit,
        urgency, special_requirements, medical_justification, required_by_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      req.user.id, type, organType, bloodType, quantity,
      unit, urgency, specialRequirements, medicalJustification, requiredByDate
    );

    res.status(201).json({
      message: 'Request created successfully',
      requestId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's requests
router.get('/my-requests', (req, res) => {
  try {
    const requests = db.prepare(`
      SELECT * FROM requests
      WHERE recipient_id = ?
      ORDER BY created_at DESC
    `).all(req.user.id);

    res.json(requests);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;