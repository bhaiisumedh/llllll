import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'donation.db'));

export function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('donor', 'recipient', 'admin')),
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      date_of_birth DATE,
      gender TEXT CHECK (gender IN ('male', 'female', 'other')),
      blood_type TEXT,
      location_city TEXT,
      location_state TEXT,
      location_country TEXT,
      medical_conditions TEXT,
      medications TEXT,
      emergency_contact_name TEXT,
      emergency_contact_phone TEXT,
      is_active BOOLEAN DEFAULT 1,
      is_eligible BOOLEAN DEFAULT 1,
      last_donation_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Donations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      donor_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('blood', 'organ', 'tissue')),
      organ_type TEXT,
      blood_type TEXT,
      quantity INTEGER,
      unit TEXT,
      status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'used', 'expired')),
      urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'critical')),
      expiry_date DATE,
      special_requirements TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (donor_id) REFERENCES users (id)
    )
  `);

  // Requests table
  db.exec(`
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipient_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('blood', 'organ', 'tissue')),
      organ_type TEXT,
      blood_type TEXT,
      quantity INTEGER,
      unit TEXT,
      urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'critical')),
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'cancelled')),
      special_requirements TEXT,
      medical_justification TEXT,
      required_by_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (recipient_id) REFERENCES users (id)
    )
  `);

  // Matches table
  db.exec(`
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      donation_id INTEGER NOT NULL,
      request_id INTEGER NOT NULL,
      compatibility_score REAL,
      distance_km REAL,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
      matched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      decision_at DATETIME,
      notes TEXT,
      FOREIGN KEY (donation_id) REFERENCES donations (id),
      FOREIGN KEY (request_id) REFERENCES requests (id)
    )
  `);

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
    CREATE INDEX IF NOT EXISTS idx_users_blood_type ON users (blood_type);
    CREATE INDEX IF NOT EXISTS idx_users_location ON users (location_city, location_state);
    CREATE INDEX IF NOT EXISTS idx_donations_type ON donations (type);
    CREATE INDEX IF NOT EXISTS idx_donations_status ON donations (status);
    CREATE INDEX IF NOT EXISTS idx_requests_type ON requests (type);
    CREATE INDEX IF NOT EXISTS idx_requests_status ON requests (status);
    CREATE INDEX IF NOT EXISTS idx_matches_status ON matches (status);
  `);

  console.log('Database initialized successfully');
}

export default db;