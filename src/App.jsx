import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import InstructorLogin from './components/InstructorLogin.jsx';
import QuizPage from './components/QuizPage.jsx';
import QuizSubmitted from './components/QuizSubmitted.jsx';
import InstructorDashboard from './components/InstructorDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

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