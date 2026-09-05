import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OpportunityCard from '../components/OpportunityCard';
import { fetchOpportunities } from '../api/api';

const Home = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const data = await fetchOpportunities({ featured: 'true' });
      setOpportunities(data.data || []);
    } catch (err) {
      setError('Failed to load opportunities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Without Search Bar */}
      <div className="bg-gradient-to-r from-rwanda-green to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Future in Rwanda
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Scholarships • Jobs • Internships • Training
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/opportunities" className="bg-white text-rwanda-green px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
                View All Opportunities
              </Link>
              <Link to="/scholarships" className="bg-rwanda-yellow text-gray-800 px-6 py-2 rounded-md font-medium hover:bg-yellow-400 transition-colors">
                Scholarships
              </Link>
              <Link to="/training-providers" className="bg-purple-600 text-white px-6 py-2 rounded-md font-medium hover:bg-purple-700 transition-colors">
                Training Providers
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-rwanda-green">{opportunities.length}+</div>
              <div className="text-gray-600">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rwanda-green">4</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rwanda-green">100%</div>
              <div className="text-gray-600">Free Access</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rwanda-green">2</div>
              <div className="text-gray-600">Languages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Opportunities */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Opportunities</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rwanda-green"></div>
            <p className="mt-2 text-gray-600">Loading opportunities...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No featured opportunities available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map(opportunity => (
              <OpportunityCard key={opportunity._id} opportunity={opportunity} />
            ))}
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How Kora Rwanda Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-rwanda-green rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Find Opportunities</h3>
              <p className="text-gray-600">Browse scholarships, jobs, internships, and training programs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rwanda-yellow rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Check Requirements</h3>
              <p className="text-gray-600">See eligibility, required documents, and deadlines</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rwanda-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Apply Successfully</h3>
              <p className="text-gray-600">Get checklists and guidance for your application</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-rwanda-green text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Future?</h2>
          <p className="text-xl mb-8">Join thousands of Rwandan students finding opportunities every day</p>
          <Link 
            to="/opportunities" 
            className="bg-white text-rwanda-green px-8 py-3 rounded-md font-medium hover:bg-gray-100 inline-block transition-colors"
          >
            Explore Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;