// src/components/QuizPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { saveQuizProgress, submitQuiz, db } from '../db/database.js';
import { useFocusDetection } from '../hooks/useFocusDetection.js';
import Timer from './quiz/Timer.jsx';
import WarningModal from './quiz/WarningModal.jsx';
import QuestionCard from './quiz/QuestionCard.jsx';
import quizData from '../data/questions.json';

export default function QuizPage() {
  const navigate = useNavigate();
  const { currentStudent: student } = useAppContext();
  
  // Redirect if no student logged in
  useEffect(() => {
    if (!student) {
      navigate('/');
    }
  }, [student, navigate]);
  
  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(
    new Array(quizData.questions.length).fill(null)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  
  // Use a ref to store the latest violations count
  const violationsRef = useRef(0);
  
  // NEW: Add this ref to prevent duplicate auto-submissions
  const hasAutoSubmitted = useRef(false);
  
  // Submit quiz
  const handleSubmitQuiz = async () => {
    // NEW: Guard against duplicate submissions
    if (isSubmitting) {
      console.log('Already submitting...');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // NEW: Check if already submitted in database
      const existingSubmission = await db.submissions
        .where('studentId')
        .equals(student.studentId)
        .first();
      
      if (existingSubmission) {
        console.log('Submission already exists, navigating...');
        navigate('/quiz/submitted');
        return;
      }
      
      const result = await submitQuiz(
        student.studentId,
        answers,
        violationsRef.current,
        quizData.questions
      );
      
      console.log('Quiz submitted:', result);
      
      // Navigate to results page
      navigate('/quiz/submitted');
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
      setIsSubmitting(false);
    }
  };

  // NEW: Modified auto-submit function with guard
  const handleAutoSubmit = async () => {
    // Prevent duplicate submissions
    if (hasAutoSubmitted.current || isSubmitting) {
      console.log('Already submitting, skipping...');
      return;
    }
    
    hasAutoSubmitted.current = true;
    console.log('Auto-submitting quiz...');
    await handleSubmitQuiz();
  };
  
  // Focus detection hook
  const { violations, showWarning, dismissWarning } = 
    useFocusDetection(3, handleAutoSubmit);
  
  // Update the ref whenever violations change
  useEffect(() => {
    violationsRef.current = violations;
  }, [violations]);
  
  // Save progress whenever answers or violations change
  useEffect(() => {
    if (student && !isSubmitting) {
      saveQuizProgress(student.studentId, {
        currentQuestion: currentQuestionIndex,
        answers,
        violations
      });
    }
  }, [answers, violations, currentQuestionIndex, student, isSubmitting]);
  
  // Handle answer selection
  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };
  
  // Navigation functions
  const goToNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };
  
  // Calculate answered questions
  const answeredCount = answers.filter(a => a !== null).length;
  const unansweredCount = answers.length - answeredCount;
  
  const currentQuestion = quizData.questions[currentQuestionIndex];
  
  if (!student) return null;
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header with Timer */}
        <div className="mb-6">
          <Timer 
            duration={quizData.duration} 
            onTimeout={handleAutoSubmit}
          />
        </div>
        
        {/* Violations Counter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Violations</p>
              <p className="text-2xl font-bold text-red-600">
                {violations}/3
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {answeredCount}/{quizData.questions.length}
              </p>
            </div>
          </div>
        </div>
        
        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={quizData.questions.length}
          selectedAnswer={answers[currentQuestionIndex]}
          onSelectAnswer={handleAnswerSelect}
        />
        
        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Previous
          </button>
          
          {currentQuestionIndex < quizData.questions.length - 1 ? (
            <button
              onClick={goToNext}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors cursor-pointer"
            >
              Submit Quiz
            </button>
          )}
        </div>
        
        {/* Question Navigator */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold mb-4">Question Navigator</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {quizData.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`aspect-square rounded-lg font-semibold text-sm transition-colors cursor-pointer ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : answers[index] !== null
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <div className="mt-4 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-700 rounded"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-700 rounded"></div>
              <span>Unanswered</span>
            </div>
          </div>
        </div>
        
        {/* Unanswered Warning */}
        {unansweredCount > 0 && currentQuestionIndex === quizData.questions.length - 1 && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              You have {unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}. 
              Review your answers before submitting.
            </p>
          </div>
        )}
      </div>
      
      {/* Warning Modal */}
      {showWarning && (
        <WarningModal
          violations={violations}
          maxViolations={3}
          onDismiss={dismissWarning}
        />
      )}
      
      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Submit Quiz?</h2>
            <p className="text-gray-600 mb-2">
              Are you sure you want to submit your quiz?
            </p>
            {unansweredCount > 0 && (
              <p className="text-yellow-600 mb-4">
                You have {unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}.
              </p>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}