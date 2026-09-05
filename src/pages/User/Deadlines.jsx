import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUpcomingDeadlines, updateReminders } from '../../api/api';
import { FaBell, FaCalendar, FaClock, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const Deadlines = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deadlines, setDeadlines] = useState([]);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/user/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getUpcomingDeadlines();
      setDeadlines(response.upcomingDeadlines || []);
      
      // Load reminder settings
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setRemindersEnabled(settings.deadlineReminders !== false);
      }
    } catch (error) {
      console.error('Failed to load deadlines:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleReminders = async () => {
    setSaving(true);
    try {
      const newState = !remindersEnabled;
      setRemindersEnabled(newState);
      
      await updateReminders(newState);
      
      // Save settings locally
      const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      settings.deadlineReminders = newState;
      localStorage.setItem('userSettings', JSON.stringify(settings));
    } catch (error) {
      alert('Failed to update reminders');
      setRemindersEnabled(!remindersEnabled);
    } finally {
      setSaving(false);
    }
  };

  const getDaysLeft = (deadline) => {
    const now = new Date();
    const diff = new Date(deadline) - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const getUrgencyColor = (days) => {
    if (days <= 1) return 'text-red-600';
    if (days <= 3) return 'text-orange-500';
    if (days <= 7) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rwanda-green"></div>
        <p className="ml-2 text-gray-600">Loading deadlines...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaBell className="mr-2 text-rwanda-green" /> Upcoming Deadlines
              </h1>
              <p className="text-sm text-gray-500">
                {deadlines.length} deadlines in the next 7 days
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Reminders</span>
              <button
                onClick={toggleReminders}
                disabled={saving}
                className="text-2xl focus:outline-none"
              >
                {remindersEnabled ? (
                  <FaToggleOn className="text-rwanda-green" />
                ) : (
                  <FaToggleOff className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {deadlines.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No upcoming deadlines in the next 7 days.</p>
              <Link to="/opportunities" className="text-rwanda-green hover:underline">
                Browse opportunities →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {deadlines.map((opp) => {
                const daysLeft = getDaysLeft(opp.deadline);
                const urgencyColor = getUrgencyColor(daysLeft);
                
                return (
                  <div key={opp._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <Link to={`/opportunity/${opp._id}`} className="text-lg font-semibold text-gray-900 hover:text-rwanda-green">
                          {opp.title}
                        </Link>
                        <p className="text-sm text-gray-600">{opp.organization}</p>
                        <p className="text-sm text-gray-500">📍 {opp.location}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${urgencyColor}`}>
                          {daysLeft} days left
                        </p>
                        <p className="text-sm text-gray-500">
                          <FaCalendar className="inline mr-1" />
                          {new Date(opp.deadline).toLocaleDateString()}
                        </p>
                        <Link to={`/opportunity/${opp._id}`} className="text-sm text-rwanda-green hover:underline">
                          View →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Deadlines;