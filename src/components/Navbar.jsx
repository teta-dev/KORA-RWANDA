import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaUserPlus, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes, 
  FaBookmark, 
  FaClipboardList, 
  FaFileAlt, 
  FaBell,
  FaUsers,
  FaBuilding,
  FaGraduationCap,
  FaSearch
} from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isEmployer, setIsEmployer] = useState(false);
  const [isTrainingProvider, setIsTrainingProvider] = useState(false);
  const [userName, setUserName] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [providerName, setProviderName] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check all auth tokens
    const adminToken = localStorage.getItem('adminToken');
    const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
    if (adminToken) {
      setIsAdmin(true);
      if (adminToken) fetchUserCount();
    }

    const userToken = localStorage.getItem('userToken');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userToken) {
      setIsUser(true);
      setUserName(userData.name || 'User');
    }

    const employerToken = localStorage.getItem('employerToken');
    const employerData = JSON.parse(localStorage.getItem('employerData') || '{}');
    if (employerToken) {
      setIsEmployer(true);
      setEmployerName(employerData.companyName || 'Employer');
    }

    const providerToken = localStorage.getItem('trainingProviderToken');
    const providerData = JSON.parse(localStorage.getItem('trainingProviderData') || '{}');
    if (providerToken) {
      setIsTrainingProvider(true);
      setProviderName(providerData.name || 'Provider');
    }
  }, []);

  const fetchUserCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/admin/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserCount(data.data?.length || 0);
      }
    } catch (error) {}
  };

  const handleLogout = (type) => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    
    if (type === 'admin') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      setIsAdmin(false);
    } else if (type === 'user') {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      setIsUser(false);
      setUserName('');
    } else if (type === 'employer') {
      localStorage.removeItem('employerToken');
      localStorage.removeItem('employerData');
      setIsEmployer(false);
      setEmployerName('');
    } else if (type === 'provider') {
      localStorage.removeItem('trainingProviderToken');
      localStorage.removeItem('trainingProviderData');
      setIsTrainingProvider(false);
      setProviderName('');
    }
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/opportunities?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <span className="text-xl font-bold text-rwanda-green">Kora</span>
            <span className="text-xl font-bold text-rwanda-yellow">Rwanda</span>
          </Link>
          
          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-1.5 pl-10 pr-4 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rwanda-green focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3 text-sm">
            <Link to="/opportunities" className="text-gray-700 hover:text-rwanda-green whitespace-nowrap">Opportunities</Link>
            <Link to="/training-providers" className="text-gray-700 hover:text-rwanda-green whitespace-nowrap flex items-center">
              <FaGraduationCap className="mr-1" size={12} /> Training
            </Link>
            
            {/* User Section */}
            {isUser ? (
              <div className="flex items-center space-x-2">
                <Link to="/user/dashboard" className="text-gray-700 hover:text-rwanda-green flex items-center">
                  <FaUser className="mr-1" size={12} /> {userName}
                </Link>
                <button onClick={() => handleLogout('user')} className="text-red-500 hover:text-red-700 text-xs">Logout</button>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Link to="/user/login" className="text-gray-600 hover:text-rwanda-green text-sm">Login</Link>
                <Link to="/user/register" className="bg-rwanda-green text-white px-3 py-1 rounded text-sm hover:bg-green-700">Sign Up</Link>
              </div>
            )}

            {/* Employer Section */}
            {isEmployer ? (
              <div className="flex items-center space-x-2">
                <Link to="/employer/dashboard" className="text-blue-600 hover:underline flex items-center text-sm">
                  <FaBuilding className="mr-1" size={12} /> {employerName}
                </Link>
                <button onClick={() => handleLogout('employer')} className="text-red-500 hover:text-red-700 text-xs">Logout</button>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Link to="/employer/login" className="text-blue-600 hover:text-blue-800 text-sm">Employer</Link>
                <Link to="/employer/register" className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">Join</Link>
              </div>
            )}

            {/* Provider Section */}
            {isTrainingProvider ? (
              <div className="flex items-center space-x-2">
                <Link to="/training-provider/dashboard" className="text-purple-600 hover:underline flex items-center text-sm">
                  <FaGraduationCap className="mr-1" size={12} /> {providerName}
                </Link>
                <button onClick={() => handleLogout('provider')} className="text-red-500 hover:text-red-700 text-xs">Logout</button>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Link to="/training-provider/login" className="text-purple-600 hover:text-purple-800 text-sm">Provider</Link>
                <Link to="/training-provider/register" className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700">Join</Link>
              </div>
            )}

            {/* Admin */}
            {isAdmin ? (
              <div className="flex items-center space-x-2">
                <Link to="/admin" className="text-rwanda-green font-medium flex items-center text-sm">
                  Admin {userCount > 0 && <span className="ml-1 bg-rwanda-green text-white text-xs px-1.5 rounded-full">{userCount}</span>}
                </Link>
                <button onClick={() => handleLogout('admin')} className="text-red-500 hover:text-red-700 text-xs">Logout</button>
              </div>
            ) : (
              <Link to="/admin/login" className="text-gray-400 hover:text-rwanda-green text-xs">Admin</Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => navigate('/opportunities')}
              className="text-gray-600 hover:text-rwanda-green p-1"
            >
              <FaSearch size={18} />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-rwanda-green p-1"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 max-h-[80vh] overflow-y-auto">
          <div className="px-3 py-2 space-y-1">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rwanda-green"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>

            <Link to="/opportunities" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded" onClick={() => setIsMenuOpen(false)}>
              Opportunities
            </Link>
            <Link to="/training-providers" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded" onClick={() => setIsMenuOpen(false)}>
              Training Providers
            </Link>
            
            <div className="border-t border-gray-200 my-2"></div>

            {/* User Mobile */}
            {isUser ? (
              <>
                <Link to="/user/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded" onClick={() => setIsMenuOpen(false)}>
                  👤 {userName}
                </Link>
                <Link to="/user/saved" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded" onClick={() => setIsMenuOpen(false)}>
                  📚 Saved
                </Link>
                <Link to="/user/applications" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded" onClick={() => setIsMenuOpen(false)}>
                  📋 Applications
                </Link>
                <Link to="/recommendations" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded" onClick={() => setIsMenuOpen(false)}>
                  💡 Recommendations
                </Link>
                <button onClick={() => { handleLogout('user'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-50 rounded">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/user/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/user/register" className="block px-3 py-2 bg-rwanda-green text-white rounded text-center" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}

            <div className="border-t border-gray-200 my-2"></div>

            {/* Employer Mobile */}
            {isEmployer ? (
              <>
                <Link to="/employer/dashboard" className="block px-3 py-2 text-blue-600 hover:bg-gray-50 rounded" onClick={() => setIsMenuOpen(false)}>
                  🏢 {employerName}
                </Link>
                <button onClick={() => { handleLogout('employer'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-50 rounded">
                  Employer Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/employer/login" className="block px-3 py-2 text-blue-600 hover:bg-gray-50 rounded" onClick={() => setIsMenuOpen(false)}>
                  Employer Login
                </Link>
                <Link to="/employer/register" className="block px-3 py-2 bg-blue-600 text-white rounded text-center" onClick={() => setIsMenuOpen(false)}>
                  Employer Register
                </Link>
              </>
            )}

            <div className="border-t border-gray-200 my-2"></div>

            {/* Provider Mobile */}
            {isTrainingProvider ? (
              <>
                <Link to="/training-provider/dashboard" className="block px-3 py-2 text-purple-600 hover:bg-gray-50 rounded" onClick={() => setIsMenuOpen(false)}>
                  🎓 {providerName}
                </Link>
                <button onClick={() => { handleLogout('provider'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-50 rounded">
                  Provider Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/training-provider/login" className="block px-3 py-2 text-purple-600 hover:bg-gray-50 rounded" onClick={() => setIsMenuOpen(false)}>
                  Provider Login
                </Link>
                <Link to="/training-provider/register" className="block px-3 py-2 bg-purple-600 text-white rounded text-center" onClick={() => setIsMenuOpen(false)}>
                  Provider Register
                </Link>
              </>
            )}

            <div className="border-t border-gray-200 my-2"></div>

            {/* Admin Mobile */}
            {isAdmin ? (
              <>
                <Link to="/admin" className="block px-3 py-2 text-rwanda-green hover:bg-gray-50 rounded" onClick={() => setIsMenuOpen(false)}>
                  Admin Dashboard {userCount > 0 && <span className="ml-1 bg-rwanda-green text-white text-xs px-1.5 rounded-full">{userCount}</span>}
                </Link>
                <button onClick={() => { handleLogout('admin'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-50 rounded">
                  Admin Logout
                </button>
              </>
            ) : (
              <Link to="/admin/login" className="block px-3 py-2 text-gray-400 hover:text-rwanda-green rounded" onClick={() => setIsMenuOpen(false)}>
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;