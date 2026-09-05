import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getTrainingProviderProfile, addTrainingProgram } from '../../api/api';
import { 
  FaGraduationCap, 
  FaPlus, 
  FaEdit, 
  FaStar, 
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaTimes,
  FaBook,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';

const TrainingProviderDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [programForm, setProgramForm] = useState({
    title: '',
    description: '',
    duration: '',
    cost: '',
    requirements: [''],
    skillsTaught: [''],
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('trainingProviderToken');
    if (!token) {
      navigate('/training-provider/login');
      return;
    }
    loadDashboard();
  }, [navigate]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await getTrainingProviderProfile();
      setProvider(response.provider);
      setPrograms(response.provider.programs || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('trainingProviderToken');
      localStorage.removeItem('trainingProviderData');
      navigate('/');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProgramForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (index, field, value) => {
    const newArray = [...programForm[field]];
    newArray[index] = value;
    setProgramForm(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayField = (field) => {
    setProgramForm(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (index, field) => {
    const newArray = programForm[field].filter((_, i) => i !== index);
    setProgramForm(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleAddProgram = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      const data = {
        ...programForm,
        requirements: programForm.requirements.filter(item => item.trim() !== ''),
        skillsTaught: programForm.skillsTaught.filter(item => item.trim() !== '')
      };
      
      await addTrainingProgram(data);
      setMessage('Training program added successfully!');
      setShowProgramModal(false);
      await loadDashboard();
      resetForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError('Failed to add program');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setProgramForm({
      title: '',
      description: '',
      duration: '',
      cost: '',
      requirements: [''],
      skillsTaught: [''],
      startDate: '',
      endDate: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="ml-2 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Training Provider Dashboard</h1>
              <p className="text-sm text-gray-600">{provider?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 font-medium flex items-center"
              >
                <FaSignOutAlt className="mr-1" /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaBook className="text-purple-600 text-2xl mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{programs.length}</div>
                <div className="text-sm text-gray-600">Total Programs</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-600 text-2xl mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {programs.filter(p => p.isActive).length}
                </div>
                <div className="text-sm text-gray-600">Active Programs</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaStar className="text-yellow-500 text-2xl mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{provider?.rating || 0}</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-blue-600 text-2xl mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{provider?.location || 'N/A'}</div>
                <div className="text-sm text-gray-600">Location</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowProgramModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" /> Add Training Program
          </button>
          <Link
            to="/training-provider/profile"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            <FaEdit className="mr-2" /> Edit Profile
          </Link>
        </div>

        {/* Programs List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Your Training Programs</h2>
            <span className="text-sm text-gray-500">{programs.length} programs</span>
          </div>

          {programs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No training programs added yet.</p>
              <button
                onClick={() => setShowProgramModal(true)}
                className="text-purple-600 hover:underline"
              >
                Add your first program
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {programs.map((program, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{program.title}</h3>
                      <p className="text-sm text-gray-600">{program.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-sm text-gray-500 flex items-center">
                          <FaClock className="mr-1" /> {program.duration}
                        </span>
                        {program.cost && (
                          <span className="text-sm text-gray-500">{program.cost}</span>
                        )}
                        <span className={`text-sm ${program.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {program.isActive ? '✅ Active' : '❌ Inactive'}
                        </span>
                      </div>
                      {program.skillsTaught && program.skillsTaught.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {program.skillsTaught.map((skill, i) => (
                            <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Program Modal */}
      {showProgramModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Add Training Program</h3>
              <button
                onClick={() => setShowProgramModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddProgram}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Program Title *</label>
                <input
                  type="text"
                  name="title"
                  value={programForm.title}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={programForm.description}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={programForm.duration}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                    placeholder="e.g., 3 months"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                  <input
                    type="text"
                    name="cost"
                    value={programForm.cost}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                    placeholder="e.g., Free, $500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={programForm.startDate}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={programForm.endDate}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                {programForm.requirements.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange(index, 'requirements', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                      placeholder="Enter requirement"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, 'requirements')}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('requirements')}
                  className="text-purple-600 hover:underline"
                >
                  + Add Requirement
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Taught</label>
                {programForm.skillsTaught.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange(index, 'skillsTaught', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                      placeholder="Enter skill"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, 'skillsTaught')}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('skillsTaught')}
                  className="text-purple-600 hover:underline"
                >
                  + Add Skill
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Program'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProgramModal(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingProviderDashboard;