import db from './init.js';

export function seedDatabase() {
  try {
    // Check if data already exists
    const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (existingUsers.count > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }

    console.log('Seeding database with comprehensive sample data...');

    // Extended sample donors
    const donors = [
      {
        email: 'donor1@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'donor',
        first_name: 'John',
        last_name: 'Smith',
        phone: '555-0101',
        date_of_birth: '1985-03-15',
        gender: 'male',
        blood_type: 'O+',
        location_city: 'New York',
        location_state: 'NY',
        location_country: 'United States',
        medical_conditions: 'None',
        emergency_contact_name: 'Jane Smith',
        emergency_contact_phone: '555-0111',
        is_active: 1,
        is_eligible: 1
      },
      {
        email: 'donor2@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'donor',
        first_name: 'Sarah',
        last_name: 'Johnson',
        phone: '555-0102',
        date_of_birth: '1990-07-22',
        gender: 'female',
        blood_type: 'A+',
        location_city: 'Los Angeles',
        location_state: 'CA',
        location_country: 'United States',
        medical_conditions: 'Mild hypertension',
        emergency_contact_name: 'Mike Johnson',
        emergency_contact_phone: '555-0112',
        is_active: 1,
        is_eligible: 1
      },
      {
        email: 'donor3@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'donor',
        first_name: 'Michael',
        last_name: 'Brown',
        phone: '555-0103',
        date_of_birth: '1988-11-10',
        gender: 'male',
        blood_type: 'B+',
        location_city: 'Chicago',
        location_state: 'IL',
        location_country: 'United States',
        medical_conditions: 'None',
        emergency_contact_name: 'Lisa Brown',
        emergency_contact_phone: '555-0113',
        is_active: 1,
        is_eligible: 1
      },
      {
        email: 'donor4@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'donor',
        first_name: 'Jennifer',
        last_name: 'Davis',
        phone: '555-0104',
        date_of_birth: '1992-04-18',
        gender: 'female',
        blood_type: 'AB+',
        location_city: 'Houston',
        location_state: 'TX',
        location_country: 'United States',
        medical_conditions: 'Allergies to penicillin',
        emergency_contact_name: 'Robert Davis',
        emergency_contact_phone: '555-0114',
        is_active: 1,
        is_eligible: 1
      },
      {
        email: 'donor5@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'donor',
        first_name: 'David',
        last_name: 'Wilson',
        phone: '555-0105',
        date_of_birth: '1987-09-25',
        gender: 'male',
        blood_type: 'O-',
        location_city: 'Phoenix',
        location_state: 'AZ',
        location_country: 'United States',
        medical_conditions: 'None',
        emergency_contact_name: 'Mary Wilson',
        emergency_contact_phone: '555-0115',
        is_active: 1,
        is_eligible: 1
      },
      {
        email: 'donor6@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'donor',
        first_name: 'Amanda',
        last_name: 'Miller',
        phone: '555-0106',
        date_of_birth: '1991-12-03',
        gender: 'female',
        blood_type: 'A-',
        location_city: 'Philadelphia',
        location_state: 'PA',
        location_country: 'United States',
        medical_conditions: 'Diabetes Type 1',
        emergency_contact_name: 'Tom Miller',
        emergency_contact_phone: '555-0116',
        is_active: 1,
        is_eligible: 0 // Not eligible due to diabetes
      }
    ];

    // Extended sample recipients
    const recipients = [
      {
        email: 'recipient1@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'recipient',
        first_name: 'Emily',
        last_name: 'Davis',
        phone: '555-0201',
        date_of_birth: '1992-05-18',
        gender: 'female',
        blood_type: 'A+',
        location_city: 'New York',
        location_state: 'NY',
        location_country: 'United States',
        medical_conditions: 'Leukemia',
        medications: 'Chemotherapy drugs',
        emergency_contact_name: 'James Davis',
        emergency_contact_phone: '555-0211',
        is_active: 1,
        is_eligible: 1
      },
      {
        email: 'recipient2@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'recipient',
        first_name: 'Robert',
        last_name: 'Wilson',
        phone: '555-0202',
        date_of_birth: '1987-09-25',
        gender: 'male',
        blood_type: 'O+',
        location_city: 'Boston',
        location_state: 'MA',
        location_country: 'United States',
        medical_conditions: 'Kidney failure',
        medications: 'Dialysis, immunosuppressants',
        emergency_contact_name: 'Susan Wilson',
        emergency_contact_phone: '555-0212',
        is_active: 1,
        is_eligible: 1
      },
      {
        email: 'recipient3@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'recipient',
        first_name: 'Maria',
        last_name: 'Garcia',
        phone: '555-0203',
        date_of_birth: '1995-01-12',
        gender: 'female',
        blood_type: 'B+',
        location_city: 'Miami',
        location_state: 'FL',
        location_country: 'United States',
        medical_conditions: 'Severe anemia',
        medications: 'Iron supplements, EPO',
        emergency_contact_name: 'Carlos Garcia',
        emergency_contact_phone: '555-0213',
        is_active: 1,
        is_eligible: 1
      },
      {
        email: 'recipient4@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'recipient',
        first_name: 'James',
        last_name: 'Taylor',
        phone: '555-0204',
        date_of_birth: '1983-08-30',
        gender: 'male',
        blood_type: 'AB-',
        location_city: 'Seattle',
        location_state: 'WA',
        location_country: 'United States',
        medical_conditions: 'Heart disease',
        medications: 'Beta blockers, ACE inhibitors',
        emergency_contact_name: 'Linda Taylor',
        emergency_contact_phone: '555-0214',
        is_active: 1,
        is_eligible: 1
      }
    ];

    // Admin user
    const admin = {
      email: 'admin@lifeshare.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
      role: 'admin',
      first_name: 'Admin',
      last_name: 'User',
      phone: '555-0000',
      date_of_birth: '1980-01-01',
      gender: 'other',
      blood_type: 'O+',
      location_city: 'San Francisco',
      location_state: 'CA',
      location_country: 'United States',
      is_active: 1,
      is_eligible: 1
    };

    // Insert users
    const insertUser = db.prepare(`
      INSERT INTO users (
        email, password, role, first_name, last_name, phone, date_of_birth,
        gender, blood_type, location_city, location_state, location_country,
        medical_conditions, medications, emergency_contact_name, emergency_contact_phone,
        is_active, is_eligible
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const userIds = [];
    
    // Insert admin
    const adminResult = insertUser.run(
      admin.email, admin.password, admin.role, admin.first_name, admin.last_name,
      admin.phone, admin.date_of_birth, admin.gender, admin.blood_type,
      admin.location_city, admin.location_state, admin.location_country,
      admin.medical_conditions || null, admin.medications || null,
      admin.emergency_contact_name || null, admin.emergency_contact_phone || null,
      admin.is_active, admin.is_eligible
    );
    userIds.push({ id: adminResult.lastInsertRowid, role: admin.role, blood_type: admin.blood_type });

    // Insert donors and recipients
    [...donors, ...recipients].forEach(user => {
      const result = insertUser.run(
        user.email, user.password, user.role, user.first_name, user.last_name,
        user.phone, user.date_of_birth, user.gender, user.blood_type,
        user.location_city, user.location_state, user.location_country,
        user.medical_conditions || null, user.medications || null,
        user.emergency_contact_name || null, user.emergency_contact_phone || null,
        user.is_active, user.is_eligible
      );
      userIds.push({ id: result.lastInsertRowid, role: user.role, blood_type: user.blood_type });
    });

    // Extended sample donations
    const donorIds = userIds.filter(u => u.role === 'donor');
    const donations = [
      {
        donor_id: donorIds[0].id,
        type: 'blood',
        blood_type: 'O+',
        quantity: 2,
        unit: 'units',
        urgency: 'normal',
        status: 'available',
        special_requirements: 'Must be used within 24 hours'
      },
      {
        donor_id: donorIds[1].id,
        type: 'blood',
        blood_type: 'A+',
        quantity: 1,
        unit: 'units',
        urgency: 'high',
        status: 'available',
        special_requirements: 'CMV negative required'
      },
      {
        donor_id: donorIds[2].id,
        type: 'organ',
        organ_type: 'kidney',
        quantity: 1,
        unit: 'units',
        urgency: 'critical',
        status: 'available',
        special_requirements: 'HLA compatible recipient needed'
      },
      {
        donor_id: donorIds[3].id,
        type: 'blood',
        blood_type: 'AB+',
        quantity: 3,
        unit: 'units',
        urgency: 'normal',
        status: 'available'
      },
      {
        donor_id: donorIds[4].id,
        type: 'blood',
        blood_type: 'O-',
        quantity: 2,
        unit: 'units',
        urgency: 'high',
        status: 'available',
        special_requirements: 'Universal donor - emergency use'
      },
      {
        donor_id: donorIds[0].id,
        type: 'tissue',
        organ_type: 'bone marrow',
        quantity: 1,
        unit: 'units',
        urgency: 'critical',
        status: 'reserved',
        special_requirements: 'HLA match confirmed'
      },
      {
        donor_id: donorIds[1].id,
        type: 'organ',
        organ_type: 'liver',
        quantity: 1,
        unit: 'units',
        urgency: 'critical',
        status: 'available',
        special_requirements: 'Living donor - partial liver'
      },
      {
        donor_id: donorIds[2].id,
        type: 'blood',
        blood_type: 'B+',
        quantity: 1,
        unit: 'units',
        urgency: 'normal',
        status: 'used'
      }
    ];

    const insertDonation = db.prepare(`
      INSERT INTO donations (
        donor_id, type, organ_type, blood_type, quantity, unit, urgency, status, special_requirements
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const donationIds = [];
    donations.forEach(donation => {
      const result = insertDonation.run(
        donation.donor_id, donation.type, donation.organ_type || null,
        donation.blood_type || null, donation.quantity, donation.unit,
        donation.urgency, donation.status, donation.special_requirements || null
      );
      donationIds.push(result.lastInsertRowid);
    });

    // Extended sample requests
    const recipientIds = userIds.filter(u => u.role === 'recipient');
    const requests = [
      {
        recipient_id: recipientIds[0].id,
        type: 'blood',
        blood_type: 'A+',
        quantity: 2,
        unit: 'units',
        urgency: 'high',
        status: 'active',
        medical_justification: 'Emergency surgery required due to accident',
        special_requirements: 'CMV negative preferred',
        required_by_date: '2024-12-31'
      },
      {
        recipient_id: recipientIds[1].id,
        type: 'organ',
        organ_type: 'kidney',
        quantity: 1,
        unit: 'units',
        urgency: 'critical',
        status: 'active',
        medical_justification: 'End-stage renal disease, dialysis failing',
        special_requirements: 'HLA compatible, blood type O+ or O-',
        required_by_date: '2024-12-15'
      },
      {
        recipient_id: recipientIds[2].id,
        type: 'blood',
        blood_type: 'B+',
        quantity: 3,
        unit: 'units',
        urgency: 'normal',
        status: 'active',
        medical_justification: 'Scheduled surgery for chronic condition',
        required_by_date: '2025-01-15'
      },
      {
        recipient_id: recipientIds[3].id,
        type: 'organ',
        organ_type: 'heart',
        quantity: 1,
        unit: 'units',
        urgency: 'critical',
        status: 'active',
        medical_justification: 'Cardiomyopathy, heart failure',
        special_requirements: 'Size match critical, blood type AB- or O-',
        required_by_date: '2024-12-20'
      },
      {
        recipient_id: recipientIds[0].id,
        type: 'tissue',
        organ_type: 'bone marrow',
        quantity: 1,
        unit: 'units',
        urgency: 'critical',
        status: 'fulfilled',
        medical_justification: 'Acute leukemia, chemotherapy failed',
        special_requirements: 'HLA 10/10 match required'
      },
      {
        recipient_id: recipientIds[1].id,
        type: 'blood',
        blood_type: 'O+',
        quantity: 1,
        unit: 'units',
        urgency: 'low',
        status: 'cancelled',
        medical_justification: 'Elective surgery postponed'
      }
    ];

    const insertRequest = db.prepare(`
      INSERT INTO requests (
        recipient_id, type, organ_type, blood_type, quantity, unit,
        urgency, status, medical_justification, special_requirements, required_by_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const requestIds = [];
    requests.forEach(request => {
      const result = insertRequest.run(
        request.recipient_id, request.type, request.organ_type || null,
        request.blood_type || null, request.quantity, request.unit,
        request.urgency, request.status, request.medical_justification,
        request.special_requirements || null, request.required_by_date || null
      );
      requestIds.push(result.lastInsertRowid);
    });

    // Create comprehensive matches
    const insertMatch = db.prepare(`
      INSERT INTO matches (
        donation_id, request_id, compatibility_score, distance_km, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    // Match A+ donation with A+ request
    insertMatch.run(donationIds[1], requestIds[0], 95, 25, 'accepted', 'Perfect blood type match, CMV status compatible');
    
    // Match kidney donation with kidney request
    insertMatch.run(donationIds[2], requestIds[1], 88, 150, 'pending', 'HLA compatibility confirmed, awaiting final approval');
    
    // Match B+ donation with B+ request
    insertMatch.run(donationIds[7], requestIds[2], 90, 50, 'completed', 'Successful transfusion completed');

    // Match bone marrow donation with bone marrow request
    insertMatch.run(donationIds[5], requestIds[4], 98, 75, 'completed', 'HLA 10/10 match, transplant successful');

    // Additional pending matches
    insertMatch.run(donationIds[4], requestIds[1], 85, 200, 'pending', 'O- universal donor, backup option');
    insertMatch.run(donationIds[0], requestIds[2], 75, 300, 'rejected', 'Distance too far, declined by recipient');

    console.log('Database seeded successfully with comprehensive sample data');
    console.log('Sample accounts:');
    console.log('Admin: admin@lifeshare.com / password');
    console.log('Donor: donor1@example.com / password');
    console.log('Recipient: recipient1@example.com / password');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}