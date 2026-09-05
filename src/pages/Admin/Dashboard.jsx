import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  fetchOpportunities, 
  deleteOpportunity,
  getAdminUsers,
  deleteAdminUser
} from '../../api/api';
import { 
  FaUsers, 
  FaGraduationCap, 
  FaBriefcase, 
  FaClipboardList, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaStar,
  FaSearch,
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaBookmark,
  FaUserPlus,
  FaUserMinus,
  FaChartLine,
  FaSpinner
} from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpps, setFilteredOpps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [adminName, setAdminName] = useState('');
  
  // User management state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [showUserDeleteModal, setShowUserDeleteModal] = useState(null);
  const [activeTab, setActiveTab] = useState('opportunities'); // 'opportunities' | 'users'

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
    setAdminName(adminData.name || 'Admin');
    loadOpportunities();
    loadUsers();
  }, []);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const data = await fetchOpportunities();
      const opps = data.data || [];
      setOpportunities(opps);
      setFilteredOpps(opps);
    } catch (error) {
      console.error('Failed to load opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const data = await getAdminUsers();
      setUsers(data.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleDeleteOpportunity = async (id) => {
    try {
      await deleteOpportunity(id);
      await loadOpportunities();
      setShowDeleteModal(null);
    } catch (error) {
      alert('Failed to delete opportunity');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteAdminUser(id);
      await loadUsers();
      setShowUserDeleteModal(null);
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterOpportunities(term, filterType);
  };

  const handleFilter = (type) => {
    setFilterType(type);
    filterOpportunities(searchTerm, type);
  };

  const filterOpportunities = (term, type) => {
    let filtered = opportunities;
    
    if (term) {
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(term) ||
        opp.organization.toLowerCase().includes(term) ||
        opp.type.toLowerCase().includes(term)
      );
    }
    
    if (type !== 'all') {
      filtered = filtered.filter(opp => opp.type === type);
    }
    
    setFilteredOpps(filtered);
  };

  const getTypeBadge = (type) => {
    const colors = {
      scholarship: 'bg-green-100 text-green-800',
      job: 'bg-blue-100 text-blue-800',
      internship: 'bg-purple-100 text-purple-800',
      training: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type) => {
    const icons = {
      scholarship: <FaGraduationCap className="mr-1" />,
      job: <FaBriefcase className="mr-1" />,
      internship: <FaClipboardList className="mr-1" />,
      training: <FaUsers className="mr-1" />
    };
    return icons[type] || null;
  };

  const stats = {
    total: opportunities.length,
    scholarships: opportunities.filter(o => o.type === 'scholarship').length,
    jobs: opportunities.filter(o => o.type === 'job').length,
    internships: opportunities.filter(o => o.type === 'internship').length,
    training: opportunities.filter(o => o.type === 'training').length,
    featured: opportunities.filter(o => o.featured).length,
    verified: opportunities.filter(o => o.verified).length
  };

  const userStats = {
    total: users.length,
    withSaved: users.filter(u => u.savedOpportunities?.length > 0).length,
    withApplications: users.filter(u => u.appliedOpportunities?.length > 0).length
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      navigate('/admin/login');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {adminName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/add"
                className="bg-rwanda-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" /> Add Opportunity
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'opportunities'
                ? 'border-rwanda-green text-rwanda-green'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaClipboardList className="inline mr-2" />
            Opportunities
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-rwanda-green text-rwanda-green'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaUsers className="inline mr-2" />
            Users
            {users.length > 0 && (
              <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {users.length}
              </span>
            )}
          </button>
        </div>

        {/* ============ OPPORTUNITIES TAB ============ */}
        {activeTab === 'opportunities' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-rwanda-green">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-green-600">{stats.scholarships}</div>
                <div className="text-sm text-gray-600">Scholarships</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-blue-600">{stats.jobs}</div>
                <div className="text-sm text-gray-600">Jobs</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-purple-600">{stats.internships}</div>
                <div className="text-sm text-gray-600">Internships</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-yellow-600">{stats.training}</div>
                <div className="text-sm text-gray-600">Training</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-orange-600">{stats.featured}</div>
                <div className="text-sm text-gray-600">Featured</div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rwanda-green"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleFilter('all')}
                    className={`px-4 py-2 rounded-lg ${filterType === 'all' ? 'bg-rwanda-green text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleFilter('scholarship')}
                    className={`px-4 py-2 rounded-lg ${filterType === 'scholarship' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Scholarships
                  </button>
                  <button
                    onClick={() => handleFilter('job')}
                    className={`px-4 py-2 rounded-lg ${filterType === 'job' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Jobs
                  </button>
                  <button
                    onClick={() => handleFilter('internship')}
                    className={`px-4 py-2 rounded-lg ${filterType === 'internship' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Internships
                  </button>
                  <button
                    onClick={() => handleFilter('training')}
                    className={`px-4 py-2 rounded-lg ${filterType === 'training' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Training
                  </button>
                </div>
              </div>
            </div>

            {/* Opportunities Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">All Opportunities</h2>
                <span className="text-sm text-gray-500">{filteredOpps.length} items</span>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rwanda-green"></div>
                  <p className="mt-2 text-gray-600">Loading...</p>
                </div>
              ) : filteredOpps.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No opportunities found.</p>
                  <Link to="/admin/add" className="text-rwanda-green hover:underline">
                    Add your first opportunity
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOpps.map((opp) => (
                        <tr key={opp._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{opp.title}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 inline-flex items-center text-xs font-semibold rounded-full ${getTypeBadge(opp.type)}`}>
                              {getTypeIcon(opp.type)}
                              {opp.type.charAt(0).toUpperCase() + opp.type.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {opp.organization}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {formatDate(opp.deadline)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {opp.verified ? (
                                <span className="px-2 py-1 inline-flex items-center text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  <FaCheck className="mr-1" size={10} /> Verified
                                </span>
                              ) : (
                                <span className="px-2 py-1 inline-flex items-center text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  <FaTimes className="mr-1" size={10} /> Pending
                                </span>
                              )}
                              {opp.featured && (
                                <span className="px-2 py-1 inline-flex items-center text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                  <FaStar className="mr-1" size={10} /> Featured
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Link
                                to={`/admin/edit/${opp._id}`}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                              >
                                <FaEdit />
                              </Link>
                              <button
                                onClick={() => setShowDeleteModal(opp._id)}
                                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ============ USERS TAB ============ */}
        {activeTab === 'users' && (
          <>
            {/* User Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="bg-rwanda-green bg-opacity-10 p-3 rounded-full">
                    <FaUsers className="text-rwanda-green text-2xl" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{userStats.total}</div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="bg-blue-500 bg-opacity-10 p-3 rounded-full">
                    <FaBookmark className="text-blue-500 text-2xl" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{userStats.withSaved}</div>
                    <div className="text-sm text-gray-600">Saved Opportunities</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="bg-purple-500 bg-opacity-10 p-3 rounded-full">
                    <FaClipboardList className="text-purple-500 text-2xl" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{userStats.withApplications}</div>
                    <div className="text-sm text-gray-600">Applications</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FaUsers className="mr-2" /> Registered Users
                </h2>
                <span className="text-sm text-gray-500">{users.length} users</span>
              </div>

              {usersLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rwanda-green"></div>
                  <p className="mt-2 text-gray-600">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No users registered yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saved</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-rwanda-green bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                                <FaUser className="text-rwanda-green" size={14} />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-xs text-gray-500">ID: {user._id.slice(-8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <FaEnvelope className="mr-1 text-gray-400" size={12} />
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <FaCalendar className="inline mr-1 text-gray-400" size={12} />
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {user.savedOpportunities?.length || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {user.appliedOpportunities?.length || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => setShowUserDeleteModal(user._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete User"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ============ DELETE OPPORTUNITY MODAL ============ */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this opportunity? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOpportunity(showDeleteModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ DELETE USER MODAL ============ */}
      {showUserDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete User</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This will permanently remove all their data including saved opportunities and applications.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUserDeleteModal(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showUserDeleteModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;