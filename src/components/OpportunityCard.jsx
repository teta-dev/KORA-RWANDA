import { Link } from 'react-router-dom';

const OpportunityCard = ({ opportunity }) => {
  const getTypeColor = (type) => {
    const colors = {
      scholarship: 'bg-green-100 text-green-800',
      job: 'bg-blue-100 text-blue-800',
      internship: 'bg-purple-100 text-purple-800',
      training: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get the correct ID (MongoDB uses _id)
  const getId = () => {
    return opportunity._id || opportunity.id;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(opportunity.type)}`}>
            {opportunity.type ? opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1) : 'Opportunity'}
          </span>
          {opportunity.featured && (
            <span className="bg-rwanda-yellow text-white px-2.5 py-1 rounded-full text-xs font-medium">
              ⭐ Featured
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold mt-3 mb-1 text-gray-900 line-clamp-2">
          {opportunity.title || 'Untitled'}
        </h3>
        
        <p className="text-sm text-gray-600 mb-1">
          {opportunity.organization || 'Unknown Organization'}
        </p>
        
        <p className="text-sm text-gray-500 flex items-center mb-2">
          📍 {opportunity.location || 'Unknown Location'}
        </p>
        
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {opportunity.description || 'No description available'}
        </p>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            ⏰ {formatDate(opportunity.deadline)}
          </p>
          <Link 
            to={`/opportunity/${getId()}`}
            className="bg-rwanda-green text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;