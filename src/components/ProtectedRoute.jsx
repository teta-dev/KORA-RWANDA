import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { verifyAdminToken } from '../api/api';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      // Check for both user and admin tokens
      const userToken = localStorage.getItem('userToken');
      const adminToken = localStorage.getItem('adminToken');
      
      // For user routes (dashboard)
      if (location.pathname === '/dashboard' || location.pathname === '/profile' || location.pathname === '/saved') {
        if (userToken) {
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      // For admin routes
      if (!adminToken) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await verifyAdminToken(adminToken);
        if (response.success) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
          setIsAuthenticated(false);
        }
      } catch (error) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rwanda-green"></div>
        <p className="ml-2 text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect based on route
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" />;
    }
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;