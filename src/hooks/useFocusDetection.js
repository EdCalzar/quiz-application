// src/hooks/useFocusDetection.js
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Detects when user switches tabs or loses focus
 * @param {number} maxViolations - Maximum allowed violations before action
 * @param {function} onMaxViolations - Callback when max violations reached
 * @returns {object} - { violations, showWarning, dismissWarning }
 */
export const useFocusDetection = (maxViolations = 3, onMaxViolations) => {
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const lastViolationTime = useRef(0);
  
  // Shared violation handler with debounce
  const recordViolation = useCallback(() => {
    const now = Date.now();
    
    // Ignore if violation happened less than 1 second ago (debounce)
    if (now - lastViolationTime.current < 1000) {
      console.log('Ignoring duplicate violation (too soon)');
      return;
    }
    
    lastViolationTime.current = now;
    
    setViolations((prev) => {
      const newCount = prev + 1;
      
      console.log(`Violation detected! Count: ${newCount}`);
      
      // Show warning modal
      setShowWarning(true);
      
      // Check if reached max violations
      if (newCount >= maxViolations) {
        console.log('Max violations reached! Auto-submitting...');
        onMaxViolations();
      }
      
      return newCount;
    });
  }, [maxViolations, onMaxViolations]);
  
  // Handle visibility change (tab switch, minimize)
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      console.log('Visibility change: hidden');
      recordViolation();
    }
  }, [recordViolation]);
  
  // Handle window blur (clicking outside browser)
  const handleBlur = useCallback(() => {
    console.log('Window blur detected');
    recordViolation();
  }, [recordViolation]);
  
  useEffect(() => {
    // Add both event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    
    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleVisibilityChange, handleBlur]);
  
  const dismissWarning = () => {
    setShowWarning(false);
  };
  
  return {
    violations,
    showWarning,
    dismissWarning,
    hasReachedMax: violations >= maxViolations
  };
};