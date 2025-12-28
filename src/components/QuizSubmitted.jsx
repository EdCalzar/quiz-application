// src/components/QuizSubmitted.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentStudent, clearStudentSession } from '../utils/auth';

export default function QuizSubmitted() {
  const navigate = useNavigate();
  const student = getCurrentStudent();
  
  // Redirect if no student logged in
  useEffect(() => {
    if (!student) {
      navigate('/');
    }
  }, [student, navigate]);
  
  const handleExit = () => {
    // Clear the student session
    clearStudentSession();
    // Go back to landing page
    navigate('/');
  };
  
  if (!student) return null;
  
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">

        {/* Success Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Quiz Submitted!
        </h1>
        
        {/* Main Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-gray-700 font-medium">
            Your answers have been submitted successfully.
          </p>
          <p className="text-gray-600 mt-2 text-sm">
            Please wait for the instructor to release the results.
          </p>
        </div>
        
        {/* Student Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Student Name:</strong> {student.name}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Student ID:</strong> {student.studentId}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Email:</strong> {student.email}
          </p>
        </div>
        
        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
          <p className="text-xs text-yellow-800">
            You will be notified via email once your results are released.
          </p>
        </div>
        
        {/* Exit Button */}
        <button
          onClick={handleExit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Exit Quiz
        </button>
        
        {/* Additional Info */}
        <p className="text-xs text-gray-500 mt-4">
          Thank you for taking the quiz!
        </p>
      </div>
    </div>
  );
}