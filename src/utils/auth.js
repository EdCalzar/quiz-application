// src/utils/auth.js

// Get current student from session
export const getCurrentStudent = () => {
  const studentData = sessionStorage.getItem('currentStudent');
  return studentData ? JSON.parse(studentData) : null;
};

// Check if instructor is logged in
export const isInstructorLoggedIn = () => {
  return localStorage.getItem('instructorAuth') === 'true';
};

// Logout instructor
export const logoutInstructor = () => {
  localStorage.removeItem('instructorAuth');
  localStorage.removeItem('instructorLoginTime');
};

// Clear student session
export const clearStudentSession = () => {
  sessionStorage.removeItem('currentStudent');
};