// src/hooks/useFocusDetection.js
import { useState, useEffect, useCallback, useRef } from "react";

export const useFocusDetection = (maxViolations = 3, onMaxViolations) => {
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const lastViolationTime = useRef(0);
  const hasTriggeredMax = useRef(false); // NEW: Prevent multiple triggers

  const recordViolation = useCallback(() => {
    const now = Date.now();

    if (now - lastViolationTime.current < 1000) {
      console.log("Ignoring duplicate violation (too soon)");
      return;
    }

    lastViolationTime.current = now;

    setViolations((prev) => {
      const newCount = prev + 1;
      console.log(`Violation detected! Count: ${newCount}`);
      setShowWarning(true);
      
      return newCount;
    });
  }, []); // Removed dependencies that cause re-creation

  // NEW: Separate effect to handle max violations
  useEffect(() => {
    if (violations >= maxViolations && !hasTriggeredMax.current) {
      hasTriggeredMax.current = true;
      console.log("Max violations reached! Auto-submitting...");
      onMaxViolations();
    }
  }, [violations, maxViolations, onMaxViolations]);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      console.log("Visibility change: hidden");
      recordViolation();
    }
  }, [recordViolation]);

  const handleBlur = useCallback(() => {
    console.log("Window blur detected");
    recordViolation();
  }, [recordViolation]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [handleVisibilityChange, handleBlur]);

  const dismissWarning = () => {
    setShowWarning(false);
  };

  return {
    violations,
    showWarning,
    dismissWarning,
    hasReachedMax: violations >= maxViolations,
  };
};
