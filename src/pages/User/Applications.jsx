import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getApplications } from '../../api/api';
import { FaClipboardList, FaCheck, FaClock, FaTimes, FaSpinner } from 'react-icons/fa';

const Applications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/user/login');
      return;
    }
    loadApplications();
  }, [navigate]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await getApplications();
      setApplications(response.applications || []);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock className="mr-1" /> },
      reviewing: { color: 'bg-blue-100 text-blue-800', icon: <FaSpinner className="mr-1 animate-spin" /> },
      accepted: { color: 'bg-green-100 text-green-800', icon: <FaCheck className="mr-1" /> },
      rejected: { color: 'bg-red-100 text-red-800', icon: <FaTimes className="mr-1" /> }
    };
    return statusMap[status] || statusMap.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rwanda-green"></div>
        <p className="ml-2 text-gray-600">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaClipboardList className="mr-2 text-rwanda-green" /> My Applications
            </h1>
            <p className="text-sm text-gray-500">{applications.length} applications submitted</p>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">You haven't applied to any opportunities yet.</p>
              <Link to="/opportunities" className="text-rwanda-green hover:underline">
                Browse opportunities →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {applications.map((app, index) => {
                const opportunity = app.opportunity;
                const statusInfo = getStatusBadge(app.status);
                
                return (
                  <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link to={`/opportunity/${opportunity?._id}`} className="text-lg font-semibold text-gray-900 hover:text-rwanda-green">
                          {opportunity?.title || 'Unknown Opportunity'}
                        </Link>
                        <p className="text-sm text-gray-600">{opportunity?.organization || 'Unknown Organization'}</p>
                        <p className="text-sm text-gray-500">📍 {opportunity?.location || 'Unknown Location'}</p>
                        <p className="text-sm text-gray-500">
                          Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${statusInfo.color}`}>
                          {statusInfo.icon}
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                        <Link to={`/user/checklist/${opportunity?._id}`} className="text-sm text-rwanda-green hover:underline mt-2">
                          View Checklist →
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

export default Applications;