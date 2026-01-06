import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function InstructorHeader() {
  const navigate = useNavigate();
  const { logoutInstructor } = useAppContext();
  
  const handleLogout = () => {
    logoutInstructor();
    navigate('/instructor-login');
  };
  
  return (
    <div className="bg-white shadow-md mb-6">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Instructor Dashboard</h1>
          <p className="text-sm text-gray-600">Quiz Results Management</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}