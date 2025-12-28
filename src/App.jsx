import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import InstructorLogin from './components/InstructorLogin';
import QuizPage from './components/QuizPage';
import QuizSubmitted from './components/QuizSubmitted';
import InstructorDashboard from './components/InstructorDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/instructor-login" element={<InstructorLogin />} />
        
        {/* Student Route */}
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/submitted" element={<QuizSubmitted />} />
        
        {/* Protected Instructor Route */}
        <Route 
          path="/instructor/dashboard" 
          element={
            <ProtectedRoute>
              <InstructorDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}