import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, Heart, MapPin, Clock, Star, Phone, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function Matches() {
  const { token } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState<number | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/matching/my-matches', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptMatch = async (matchId: number) => {
    setActionLoading(matchId);
    try {
      const response = await fetch(`http://localhost:3001/api/matching/accept-match/${matchId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Refresh matches list
        fetchMatches();
        alert('Match accepted successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to accept match: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to accept match:', error);
      alert('Failed to accept match. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineMatch = async (matchId: number) => {
    setActionLoading(matchId);
    try {
      const response = await fetch(`http://localhost:3001/api/matching/decline-match/${matchId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: declineReason }),
      });

      if (response.ok) {
        // Refresh matches list
        fetchMatches();
        setShowDeclineModal(null);
        setDeclineReason('');
        alert('Match declined successfully.');
      } else {
        const error = await response.json();
        alert(`Failed to decline match: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to decline match:', error);
      alert('Failed to decline match. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Matches</h1>
        <p className="text-gray-600 mt-2">View and manage your donation matches</p>
      </div>

      {/* Matches List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Matches</h2>
        </div>
        
        {matches.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {matches.map((match: any) => (
              <div key={match.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                          {match.type} {match.blood_type || match.organ_type}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                          {match.status}
                        </span>
                      </div>
                      
                      {/* Match Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Donor Information</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>{match.donor_name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>{match.donor_phone}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Recipient Information</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>{match.recipient_name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>{match.recipient_phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Match Statistics */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-700">Compatibility</span>
                          </div>
                          <div className={`text-lg font-bold ${getCompatibilityColor(match.compatibility_score)}`}>
                            {match.compatibility_score}%
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-700">Distance</span>
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            {match.distance_km} km
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium text-gray-700">Quantity</span>
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            {match.quantity} {match.unit}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-700">Urgency</span>
                          </div>
                          <div className="text-lg font-bold text-gray-900 capitalize">
                            {match.urgency}
                          </div>
                        </div>
                      </div>
                      
                      {/* Medical Justification */}
                      {match.medical_justification && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Medical Justification:</strong> {match.medical_justification}
                          </p>
                        </div>
                      )}
                      
                      {/* Match Timeline */}
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            Matched on: {new Date(match.matched_at).toLocaleDateString()}
                          </span>
                        </div>
                        {match.decision_at && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              Decision made: {new Date(match.decision_at).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      {match.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Notes:</strong> {match.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  {match.status === 'pending' && (
                    <div className="ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => handleAcceptMatch(match.id)}
                        disabled={actionLoading === match.id}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>{actionLoading === match.id ? 'Accepting...' : 'Accept'}</span>
                      </button>
                      <button
                        onClick={() => setShowDeclineModal(match.id)}
                        disabled={actionLoading === match.id}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}

                  {/* Status Indicator for Non-Pending Matches */}
                  {match.status !== 'pending' && (
                    <div className="ml-4 flex items-center space-x-2">
                      {match.status === 'accepted' && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">Accepted</span>
                        </div>
                      )}
                      {match.status === 'rejected' && (
                        <div className="flex items-center space-x-2 text-red-600">
                          <XCircle className="h-5 w-5" />
                          <span className="font-medium">Declined</span>
                        </div>
                      )}
                      {match.status === 'completed' && (
                        <div className="flex items-center space-x-2 text-blue-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-600 mb-6">
              Matches will appear here when compatible donors and recipients are found.
            </p>
          </div>
        )}
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Decline Match</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Are you sure you want to decline this match? Please provide a reason (optional):
            </p>
            
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              placeholder="Reason for declining (optional)..."
            />
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeclineModal(null);
                  setDeclineReason('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeclineMatch(showDeclineModal)}
                disabled={actionLoading === showDeclineModal}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading === showDeclineModal ? 'Declining...' : 'Decline Match'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}