import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getRecommendations, generateRecommendations } from '../../api/api';
import { FaLightbulb, FaGraduationCap, FaBriefcase, FaStar, FaSync, FaBookmark } from 'react-icons/fa';

const Recommendations = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/user/login');
      return;
    }
    loadRecommendations();
  }, [navigate]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const response = await getRecommendations();
      setRecommendations(response.recommendations);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      setError('Failed to load recommendations. Try generating new ones.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError('');
      const response = await generateRecommendations();
      setRecommendations(response.recommendations);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      setError('Failed to generate recommendations. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rwanda-green"></div>
        <p className="ml-2 text-gray-600">Loading recommendations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FaLightbulb className="text-yellow-500 mr-3" />
              Personalized Recommendations
            </h1>
            <p className="text-gray-600 mt-1">
              Based on your skills, education, and interests
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-rwanda-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
          >
            <FaSync className={`mr-2 ${generating ? 'animate-spin' : ''}`} />
            {generating ? 'Generating...' : 'Refresh Recommendations'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!recommendations && !error && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h2 className="text-xl font-semibold text-gray-900">No Recommendations Yet</h2>
            <p className="text-gray-600 mt-2">
              Click the button above to generate personalized recommendations based on your profile.
            </p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="mt-4 bg-rwanda-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Generate Recommendations
            </button>
          </div>
        )}

        {recommendations && (
          <>
            {/* Last Generated */}
            <div className="text-sm text-gray-500 mb-6">
              Generated: {formatDate(recommendations.generatedAt)}
            </div>

            {/* Recommended Opportunities */}
            {recommendations.opportunities && recommendations.opportunities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaBriefcase className="text-rwanda-green mr-2" />
                  Recommended Opportunities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.opportunities.slice(0, 6).map((item) => (
                    <div key={item.opportunity._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900">{item.opportunity.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.opportunity.type === 'scholarship' ? 'bg-green-100 text-green-800' :
                          item.opportunity.type === 'job' ? 'bg-blue-100 text-blue-800' :
                          item.opportunity.type === 'internship' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.opportunity.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{item.opportunity.organization}</p>
                      <p className="text-sm text-gray-500">{item.opportunity.location}</p>
                      <div className="flex items-center mt-2">
                        <FaStar className="text-yellow-400 mr-1" size={12} />
                        <span className="text-sm text-gray-600">Match Score: {item.score}%</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-gray-400">{item.reason}</span>
                        <Link
                          to={`/opportunity/${item.opportunity._id}`}
                          className="text-rwanda-green hover:underline text-sm"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Internships */}
            {recommendations.internships && recommendations.internships.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaGraduationCap className="text-purple-500 mr-2" />
                  Recommended Internships
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.internships.slice(0, 6).map((item) => (
                    <div key={item.opportunity._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                      <h3 className="font-semibold text-gray-900">{item.opportunity.title}</h3>
                      <p className="text-sm text-gray-600 mt-2">{item.opportunity.organization}</p>
                      <p className="text-sm text-gray-500">{item.opportunity.location}</p>
                      <div className="flex items-center mt-2">
                        <FaStar className="text-yellow-400 mr-1" size={12} />
                        <span className="text-sm text-gray-600">Match Score: {item.score}%</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-gray-400">{item.reason}</span>
                        <Link
                          to={`/opportunity/${item.opportunity._id}`}
                          className="text-rwanda-green hover:underline text-sm"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Training Programs */}
            {recommendations.trainingPrograms && recommendations.trainingPrograms.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaBookmark className="text-blue-500 mr-2" />
                  Recommended Training Programs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.trainingPrograms.slice(0, 6).map((item) => (
                    <div key={item.provider._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <FaGraduationCap className="text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.provider.name}</h3>
                          <p className="text-sm text-gray-500">{item.provider.type}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {item.provider.programs[item.program]?.title || 'Training Program'}
                      </p>
                      <div className="flex items-center mt-2">
                        <FaStar className="text-yellow-400 mr-1" size={12} />
                        <span className="text-sm text-gray-600">Match Score: {item.score}%</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-gray-400">{item.reason}</span>
                        <Link
                          to={`/training-provider/${item.provider._id}`}
                          className="text-rwanda-green hover:underline text-sm"
                        >
                          Learn More →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Recommendations;