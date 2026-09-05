import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TestLogin = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    console.log('🔑 Token:', token);
    console.log('👤 User Data:', userData);
    
    if (token) {
      console.log('✅ User is logged in!');
      setTimeout(() => navigate('/user/dashboard'), 2000);
    } else {
      console.log('❌ User is NOT logged in');
      setTimeout(() => navigate('/user/login'), 2000);
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rwanda-green"></div>
      <p className="mt-4 text-gray-600">Checking login status...</p>
    </div>
  );
};

export default TestLogin;