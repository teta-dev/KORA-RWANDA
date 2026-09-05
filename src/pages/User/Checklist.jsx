import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getChecklist, updateChecklistItem } from '../../api/api';
import { FaCheckCircle, FaCircle, FaArrowLeft } from 'react-icons/fa';

const Checklist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/user/login');
      return;
    }
    if (id) {
      loadChecklist();
    }
  }, [id, navigate]);

  const loadChecklist = async () => {
    try {
      setLoading(true);
      const response = await getChecklist(id);
      if (response.checklist) {
        setChecklist(response.checklist);
        calculateProgress(response.checklist.items);
      }
    } catch (error) {
      console.error('Failed to load checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (items) => {
    if (!items || items.length === 0) {
      setProgress(0);
      return;
    }
    const completed = items.filter(item => item.completed).length;
    const total = items.length;
    setProgress(Math.round((completed / total) * 100));
  };

  const toggleItem = async (index) => {
    try {
      const newCompleted = !checklist.items[index].completed;
      await updateChecklistItem(id, index, newCompleted);
      
      const updatedItems = [...checklist.items];
      updatedItems[index].completed = newCompleted;
      setChecklist({ ...checklist, items: updatedItems });
      calculateProgress(updatedItems);
    } catch (error) {
      alert('Failed to update checklist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rwanda-green"></div>
        <p className="ml-2 text-gray-600">Loading checklist...</p>
      </div>
    );
  }

  if (!checklist) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No checklist found for this opportunity.</p>
            <Link to="/opportunities" className="text-rwanda-green hover:underline">
              Browse opportunities →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <Link to="/user/applications" className="text-rwanda-green hover:underline flex items-center mb-2">
              <FaArrowLeft className="mr-2" /> Back to Applications
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Application Checklist</h1>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-rwanda-green h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {checklist.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => toggleItem(index)}
                >
                  <div className="mr-3">
                    {item.completed ? (
                      <FaCheckCircle className="text-rwanda-green text-xl" />
                    ) : (
                      <FaCircle className="text-gray-300 text-xl" />
                    )}
                  </div>
                  <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {item.task}
                  </span>
                  <span className="text-sm text-gray-400">
                    {item.completed ? '✅ Done' : '⏳ Pending'}
                  </span>
                </div>
              ))}
            </div>

            {progress === 100 && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-green-700 font-semibold">🎉 Congratulations! You've completed all steps!</p>
                <p className="text-sm text-green-600 mt-1">You're ready to submit your application.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checklist;