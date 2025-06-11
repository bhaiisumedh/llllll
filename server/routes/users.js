import express from 'express';
import db from '../database/init.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, email, role, first_name, last_name, phone, date_of_birth,
             gender, blood_type, location_city, location_state, location_country,
             medical_conditions, medications, emergency_contact_name,
             emergency_contact_phone, is_active, is_eligible, last_donation_date,
             created_at, updated_at
      FROM users WHERE id = ?
    `).get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      bloodType,
      locationCity,
      locationState,
      locationCountry,
      medicalConditions,
      medications,
      emergencyContactName,
      emergencyContactPhone
    } = req.body;

    const stmt = db.prepare(`
      UPDATE users SET
        first_name = ?, last_name = ?, phone = ?, date_of_birth = ?,
        gender = ?, blood_type = ?, location_city = ?, location_state = ?,
        location_country = ?, medical_conditions = ?, medications = ?,
        emergency_contact_name = ?, emergency_contact_phone = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      firstName, lastName, phone, dateOfBirth, gender, bloodType,
      locationCity, locationState, locationCountry, medicalConditions,
      medications, emergencyContactName, emergencyContactPhone, req.user.id
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (admin only)
router.get('/all', requireRole(['admin']), (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, email, role, first_name, last_name, phone, blood_type,
             location_city, location_state, is_active, is_eligible,
             created_at, last_donation_date
      FROM users
      ORDER BY created_at DESC
    `).all();

    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user status (admin only)
router.put('/:id/status', requireRole(['admin']), (req, res) => {
  try {
    const { isActive, isEligible } = req.body;
    const userId = req.params.id;

    const stmt = db.prepare(`
      UPDATE users SET
        is_active = ?, is_eligible = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(isActive, isEligible, userId);

    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;