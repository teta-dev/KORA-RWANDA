import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getEmployerProfile, getEmployerJobs, postJob, addInternshipProgram } from '../../api/api';
import { 
  FaBuilding, 
  FaBriefcase, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaUsers, 
  FaStar,
  FaCalendar,
  FaMapMarkerAlt,
  FaGlobe,
  FaGraduationCap,
  FaClipboardList,
  FaSignOutAlt,
  FaTimes
} from 'react-icons/fa';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employer, setEmployer] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Job form state
  const [jobForm, setJobForm] = useState({
    title: '',
    type: 'job',
    description: '',
    deadline: '',
    eligibility: [''],
    requiredDocuments: [''],
    applicationLink: '',
    location: '',
    isInternship: false
  });

  // Internship form state
  const [internshipForm, setInternshipForm] = useState({
    title: '',
    description: '',
    duration: '',
    requirements: [''],
    startDate: '',
    endDate: '',
    positions: 1
  });

  useEffect(() => {
    const token = localStorage.getItem('employerToken');
    if (!token) {
      navigate('/employer/login');
      return;
    }
    loadDashboard();
  }, [navigate]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [profileRes, jobsRes] = await Promise.all([
        getEmployerProfile(),
        getEmployerJobs()
      ]);
      
      setEmployer(profileRes.employer);
      setJobs(jobsRes.jobs || []);
      setInternships(profileRes.employer.internshipPrograms || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      if (error.message === 'No token found') {
        navigate('/employer/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('employerToken');
      localStorage.removeItem('employerData');
      navigate('/');
    }
  };

  const handleJobFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJobForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleInternshipFormChange = (e) => {
    const { name, value } = e.target;
    setInternshipForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (index, field, value, formType) => {
    const form = formType === 'job' ? jobForm : internshipForm;
    const newArray = [...form[field]];
    newArray[index] = value;
    if (formType === 'job') {
      setJobForm(prev => ({ ...prev, [field]: newArray }));
    } else {
      setInternshipForm(prev => ({ ...prev, [field]: newArray }));
    }
  };

  const addArrayField = (field, formType) => {
    const form = formType === 'job' ? jobForm : internshipForm;
    const newArray = [...form[field], ''];
    if (formType === 'job') {
      setJobForm(prev => ({ ...prev, [field]: newArray }));
    } else {
      setInternshipForm(prev => ({ ...prev, [field]: newArray }));
    }
  };

  const removeArrayField = (index, field, formType) => {
    const form = formType === 'job' ? jobForm : internshipForm;
    const newArray = form[field].filter((_, i) => i !== index);
    if (formType === 'job') {
      setJobForm(prev => ({ ...prev, [field]: newArray }));
    } else {
      setInternshipForm(prev => ({ ...prev, [field]: newArray }));
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      const data = {
        ...jobForm,
        eligibility: jobForm.eligibility.filter(item => item.trim() !== ''),
        requiredDocuments: jobForm.requiredDocuments.filter(item => item.trim() !== ''),
        companyName: employer?.companyName
      };
      
      await postJob(data);
      setMessage('Job posted successfully!');
      setShowJobModal(false);
      await loadDashboard();
      resetJobForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError('Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddInternship = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      const data = {
        ...internshipForm,
        requirements: internshipForm.requirements.filter(item => item.trim() !== '')
      };
      
      await addInternshipProgram(data);
      setMessage('Internship program added successfully!');
      setShowInternshipModal(false);
      await loadDashboard();
      resetInternshipForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError('Failed to add internship program');
    } finally {
      setSubmitting(false);
    }
  };

  const resetJobForm = () => {
    setJobForm({
      title: '',
      type: 'job',
      description: '',
      deadline: '',
      eligibility: [''],
      requiredDocuments: [''],
      applicationLink: '',
      location: '',
      isInternship: false
    });
  };

  const resetInternshipForm = () => {
    setInternshipForm({
      title: '',
      description: '',
      duration: '',
      requirements: [''],
      startDate: '',
      endDate: '',
      positions: 1
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rwanda-green"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
              <p className="text-sm text-gray-600">{employer?.companyName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/employer/profile"
                className="text-gray-600 hover:text-rwanda-green transition-colors"
              >
                <FaEdit className="inline mr-1" /> Profile
              </Link>
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
        {/* Message */}
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
              <FaBriefcase className="text-rwanda-green text-2xl mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{jobs.length}</div>
                <div className="text-sm text-gray-600">Total Jobs</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaGraduationCap className="text-blue-600 text-2xl mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{internships.length}</div>
                <div className="text-sm text-gray-600">Internships</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaStar className="text-yellow-500 text-2xl mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{employer?.rating || 0}</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaUsers className="text-purple-600 text-2xl mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Applications</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowJobModal(true)}
            className="bg-rwanda-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" /> Post a Job
          </button>
          <button
            onClick={() => setShowInternshipModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" /> Add Internship Program
          </button>
          <Link
            to="/employer/profile"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            <FaEdit className="mr-2" /> Edit Profile
          </Link>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Posted Jobs</h2>
            <span className="text-sm text-gray-500">{jobs.length} jobs</span>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No jobs posted yet.</p>
              <button
                onClick={() => setShowJobModal(true)}
                className="text-rwanda-green hover:underline"
              >
                Post your first job
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <div key={job._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.organization}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          job.type === 'scholarship' ? 'bg-green-100 text-green-800' :
                          job.type === 'job' ? 'bg-blue-100 text-blue-800' :
                          job.type === 'internship' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <FaMapMarkerAlt className="mr-1" /> {job.location}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <FaCalendar className="mr-1" /> Deadline: {formatDate(job.deadline)}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/opportunity/${job._id}`}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Internship Programs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Internship Programs</h2>
            <span className="text-sm text-gray-500">{internships.length} programs</span>
          </div>

          {internships.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No internship programs added yet.</p>
              <button
                onClick={() => setShowInternshipModal(true)}
                className="text-rwanda-green hover:underline"
              >
                Add your first internship program
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {internships.map((program, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{program.title}</h3>
                      <p className="text-sm text-gray-600">{program.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-sm text-gray-500">Duration: {program.duration}</span>
                        <span className="text-sm text-gray-500">Positions: {program.positions}</span>
                        <span className={`text-sm ${program.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {program.isActive ? '✅ Active' : '❌ Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Post a New Job</h3>
              <button
                onClick={() => setShowJobModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handlePostJob}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={jobForm.title}
                    onChange={handleJobFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rwanda-green"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={jobForm.location}
                    onChange={handleJobFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rwanda-green"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={jobForm.description}
                  onChange={handleJobFormChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rwanda-green"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
                  <input
                    type="date"
                    name="deadline"
                    value={jobForm.deadline}
                    onChange={handleJobFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rwanda-green"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Link *</label>
                  <input
                    type="url"
                    name="applicationLink"
                    value={jobForm.applicationLink}
                    onChange={handleJobFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rwanda-green"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Requirements</label>
                {jobForm.eligibility.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange(index, 'eligibility', e.target.value, 'job')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rwanda-green"
                      placeholder="Enter eligibility requirement"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, 'eligibility', 'job')}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('eligibility', 'job')}
                  className="text-rwanda-green hover:underline"
                >
                  + Add Eligibility
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Documents</label>
                {jobForm.requiredDocuments.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange(index, 'requiredDocuments', e.target.value, 'job')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rwanda-green"
                      placeholder="Enter required document"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, 'requiredDocuments', 'job')}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('requiredDocuments', 'job')}
                  className="text-rwanda-green hover:underline"
                >
                  + Add Document
                </button>
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="isInternship"
                  checked={jobForm.isInternship}
                  onChange={handleJobFormChange}
                  className="w-4 h-4 text-rwanda-green focus:ring-rwanda-green"
                />
                <label className="ml-2 text-sm text-gray-700">This is an Internship position</label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-rwanda-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Post Job'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Internship Modal */}
      {showInternshipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Add Internship Program</h3>
              <button
                onClick={() => setShowInternshipModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddInternship}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Program Title *</label>
                <input
                  type="text"
                  name="title"
                  value={internshipForm.title}
                  onChange={handleInternshipFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rwanda-green"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={internshipForm.description}
                  onChange={handleInternshipFormChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rwanda-green"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={internshipForm.duration}
                    onChange={handleInternshipFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rwanda-green"
                    placeholder="e.g., 3 months"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Positions *</label>
                  <input
                    type="number"
                    name="positions"
                    value={internshipForm.positions}
                    onChange={handleInternshipFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rwanda-green"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={internshipForm.startDate}
                    onChange={handleInternshipFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rwanda-green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={internshipForm.endDate}
                    onChange={handleInternshipFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rwanda-green"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                {internshipForm.requirements.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange(index, 'requirements', e.target.value, 'internship')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rwanda-green"
                      placeholder="Enter requirement"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, 'requirements', 'internship')}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('requirements', 'internship')}
                  className="text-rwanda-green hover:underline"
                >
                  + Add Requirement
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Program'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowInternshipModal(false)}
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

export default EmployerDashboard;