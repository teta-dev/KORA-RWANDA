import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllTrainingProviders } from '../api/api';
import { FaStar, FaMapMarkerAlt, FaGlobe, FaGraduationCap, FaClock, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const TrainingProviderDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProvider();
  }, [id]);

  const loadProvider = async () => {
    try {
      setLoading(true);
      const response = await getAllTrainingProviders();
      const found = response.providers.find(p => p._id === id);
      if (found) {
        setProvider(found);
      } else {
        setError('Training provider not found');
      }
    } catch (error) {
      console.error('Failed to load provider:', error);
      setError('Failed to load provider details');
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      university: '🏛️ University',
      college: '📚 College',
      vocational: '🔧 Vocational',
      online: '💻 Online',
      corporate: '🏢 Corporate'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rwanda-green"></div>
        <p className="ml-2 text-gray-600">Loading provider details...</p>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Provider not found'}</p>
          <Link to="/training-providers" className="text-rwanda-green hover:underline mt-2 block">
            Browse all providers →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/training-providers"
          className="inline-flex items-center text-rwanda-green hover:underline mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back to Training Providers
        </Link>

        {/* Provider Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mr-6 overflow-hidden">
              {provider.logo ? (
                <img src={provider.logo} alt={provider.name} className="w-full h-full object-cover" />
              ) : (
                <FaGraduationCap className="text-gray-400 text-4xl" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-gray-900">{provider.name}</h1>
                {provider.isVerified && (
                  <FaCheckCircle className="text-green-500 ml-2" size={20} />
                )}
              </div>
              <p className="text-gray-600">{getTypeLabel(provider.type)}</p>
              {provider.location && (
                <p className="text-gray-500 flex items-center mt-1">
                  <FaMapMarkerAlt className="mr-1" /> {provider.location}
                </p>
              )}
              {provider.website && (
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rwanda-green hover:underline flex items-center mt-1"
                >
                  <FaGlobe className="mr-1" /> {provider.website}
                </a>
              )}
              <div className="flex items-center mt-2">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-gray-600">{provider.rating || 'No ratings yet'}</span>
              </div>
            </div>
          </div>
          {provider.description && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2">About</h3>
              <p className="text-gray-600">{provider.description}</p>
            </div>
          )}
        </div>

        {/* Programs */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Training Programs</h2>
        {provider.programs && provider.programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {provider.programs.map((program, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{program.title}</h3>
                  <span className={`text-sm ${program.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {program.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-2">{program.description}</p>
                <div className="flex flex-wrap gap-3 mt-3">
                  {program.duration && (
                    <span className="text-sm text-gray-500 flex items-center">
                      <FaClock className="mr-1" /> {program.duration}
                    </span>
                  )}
                  {program.cost && (
                    <span className="text-sm text-gray-500">{program.cost}</span>
                  )}
                </div>
                {program.skillsTaught && program.skillsTaught.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 font-medium">Skills Taught:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {program.skillsTaught.map((skill, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {program.requirements && program.requirements.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 font-medium">Requirements:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {program.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No training programs available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingProviderDetail;