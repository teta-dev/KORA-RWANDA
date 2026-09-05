import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOpportunityById } from '../api/api';

const OpportunityDetail = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadOpportunity();
    }
  }, [id]);

  const loadOpportunity = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching opportunity with ID:', id);
      
      const data = await fetchOpportunityById(id);
      console.log('Opportunity data:', data);
      
      if (data.success && data.data) {
        setOpportunity(data.data);
      } else {
        setError('Opportunity not found');
      }
    } catch (err) {
      console.error('Error loading opportunity:', err);
      setError('Failed to load opportunity details. The opportunity might not exist.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rwanda-green"></div>
        <p className="mt-2 text-gray-600">Loading opportunity...</p>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Opportunity Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The opportunity you\'re looking for doesn\'t exist or has been removed.'}</p>
          <Link 
            to="/opportunities" 
            className="bg-rwanda-green text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Browse All Opportunities
          </Link>
        </div>
      </div>
    );
  }

  const getTypeStyles = (type) => {
    const styles = {
      scholarship: 'bg-green-100 text-green-800',
      job: 'bg-blue-100 text-blue-800',
      internship: 'bg-purple-100 text-purple-800',
      training: 'bg-yellow-100 text-yellow-800'
    };
    return styles[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{opportunity.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeStyles(opportunity.type)}`}>
              {opportunity.type?.charAt(0).toUpperCase() + opportunity.type?.slice(1) || 'Opportunity'}
            </span>
          </div>

          <div className="mb-6">
            <p className="text-lg text-gray-700">{opportunity.organization}</p>
            <p className="text-gray-600">📍 {opportunity.location || 'Unknown Location'}</p>
            <p className="text-gray-600">⏰ Deadline: {formatDate(opportunity.deadline)}</p>
            {opportunity.verified && (
              <span className="inline-block mt-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                ✅ Verified
              </span>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700">{opportunity.description || 'No description available.'}</p>
          </div>

          {opportunity.eligibility && opportunity.eligibility.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Eligibility Requirements</h2>
              <ul className="list-disc list-inside space-y-1">
                {opportunity.eligibility.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {opportunity.requiredDocuments && opportunity.requiredDocuments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Required Documents</h2>
              <ul className="list-disc list-inside space-y-1">
                {opportunity.requiredDocuments.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            {opportunity.applicationLink && (
              <a 
                href={opportunity.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-rwanda-green text-white text-center px-6 py-3 rounded-md font-medium hover:bg-green-700 transition-colors"
              >
                Apply Now
              </a>
            )}
            <Link 
              to="/opportunities"
              className="bg-gray-200 text-gray-800 text-center px-6 py-3 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              Browse More Opportunities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;