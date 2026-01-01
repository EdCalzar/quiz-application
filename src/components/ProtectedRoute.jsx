import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Check if instructor is authenticated
  const isAuthenticated = localStorage.getItem('instructorAuth') === 'true';
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/instructor-login" replace />;
  }
  
  // If authenticated, show the protected content
  return children;
}