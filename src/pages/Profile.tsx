import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Heart, AlertCircle, CheckCircle } from 'lucide-react';

export default function Profile() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: profile.first_name,
          lastName: profile.last_name,
          phone: profile.phone,
          dateOfBirth: profile.date_of_birth,
          gender: profile.gender,
          bloodType: profile.blood_type,
          locationCity: profile.location_city,
          locationState: profile.location_state,
          locationCountry: profile.location_country,
          medicalConditions: profile.medical_conditions,
          medications: profile.medications,
          emergencyContactName: profile.emergency_contact_name,
          emergencyContactPhone: profile.emergency_contact_phone,
        }),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setEditing(false);
      } else {
        setMessage('Failed to update profile. Please try again.');
      }
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-700">Failed to load profile data.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-4 rounded-full">
              <User className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-gray-600 capitalize">{profile.role}</p>
              <div className="flex items-center space-x-4 mt-2">
                {profile.is_eligible ? (
                  <span className="flex items-center space-x-1 text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Eligible</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Not Eligible</span>
                  </span>
                )}
                {profile.is_active ? (
                  <span className="text-green-600 text-sm">Active</span>
                ) : (
                  <span className="text-gray-500 text-sm">Inactive</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            disabled={saving}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : editing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            {editing ? (
              <input
                type="text"
                value={profile.first_name || ''}
                onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ) : (
              <p className="text-gray-900">{profile.first_name || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            {editing ? (
              <input
                type="text"
                value={profile.last_name || ''}
                onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ) : (
              <p className="text-gray-900">{profile.last_name || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <p className="text-gray-900">{profile.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            {editing ? (
              <input
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            {editing ? (
              <input
                type="date"
                value={profile.date_of_birth || ''}
                onChange={(e) => setProfile({...profile, date_of_birth: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p className="text-gray-900">
                  {profile.date_of_birth 
                    ? new Date(profile.date_of_birth).toLocaleDateString()
                    : 'Not provided'
                  }
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            {editing ? (
              <select
                value={profile.gender || ''}
                onChange={(e) => setProfile({...profile, gender: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <p className="text-gray-900 capitalize">{profile.gender || 'Not provided'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Medical Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
            {editing ? (
              <select
                value={profile.blood_type || ''}
                onChange={(e) => setProfile({...profile, blood_type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Blood Type</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            ) : (
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-400" />
                <p className="text-gray-900 font-medium">{profile.blood_type || 'Not provided'}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Donation</label>
            <p className="text-gray-900">
              {profile.last_donation_date 
                ? new Date(profile.last_donation_date).toLocaleDateString()
                : 'No previous donations'
              }
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
            {editing ? (
              <textarea
                value={profile.medical_conditions || ''}
                onChange={(e) => setProfile({...profile, medical_conditions: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="List any medical conditions..."
              />
            ) : (
              <p className="text-gray-900">{profile.medical_conditions || 'None reported'}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
            {editing ? (
              <textarea
                value={profile.medications || ''}
                onChange={(e) => setProfile({...profile, medications: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="List current medications..."
              />
            ) : (
              <p className="text-gray-900">{profile.medications || 'None reported'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Location</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            {editing ? (
              <input
                type="text"
                value={profile.location_city || ''}
                onChange={(e) => setProfile({...profile, location_city: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <p className="text-gray-900">{profile.location_city || 'Not provided'}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            {editing ? (
              <input
                type="text"
                value={profile.location_state || ''}
                onChange={(e) => setProfile({...profile, location_state: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ) : (
              <p className="text-gray-900">{profile.location_state || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            {editing ? (
              <input
                type="text"
                value={profile.location_country || ''}
                onChange={(e) => setProfile({...profile, location_country: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ) : (
              <p className="text-gray-900">{profile.location_country || 'Not provided'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Emergency Contact</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
            {editing ? (
              <input
                type="text"
                value={profile.emergency_contact_name || ''}
                onChange={(e) => setProfile({...profile, emergency_contact_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ) : (
              <p className="text-gray-900">{profile.emergency_contact_name || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
            {editing ? (
              <input
                type="tel"
                value={profile.emergency_contact_phone || ''}
                onChange={(e) => setProfile({...profile, emergency_contact_phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-gray-900">{profile.emergency_contact_phone || 'Not provided'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {editing && (
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setEditing(false);
              fetchProfile(); // Reset changes
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}