// src/utils/formatters.js

/**
 * Format timestamp to readable date and time
 * @param {string} timestamp - ISO timestamp
 * @returns {string} - Formatted date
 */
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  
  // Format: "Dec 30, 2024 at 2:30 PM"
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleString('en-US', options);
};

/**
 * Format timestamp to short date
 * @param {string} timestamp - ISO timestamp
 * @returns {string} - Formatted date (MM/DD/YYYY)
 */
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US');
};

/**
 * Format timestamp to time only
 * @param {string} timestamp - ISO timestamp
 * @returns {string} - Formatted time (HH:MM AM/PM)
 */
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

/**
 * Get score color class based on percentage
 * @param {number} score - Score percentage (0-100)
 * @returns {string} - Tailwind color class
 */
export const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600 bg-green-50';
  if (score >= 80) return 'text-blue-600 bg-blue-50';
  if (score >= 70) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
};

/**
 * Get violations color class
 * @param {number} violations - Number of violations
 * @returns {string} - Tailwind color class
 */
export const getViolationsColor = (violations) => {
  if (violations === 0) return 'text-green-600';
  if (violations <= 2) return 'text-yellow-600';
  return 'text-red-600';
};