// src/context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isInstructorAuth, setIsInstructorAuth] = useState(false);
  
  // Load student from sessionStorage on mount
  useEffect(() => {
    const studentData = sessionStorage.getItem('currentStudent');
    if (studentData) {
      setCurrentStudent(JSON.parse(studentData));
    }
    
    const authStatus = localStorage.getItem('instructorAuth') === 'true';
    setIsInstructorAuth(authStatus);
  }, []);
  
  // Helper functions
  const loginStudent = (student) => {
    setCurrentStudent(student);
    sessionStorage.setItem('currentStudent', JSON.stringify(student));
  };
  
  const logoutStudent = () => {
    setCurrentStudent(null);
    sessionStorage.removeItem('currentStudent');
  };
  
  const loginInstructor = () => {
    setIsInstructorAuth(true);
    localStorage.setItem('instructorAuth', 'true');
  };
  
  const logoutInstructor = () => {
    setIsInstructorAuth(false);
    localStorage.removeItem('instructorAuth');
    localStorage.removeItem('instructorLoginTime');
  };
  
  return (
    <AppContext.Provider value={{
      currentStudent,
      isInstructorAuth,
      loginStudent,
      logoutStudent,
      loginInstructor,
      logoutInstructor
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};