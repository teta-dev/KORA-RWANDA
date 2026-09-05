import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, saveCV, deleteCV } from '../../api/api';
import { FaFileAlt, FaUpload, FaTrash, FaDownload } from 'react-icons/fa';

const CV = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/user/login');
      return;
    }
    loadProfile();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      setUser(response.user);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/msword') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a PDF or Word document');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setSaving(true);
    setMessage('');
    setError('');

    try {
      // In a real app, you'd upload the file to a server/storage
      // For now, we'll simulate by saving the file name
      await saveCV(file.name, URL.createObjectURL(file));
      setMessage('CV uploaded successfully!');
      setTimeout(() => {
        loadProfile();
        setFile(null);
        setMessage('');
      }, 2000);
    } catch (error) {
      setError('Failed to upload CV');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your CV?')) {
      try {
        await deleteCV();
        setMessage('CV deleted successfully');
        setTimeout(() => {
          loadProfile();
          setMessage('');
        }, 2000);
      } catch (error) {
        setError('Failed to delete CV');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rwanda-green"></div>
        <p className="ml-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-rwanda-green bg-opacity-5">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaFileAlt className="mr-2 text-rwanda-green" /> CV Builder
            </h1>
          </div>

          <div className="p-6">
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

            {/* Current CV */}
            <div className="mb-8 p-4 border border-gray-200 rounded-lg">
              <h2 className="font-semibold text-gray-700 mb-2">Current CV</h2>
              {user?.cv ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaFileAlt className="text-rwanda-green mr-2" />
                    <span className="text-gray-800">{user.cv.fileName}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      Uploaded: {new Date(user.cv.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDelete}
                      className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No CV uploaded yet</p>
              )}
            </div>

            {/* Upload New CV */}
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <h2 className="font-semibold text-gray-700 mb-4">Upload New CV</h2>
              
              <div className="flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="cv-upload"
                />
                <label
                  htmlFor="cv-upload"
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors flex items-center"
                >
                  <FaUpload className="mr-2" /> Choose File
                </label>
                
                {file && (
                  <div className="mt-4 text-sm text-gray-600">
                    Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </div>
                )}
                
                <button
                  onClick={handleUpload}
                  disabled={saving || !file}
                  className="mt-4 bg-rwanda-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Uploading...' : 'Upload CV'}
                </button>
                
                <p className="mt-2 text-xs text-gray-500">
                  Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                </p>
              </div>
            </div>

            {/* CV Tips */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">💡 CV Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Keep your CV concise (1-2 pages)</li>
                <li>• Highlight relevant skills and experience</li>
                <li>• Use action verbs (e.g., "Developed", "Managed")</li>
                <li>• Tailor your CV for each opportunity</li>
                <li>• Proofread for spelling and grammar errors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CV;