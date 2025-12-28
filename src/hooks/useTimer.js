import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for countdown timer
 * @param {number} initialTime - Time in seconds
 * @param {function} onTimeout - Callback when timer reaches 0
 * @returns {object} - { timeLeft, formatTime, pauseTimer, resumeTimer }
 */
export const useTimer = (initialTime, onTimeout) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  
  useEffect(() => {
    // Don't start if paused
    if (isPaused) return;
    
    // Set up interval to decrease time every second
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        // When time runs out
        if (prevTime <= 1) {
          clearInterval(intervalRef.current);
          onTimeout(); // Call the callback (submit quiz)
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    // Cleanup function - runs when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, onTimeout]);
  
  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const pauseTimer = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  
  const resumeTimer = () => {
    setIsPaused(false);
  };
  
  return {
    timeLeft,
    formatTime,
    pauseTimer,
    resumeTimer,
    isTimeUp: timeLeft === 0
  };
};