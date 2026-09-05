const API_URL = 'http://localhost:5000/api';

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getUserAuthHeader = () => {
  const token = localStorage.getItem('userToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getAdminAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// ============================================
// USER AUTH ENDPOINTS
// ============================================

export const registerUser = async (email, password, name) => {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    return response.json();
  } catch (error) {
    console.error('registerUser error:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    return response.json();
  } catch (error) {
    console.error('loginUser error:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) throw new Error('No token found');
    
    const timestamp = new Date().getTime();
    
    const response = await fetch(`${API_URL}/users/profile?_=${timestamp}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        throw new Error('Session expired. Please login again.');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to get profile');
    }
    return response.json();
  } catch (error) {
    console.error('getUserProfile error:', error);
    throw error;
  }
};

export const updateUserProfile = async (data) => {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getUserAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  } catch (error) {
    console.error('updateUserProfile error:', error);
    throw error;
  }
};

export const deleteUser = async () => {
  try {
    const response = await fetch(`${API_URL}/users/account`, {
      method: 'DELETE',
      headers: getUserAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to delete account');
    return response.json();
  } catch (error) {
    console.error('deleteUser error:', error);
    throw error;
  }
};

export const changeUserPassword = async (oldPassword, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/users/change-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getUserAuthHeader()
      },
      body: JSON.stringify({ oldPassword, newPassword })
    });
    if (!response.ok) throw new Error('Failed to change password');
    return response.json();
  } catch (error) {
    console.error('changeUserPassword error:', error);
    throw error;
  }
};

// ============================================
// ADMIN AUTH ENDPOINTS
// ============================================

export const loginAdmin = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  } catch (error) {
    console.error('loginAdmin error:', error);
    throw error;
  }
};

export const registerAdmin = async (email, password, name) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  } catch (error) {
    console.error('registerAdmin error:', error);
    throw error;
  }
};

export const verifyAdminToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Invalid token');
    return response.json();
  } catch (error) {
    console.error('verifyAdminToken error:', error);
    throw error;
  }
};

export const logoutAdmin = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST'
    });
    return response.json();
  } catch (error) {
    console.error('logoutAdmin error:', error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!response.ok) throw new Error('Failed to send reset email');
    return response.json();
  } catch (error) {
    console.error('forgotPassword error:', error);
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });
    if (!response.ok) throw new Error('Failed to reset password');
    return response.json();
  } catch (error) {
    console.error('resetPassword error:', error);
    throw error;
  }
};

export const changeAdminPassword = async (oldPassword, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAdminAuthHeader()
      },
      body: JSON.stringify({ oldPassword, newPassword })
    });
    if (!response.ok) throw new Error('Failed to change password');
    return response.json();
  } catch (error) {
    console.error('changeAdminPassword error:', error);
    throw error;
  }
};

// ============================================
// SAVED OPPORTUNITIES
// ============================================

export const saveOpportunity = async (opportunityId) => {
  try {
    const response = await fetch(`${API_URL}/users/save/${opportunityId}`, {
      method: 'POST',
      headers: getUserAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to save opportunity');
    return response.json();
  } catch (error) {
    console.error('saveOpportunity error:', error);
    throw error;
  }
};

export const unsaveOpportunity = async (opportunityId) => {
  try {
    const response = await fetch(`${API_URL}/users/save/${opportunityId}`, {
      method: 'DELETE',
      headers: getUserAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to unsave opportunity');
    return response.json();
  } catch (error) {
    console.error('unsaveOpportunity error:', error);
    throw error;
  }
};

export const getSavedOpportunities = async () => {
  try {
    const response = await fetch(`${API_URL}/users/saved`, {
      headers: getUserAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to get saved opportunities');
    return response.json();
  } catch (error) {
    console.error('getSavedOpportunities error:', error);
    throw error;
  }
};

// ============================================
// APPLICATIONS & CHECKLIST
// ============================================

export const applyToOpportunity = async (opportunityId) => {
  try {
    const response = await fetch(`${API_URL}/users/apply/${opportunityId}`, {
      method: 'POST',
      headers: getUserAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to apply');
    return response.json();
  } catch (error) {
    console.error('applyToOpportunity error:', error);
    throw error;
  }
};

export const getApplications = async () => {
  try {
    const response = await fetch(`${API_URL}/users/applications`, {
      headers: getUserAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to get applications');
    return response.json();
  } catch (error) {
    console.error('getApplications error:', error);
    throw error;
  }
};

export const getChecklist = async (opportunityId) => {
  try {
    const response = await fetch(`${API_URL}/users/checklist/${opportunityId}`, {
      headers: getUserAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to get checklist');
    return response.json();
  } catch (error) {
    console.error('getChecklist error:', error);
    throw error;
  }
};

export const updateChecklistItem = async (opportunityId, itemIndex, completed) => {
  try {
    const response = await fetch(`${API_URL}/users/checklist/${opportunityId}/${itemIndex}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getUserAuthHeader()
      },
      body: JSON.stringify({ completed })
    });
    if (!response.ok) throw new Error('Failed to update checklist');
    return response.json();
  } catch (error) {
    console.error('updateChecklistItem error:', error);
    throw error;
  }
};

// ============================================
// CV MANAGEMENT
// ============================================

export const saveCV = async (fileName, fileUrl) => {
  try {
    const response = await fetch(`${API_URL}/users/cv`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getUserAuthHeader()
      },
      body: JSON.stringify({ fileName, fileUrl })
    });
    if (!response.ok) throw new Error('Failed to save CV');
    return response.json();
  } catch (error) {
    console.error('saveCV error:', error);
    throw error;
  }
};

export const deleteCV = async () => {
  try {
    const response = await fetch(`${API_URL}/users/cv`, {
      method: 'DELETE',
      headers: getUserAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to delete CV');
    return response.json();
  } catch (error) {
    console.error('deleteCV error:', error);
    throw error;
  }
};

// ============================================
// REMINDERS
// ============================================

export const updateReminders = async (deadlineReminders) => {
  try {
    const response = await fetch(`${API_URL}/users/reminders`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getUserAuthHeader()
      },
      body: JSON.stringify({ deadlineReminders })
    });
    if (!response.ok) throw new Error('Failed to update reminders');
    return response.json();
  } catch (error) {
    console.error('updateReminders error:', error);
    throw error;
  }
};

export const getUpcomingDeadlines = async () => {
  try {
    const response = await fetch(`${API_URL}/users/upcoming-deadlines`, {
      headers: getUserAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to get deadlines');
    return response.json();
  } catch (error) {
    console.error('getUpcomingDeadlines error:', error);
    throw error;
  }
};

// ============================================
// OPPORTUNITY ENDPOINTS (Public)
// ============================================

export const fetchOpportunities = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/opportunities?${queryString}`);
    if (!response.ok) throw new Error('Failed to fetch opportunities');
    return response.json();
  } catch (error) {
    console.error('fetchOpportunities error:', error);
    throw error;
  }
};

export const fetchOpportunityById = async (id) => {
  try {
    console.log('Fetching opportunity by ID:', id);
    const response = await fetch(`${API_URL}/opportunities/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(errorData.message || 'Failed to fetch opportunity');
    }
    
    return response.json();
  } catch (error) {
    console.error('fetchOpportunityById error:', error);
    throw error;
  }
};

// ============================================
// ADMIN OPPORTUNITY MANAGEMENT (Protected)
// ============================================

export const createOpportunity = async (data) => {
  try {
    const response = await fetch(`${API_URL}/opportunities`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAdminAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create opportunity');
    return response.json();
  } catch (error) {
    console.error('createOpportunity error:', error);
    throw error;
  }
};

export const updateOpportunity = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/opportunities/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAdminAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update opportunity');
    return response.json();
  } catch (error) {
    console.error('updateOpportunity error:', error);
    throw error;
  }
};

export const deleteOpportunity = async (id) => {
  try {
    const response = await fetch(`${API_URL}/opportunities/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to delete opportunity');
    return response.json();
  } catch (error) {
    console.error('deleteOpportunity error:', error);
    throw error;
  }
};

// ============================================
// USER PROFILE & SETTINGS
// ============================================

export const getUserSettings = async () => {
  try {
    const response = await fetch(`${API_URL}/users/settings`, {
      headers: getUserAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to get settings');
    return response.json();
  } catch (error) {
    console.error('getUserSettings error:', error);
    throw error;
  }
};

export const updateUserSettings = async (settings) => {
  try {
    const response = await fetch(`${API_URL}/users/settings`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getUserAuthHeader()
      },
      body: JSON.stringify(settings)
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return response.json();
  } catch (error) {
    console.error('updateUserSettings error:', error);
    throw error;
  }
};

// ============================================
// ADMIN - USER MANAGEMENT
// ============================================

export const getAdminUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users/admin/users`, {
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  } catch (error) {
    console.error('getAdminUsers error:', error);
    throw error;
  }
};

export const getAdminUserById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/users/admin/users/${id}`, {
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  } catch (error) {
    console.error('getAdminUserById error:', error);
    throw error;
  }
};

export const deleteAdminUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}/users/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
  } catch (error) {
    console.error('deleteAdminUser error:', error);
    throw error;
  }
};

export const updateAdminUser = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/users/admin/users/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAdminAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  } catch (error) {
    console.error('updateAdminUser error:', error);
    throw error;
  }
};

// ============================================
// VERSION 3 - EMPLOYER ENDPOINTS
// ============================================

export const registerEmployer = async (data) => {
  try {
    const response = await fetch(`${API_URL}/employer/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    return response.json();
  } catch (error) {
    console.error('registerEmployer error:', error);
    throw error;
  }
};

export const loginEmployer = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/employer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    return response.json();
  } catch (error) {
    console.error('loginEmployer error:', error);
    throw error;
  }
};

export const getEmployerProfile = async () => {
  try {
    const token = localStorage.getItem('employerToken');
    if (!token) throw new Error('No token found');
    
    const response = await fetch(`${API_URL}/employer/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to get profile');
    return response.json();
  } catch (error) {
    console.error('getEmployerProfile error:', error);
    throw error;
  }
};

export const updateEmployerProfile = async (data) => {
  try {
    const token = localStorage.getItem('employerToken');
    if (!token) throw new Error('No token found');
    
    const response = await fetch(`${API_URL}/employer/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  } catch (error) {
    console.error('updateEmployerProfile error:', error);
    throw error;
  }
};

export const getEmployerJobs = async () => {
  try {
    const token = localStorage.getItem('employerToken');
    if (!token) throw new Error('No token found');
    
    const response = await fetch(`${API_URL}/employer/jobs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to get jobs');
    return response.json();
  } catch (error) {
    console.error('getEmployerJobs error:', error);
    throw error;
  }
};

export const postJob = async (data) => {
  try {
    const token = localStorage.getItem('employerToken');
    if (!token) throw new Error('No token found');
    
    const response = await fetch(`${API_URL}/employer/post-job`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to post job');
    return response.json();
  } catch (error) {
    console.error('postJob error:', error);
    throw error;
  }
};

export const addInternshipProgram = async (data) => {
  try {
    const token = localStorage.getItem('employerToken');
    if (!token) throw new Error('No token found');
    
    const response = await fetch(`${API_URL}/employer/internship-program`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to add internship');
    return response.json();
  } catch (error) {
    console.error('addInternshipProgram error:', error);
    throw error;
  }
};

// ============================================
// VERSION 3 - TRAINING PROVIDER ENDPOINTS
// ============================================

export const registerTrainingProvider = async (data) => {
  try {
    const response = await fetch(`${API_URL}/training-provider/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    return response.json();
  } catch (error) {
    console.error('registerTrainingProvider error:', error);
    throw error;
  }
};

export const loginTrainingProvider = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/training-provider/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    return response.json();
  } catch (error) {
    console.error('loginTrainingProvider error:', error);
    throw error;
  }
};

export const getTrainingProviderProfile = async () => {
  try {
    const token = localStorage.getItem('trainingProviderToken');
    if (!token) throw new Error('No token found');
    
    const response = await fetch(`${API_URL}/training-provider/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to get profile');
    return response.json();
  } catch (error) {
    console.error('getTrainingProviderProfile error:', error);
    throw error;
  }
};

export const updateTrainingProviderProfile = async (data) => {
  try {
    const token = localStorage.getItem('trainingProviderToken');
    if (!token) throw new Error('No token found');
    
    const response = await fetch(`${API_URL}/training-provider/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  } catch (error) {
    console.error('updateTrainingProviderProfile error:', error);
    throw error;
  }
};

export const addTrainingProgram = async (data) => {
  try {
    const token = localStorage.getItem('trainingProviderToken');
    if (!token) throw new Error('No token found');
    
    const response = await fetch(`${API_URL}/training-provider/program`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to add program');
    return response.json();
  } catch (error) {
    console.error('addTrainingProgram error:', error);
    throw error;
  }
};

export const getTrainingProviderPrograms = async () => {
  try {
    const token = localStorage.getItem('trainingProviderToken');
    if (!token) throw new Error('No token found');
    
    const response = await fetch(`${API_URL}/training-provider/programs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to get programs');
    return response.json();
  } catch (error) {
    console.error('getTrainingProviderPrograms error:', error);
    throw error;
  }
};

export const getAllTrainingProviders = async () => {
  try {
    const response = await fetch(`${API_URL}/training-provider/all`);
    if (!response.ok) throw new Error('Failed to get providers');
    return response.json();
  } catch (error) {
    console.error('getAllTrainingProviders error:', error);
    throw error;
  }
};

export const getAllTrainingPrograms = async () => {
  try {
    const response = await fetch(`${API_URL}/training-provider/programs`);
    if (!response.ok) throw new Error('Failed to get programs');
    return response.json();
  } catch (error) {
    console.error('getAllTrainingPrograms error:', error);
    throw error;
  }
};

// ============================================
// VERSION 3 - RECOMMENDATIONS
// ============================================

export const getRecommendations = async () => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) throw new Error('No token found');
    
    const response = await fetch(`${API_URL}/recommendations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to get recommendations');
    return response.json();
  } catch (error) {
    console.error('getRecommendations error:', error);
    throw error;
  }
};

export const generateRecommendations = async () => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) throw new Error('No token found');
    
    const response = await fetch(`${API_URL}/recommendations/generate`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to generate recommendations');
    return response.json();
  } catch (error) {
    console.error('generateRecommendations error:', error);
    throw error;
  }
};

export const getOpportunityMatches = async (opportunityId) => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) throw new Error('No token found');
    
    const response = await fetch(`${API_URL}/recommendations/matches/${opportunityId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to get matches');
    return response.json();
  } catch (error) {
    console.error('getOpportunityMatches error:', error);
    throw error;
  }
};