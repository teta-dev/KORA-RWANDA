import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSavedOpportunities, unsaveOpportunity } from '../../api/api';
import { FaBookmark, FaTrash, FaArrowLeft, FaHeart } from 'react-icons/fa';

const Saved = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/user/login');
      return;
    }
    loadSaved();
  }, [navigate]);

  const loadSaved = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getSavedOpportunities();
      console.log('Saved opportunities:', response);
      setOpportunities(response.opportunities || []);
    } catch (error) {
      console.error('Failed to load saved:', error);
      setError('Failed to load saved opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (id) => {
    if (window.confirm('Remove this opportunity from your saved list?')) {
      try {
        await unsaveOpportunity(id);
        setOpportunities(opportunities.filter(opp => opp._id !== id));
      } catch (error) {
        alert('Failed to remove saved opportunity');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rwanda-green"></div>
        <p className="ml-2 text-gray-600">Loading saved opportunities...</p>
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
                <FaBookmark className="mr-2 text-rwanda-green" /> Saved Opportunities
              </h1>
              <p className="text-sm text-gray-500">{opportunities.length} opportunities saved</p>
            </div>
            <Link 
              to="/user/dashboard"
              className="text-rwanda-green hover:underline flex items-center"
            >
              <FaArrowLeft className="mr-1" /> Back to Dashboard
            </Link>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200 text-red-700">
              {error}
            </div>
          )}

          {opportunities.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💔</div>
              <p className="text-gray-500 text-lg">No saved opportunities yet.</p>
              <p className="text-gray-400 text-sm mt-2">Start saving opportunities you're interested in!</p>
              <Link 
                to="/opportunities" 
                className="inline-block mt-4 bg-rwanda-green text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Browse Opportunities
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {opportunities.map((opp) => (
                <div key={opp._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link 
                        to={`/opportunity/${opp._id}`} 
                        className="text-lg font-semibold text-gray-900 hover:text-rwanda-green transition-colors"
                      >
                        {opp.title}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">{opp.organization}</p>
                      <p className="text-sm text-gray-500">📍 {opp.location || 'Unknown Location'}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        ⏰ Deadline: {formatDate(opp.deadline)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          opp.type === 'scholarship' ? 'bg-green-100 text-green-800' :
                          opp.type === 'job' ? 'bg-blue-100 text-blue-800' :
                          opp.type === 'internship' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {opp.type?.charAt(0).toUpperCase() + opp.type?.slice(1)}
                        </span>
                        {opp.featured && (
                          <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnsave(opp._id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Remove from saved"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Saved;