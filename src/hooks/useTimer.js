// src/hooks/useTimer.js
import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialTime, onTimeout) => { // REMOVED onTimeUpdate
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  
  useEffect(() => {
    if (isPaused) return;
    
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        // When time runs out
        if (prevTime <= 1) {
          clearInterval(intervalRef.current);
          onTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, onTimeout]); // REMOVED onTimeUpdate
  
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