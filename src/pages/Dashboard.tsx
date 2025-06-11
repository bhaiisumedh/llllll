import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Users, Calendar, Clock, Activity, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalRequests: 0,
    activeMatches: 0,
    pendingMatches: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's donations/requests based on role
      const endpoint = user?.role === 'donor' ? 'donations/my-donations' : 'donations/my-requests';
      const response = await fetch(`http://localhost:3001/api/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(prev => ({
          ...prev,
          [user?.role === 'donor' ? 'totalDonations' : 'totalRequests']: data.length
        }));
      }

      // Fetch matches
      const matchesResponse = await fetch('http://localhost:3001/api/matching/my-matches', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (matchesResponse.ok) {
        const matchesData = await matchesResponse.json();
        setStats(prev => ({
          ...prev,
          activeMatches: matchesData.length,
          pendingMatches: matchesData.filter((m: any) => m.status === 'pending').length
        }));
        setRecentActivity(matchesData.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl text-white p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
        <p className="text-red-100 text-lg">
          {user?.role === 'donor' 
            ? 'Thank you for your commitment to saving lives through donation.'
            : user?.role === 'recipient'
            ? 'We\'re here to help you find the perfect match for your needs.'
            : 'Manage the platform and oversee life-saving connections.'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {user?.role === 'donor' ? 'My Donations' : 'My Requests'}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {user?.role === 'donor' ? stats.totalDonations : stats.totalRequests}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Matches</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeMatches}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Matches</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingMatches}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900">
                {user?.role === 'donor' ? stats.totalDonations : stats.totalRequests}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.role === 'donor' && (
            <>
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors">
                <Heart className="h-5 w-5 text-red-600" />
                <span className="font-medium">Register New Donation</span>
              </button>
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
                <Activity className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Check Eligibility</span>
              </button>
            </>
          )}
          {user?.role === 'recipient' && (
            <>
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors">
                <Heart className="h-5 w-5 text-red-600" />
                <span className="font-medium">Create New Request</span>
              </button>
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors">
                <Users className="h-5 w-5 text-green-600" />
                <span className="font-medium">Find Matches</span>
              </button>
            </>
          )}
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
            <Calendar className="h-5 w-5 text-gray-600" />
            <span className="font-medium">View Calendar</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity: any, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Activity className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Match found for {activity.type} donation
                  </p>
                  <p className="text-sm text-gray-600">
                    Compatibility score: {activity.compatibility_score}%
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(activity.matched_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity to display</p>
          </div>
        )}
      </div>

      {/* Emergency Alerts */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
          <h2 className="text-xl font-semibold text-yellow-800">Emergency Requests</h2>
        </div>
        <p className="text-yellow-700 mb-4">
          There are currently urgent donation requests in your area that match your profile.
        </p>
        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
          View Emergency Requests
        </button>
      </div>
    </div>
  );
}