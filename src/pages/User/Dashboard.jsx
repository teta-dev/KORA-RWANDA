import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserProfile, getSavedOpportunities, getApplications, getUpcomingDeadlines } from '../../api/api';
import { FaUser, FaBookmark, FaClipboardList, FaBell, FaCalendar, FaSignOutAlt } from 'react-icons/fa';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState([]);
  const [applications, setApplications] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/user/login');
      return;
    }
    loadDashboard();
  }, [navigate]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading dashboard data...');
      
      const [profileRes, savedRes, appsRes, deadlinesRes] = await Promise.all([
        getUserProfile(),
        getSavedOpportunities(),
        getApplications(),
        getUpcomingDeadlines()
      ]);

      console.log('Profile data:', profileRes);
      setUser(profileRes.user);
      setSaved(savedRes.opportunities || []);
      setApplications(appsRes.applications || []);
      setDeadlines(deadlinesRes.upcomingDeadlines || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      setError('Failed to load dashboard data');
      // If token is invalid, redirect to login
      if (error.message === 'Session expired. Please login again.' || 
          error.message === 'No token found') {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        navigate('/user/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      navigate('/');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rwanda-green"></div>
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-rwanda-green text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name || 'User'}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-800 transition-colors"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaUser className="text-rwanda-green text-2xl mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{user ? 1 : 0}</div>
                <div className="text-sm text-gray-600">Profile</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaBookmark className="text-blue-600 text-2xl mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{saved.length}</div>
                <div className="text-sm text-gray-600">Saved</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaClipboardList className="text-purple-600 text-2xl mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
                <div className="text-sm text-gray-600">Applications</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaBell className="text-orange-600 text-2xl mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{deadlines.length}</div>
                <div className="text-sm text-gray-600">Upcoming Deadlines</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/user/saved" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900">📚 Saved Opportunities</h3>
            <p className="text-gray-600 text-sm mt-2">View all your saved opportunities</p>
          </Link>
          <Link to="/user/applications" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900">📋 My Applications</h3>
            <p className="text-gray-600 text-sm mt-2">Track your application status</p>
          </Link>
          <Link to="/user/profile" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900">👤 My Profile</h3>
            <p className="text-gray-600 text-sm mt-2">Update your personal information</p>
          </Link>
        </div>

        {/* Additional Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/user/cv" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900">📄 CV Builder</h3>
            <p className="text-gray-600 text-sm mt-2">Create and manage your CV</p>
          </Link>
          <Link to="/user/deadlines" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900">⏰ Deadlines</h3>
            <p className="text-gray-600 text-sm mt-2">View all upcoming deadlines</p>
          </Link>
        </div>

        {/* Upcoming Deadlines */}
        {deadlines.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">⏰ Upcoming Deadlines</h2>
            <div className="space-y-3">
              {deadlines.slice(0, 5).map((opp, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium text-gray-900">{opp.title}</p>
                    <p className="text-sm text-gray-600">{opp.organization}</p>
                  </div>
                  <div className="text-sm text-red-600 font-semibold">
                    {new Date(opp.deadline).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;