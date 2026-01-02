import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';


export default function ProtectedRoute({ children }) {
  // Check if instructor is authenticated
  const { isInstructorAuth } = useAppContext();

  // If not authenticated, redirect to login
  f (!isInstructorAuth) {
    return <Navigate to="/instructor-login" replace />;
  }
  
  // If authenticated, show the protected content
  return children;
}