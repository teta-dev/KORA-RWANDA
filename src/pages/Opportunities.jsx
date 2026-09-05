import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OpportunityCard from '../components/OpportunityCard';
import { fetchOpportunities } from '../api/api';

const Opportunities = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
      setSearchInput(search);
    } else {
      setSearchQuery('');
      setSearchInput('');
    }
  }, [location.search]);

  // Load opportunities when type or search changes
  useEffect(() => {
    loadOpportunities();
  }, [selectedType, searchQuery]);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (selectedType !== 'all') filters.type = selectedType;
      if (searchQuery) filters.search = searchQuery;
      
      const response = await fetchOpportunities(filters);
      
      let dataArray = [];
      if (response && response.data) {
        dataArray = response.data;
      } else if (Array.isArray(response)) {
        dataArray = response;
      }
      
      setOpportunities(dataArray);
    } catch (error) {
      console.error('Failed to load opportunities:', error);
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const encoded = encodeURIComponent(searchInput.trim().toLowerCase());
      navigate(`/opportunities?search=${encoded}`);
    }
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    const params = new URLSearchParams(location.search);
    if (searchQuery) {
      navigate(`/opportunities?search=${searchQuery}${type !== 'all' ? `&type=${type}` : ''}`);
    } else {
      navigate(`/opportunities${type !== 'all' ? `?type=${type}` : ''}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchInput('');
    navigate('/opportunities');
  };

  const types = ['all', 'scholarship', 'job', 'internship', 'training'];

  const getTypeDisplay = (type) => {
    if (type === 'all') return 'All';
    return type.charAt(0).toUpperCase() + type.slice(1) + 's';
  };

  // Search suggestions based on database content
  const getSuggestions = () => {
    return [
      'accountant', 'graduate', 'intern', 'marketing', 
      'software', 'engineering', 'scholar', 'mastercard',
      'data', 'science', 'tvet', 'trainer', 'bank', 'undp'
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rwanda-green"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-rwanda-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Search
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            )}
          </form>
          
          {/* Quick Suggestions */}
          {!searchQuery && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500">Try searching:</span>
              {getSuggestions().slice(0, 8).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearchInput(suggestion);
                    navigate(`/opportunities?search=${suggestion}`);
                  }}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {searchQuery ? `Results for "${searchQuery}"` : `${getTypeDisplay(selectedType)} Opportunities`}
          </h1>
          {searchQuery && (
            <p className="text-gray-600 mt-1">
              Found {opportunities.length} opportunity{opportunities.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Filter by Type:
            </label>
            <div className="flex flex-wrap gap-2">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedType === type
                      ? 'bg-rwanda-green text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rwanda-green"></div>
            <p className="mt-4 text-gray-600">Loading opportunities...</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg font-medium">
              {searchQuery ? `No opportunities found for "${searchQuery}"` : 'No opportunities found.'}
            </p>
            {searchQuery && (
              <div className="mt-4">
                <p className="text-gray-400">Try searching for:</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {['accountant', 'intern', 'software', 'scholar', 'data', 'tvet'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchInput(term);
                        navigate(`/opportunities?search=${term}`);
                      }}
                      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={clearSearch}
              className="mt-6 bg-rwanda-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse All Opportunities
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Showing {opportunities.length} opportunity{opportunities.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opportunity) => (
                <OpportunityCard key={opportunity._id} opportunity={opportunity} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Opportunities;