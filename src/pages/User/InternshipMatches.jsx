import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getOpportunityMatches, fetchOpportunityById } from '../../api/api';
import { FaUsers, FaUser, FaMapMarkerAlt, FaGraduationCap, FaTools, FaStar, FaArrowLeft } from 'react-icons/fa';

const InternshipMatches = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [opportunity, setOpportunity] = useState(null);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/user/login');
      return;
    }
    if (id) {
      loadMatches();
    } else {
      navigate('/opportunities');
    }
  }, [id, navigate]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError('');
      const [oppRes, matchRes] = await Promise.all([
        fetchOpportunityById(id),
        getOpportunityMatches(id)
      ]);
      
      setOpportunity(oppRes.data);
      setMatches(matchRes.matches || []);
    } catch (error) {
      console.error('Failed to load matches:', error);
      setError('Failed to load internship matches');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rwanda-green"></div>
        <p className="ml-2 text-gray-600">Loading matches...</p>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Opportunity not found'}</p>
          <Link to="/opportunities" className="text-rwanda-green hover:underline mt-2 block">
            Browse Opportunities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to={`/opportunity/${id}`}
          className="inline-flex items-center text-rwanda-green hover:underline mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back to Opportunity
        </Link>

        {/* Opportunity Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{opportunity.title}</h1>
              <p className="text-gray-600">{opportunity.organization}</p>
              <p className="text-gray-500 text-sm">{opportunity.location}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rwanda-green">{matches.length}</div>
              <div className="text-sm text-gray-600">Potential Matches</div>
            </div>
          </div>
        </div>

        {/* Matches List */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <FaUsers className="text-rwanda-green mr-2" />
          Top Matches
        </h2>

        {matches.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900">No Matches Found</h3>
            <p className="text-gray-600 mt-2">
              No users match this opportunity yet. Try posting it on social media to reach more candidates.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-rwanda-green bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                        <FaUser className="text-rwanda-green" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{match.user.name}</h3>
                        <p className="text-sm text-gray-500">{match.user.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {match.user.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaMapMarkerAlt className="text-gray-400 mr-1" />
                          {match.user.location}
                        </div>
                      )}
                      {match.user.education && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaGraduationCap className="text-gray-400 mr-1" />
                          {match.user.education}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <FaStar className="text-yellow-400 mr-1" />
                        Match Score: {match.score}%
                      </div>
                    </div>

                    {match.user.skills && match.user.skills.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaTools className="mr-1" />
                          Skills:
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {match.user.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-bold text-rwanda-green">
                      {match.score}% Match
                    </div>
                    <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-2 bg-rwanda-green rounded-full"
                        style={{ width: `${match.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipMatches;