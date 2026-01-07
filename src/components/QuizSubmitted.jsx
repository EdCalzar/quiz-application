// src/components/QuizSubmitted.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { db } from '../db/database'; // NEW

export default function QuizSubmitted() {
  const navigate = useNavigate();
  const { currentStudent: student, logoutStudent } = useAppContext();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Redirect if no student logged in
  useEffect(() => {
    if (!student) {
      navigate('/');
    }
  }, [student, navigate]);

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!student) return;
      
      try {
        const sub = await db.submissions
          .where('studentId')
          .equals(student.studentId)
          .first();
        
        setSubmission(sub);
      } catch (error) {
        console.error('Error fetching submission:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmission();
  }, [student]);
  
  const handleExit = () => {
    // Clear the student session
    logoutStudent();
    // Go back to landing page
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!student) return null;
  
  return (
    <div className="min-h-screen bg-linear-to-br bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">

        {/* Success Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Quiz Submitted!
        </h1>
        
        {/* UPDATED: Conditional display based on released status */}
        {submission?.released ? (
          <>
            {/* SHOW SCORE */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">Your Score</p>
              <p className="text-2xl font-bold text-gray-600">
                {submission.correctAnswers}/{submission.totalQuestions} correct answers
              </p>
              
              {submission.score >= 70 ? (
                <div className="mt-4 bg-green-100 border border-green-300 rounded-lg p-3">
                  <p className="text-green-800 font-semibold">🎉 Congratulations! You passed!</p>
                </div>
              ) : (
                <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                  <p className="text-yellow-800 font-semibold">Keep studying and try again next time!</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* PENDING MESSAGE */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700">
                Your answers have been submitted successfully.
              </p>
              <p className="text-gray-600 mt-2 text-sm">
                Please wait for the instructor to release the results.
              </p>
            </div>
          </>
        )}
        
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
        
        <button
          onClick={handleExit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
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