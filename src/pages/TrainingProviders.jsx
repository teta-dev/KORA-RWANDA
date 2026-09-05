import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTrainingProviders, getAllTrainingPrograms } from '../api/api';
import { FaBuilding, FaGraduationCap, FaStar, FaMapMarkerAlt, FaGlobe, FaCheckCircle } from 'react-icons/fa';

const TrainingProviders = () => {
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [providersRes, programsRes] = await Promise.all([
        getAllTrainingProviders(),
        getAllTrainingPrograms()
      ]);
      
      setProviders(providersRes.providers || []);
      setPrograms(programsRes.programs || []);
    } catch (error) {
      console.error('Failed to load training providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          program.program.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || program.provider.type === filterType;
    return matchesSearch && matchesType;
  });

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
        <p className="ml-2 text-gray-600">Loading training providers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Training & Education Providers</h1>
          <p className="text-gray-600 mt-2">Find the best training programs to advance your career</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search providers or programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rwanda-green"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg ${filterType === 'all' ? 'bg-rwanda-green text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('university')}
                className={`px-4 py-2 rounded-lg ${filterType === 'university' ? 'bg-rwanda-green text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Universities
              </button>
              <button
                onClick={() => setFilterType('vocational')}
                className={`px-4 py-2 rounded-lg ${filterType === 'vocational' ? 'bg-rwanda-green text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Vocational
              </button>
              <button
                onClick={() => setFilterType('online')}
                className={`px-4 py-2 rounded-lg ${filterType === 'online' ? 'bg-rwanda-green text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Online
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-rwanda-green">{providers.length}</div>
            <div className="text-sm text-gray-600">Training Providers</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-blue-600">{programs.length}</div>
            <div className="text-sm text-gray-600">Programs Available</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-purple-600">
              {providers.filter(p => p.isVerified).length}
            </div>
            <div className="text-sm text-gray-600">Verified Providers</div>
          </div>
        </div>

        {/* Programs Grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Programs</h2>
        {filteredPrograms.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No programs found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-rwanda-green bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                        <FaGraduationCap className="text-rwanda-green text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.program.title}</h3>
                        <p className="text-sm text-gray-600">{item.provider.name}</p>
                      </div>
                    </div>
                    {item.provider.isVerified && (
                      <FaCheckCircle className="text-green-500" title="Verified" />
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">{item.program.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {item.program.duration}
                    </span>
                    {item.program.cost && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        {item.program.cost}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaStar className="text-yellow-400 mr-1" />
                      {item.provider.rating || 'New'}
                    </div>
                    <Link
                      to={`/training-provider/${item.provider.id}`}
                      className="text-rwanda-green hover:underline text-sm"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Providers List */}
        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">All Training Providers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providers.map((provider) => (
            <div key={provider._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                  {provider.logo ? (
                    <img src={provider.logo} alt={provider.name} className="w-full h-full object-cover" />
                  ) : (
                    <FaBuilding className="text-gray-400 text-2xl" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                    {provider.isVerified && (
                      <FaCheckCircle className="text-green-500 ml-2" size={14} />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{getTypeLabel(provider.type)}</p>
                  {provider.location && (
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <FaMapMarkerAlt className="mr-1 text-gray-400" size={12} />
                      {provider.location}
                    </p>
                  )}
                  {provider.website && (
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-rwanda-green hover:underline flex items-center mt-1"
                    >
                      <FaGlobe className="mr-1" size={12} />
                      Visit Website
                    </a>
                  )}
                  <div className="flex items-center mt-2">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">{provider.rating || 'No ratings yet'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainingProviders;