import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getUserProfile } from '../api/api';

const UserProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        console.log('❌ No user token found');
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        console.log('🔑 Verifying user token...');
        const response = await getUserProfile();
        if (response.success) {
          console.log('✅ User authenticated:', response.user?.name);
          setIsAuthenticated(true);
        } else {
          console.log('❌ User authentication failed');
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ User auth error:', error);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rwanda-green"></div>
        <p className="mt-2 text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔒 Redirecting to user login...');
    return <Navigate to="/user/login" replace />;
  }

  return children;
};

export default UserProtectedRoute;