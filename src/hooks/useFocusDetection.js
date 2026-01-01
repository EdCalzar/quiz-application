// src/hooks/useFocusDetection.js
import { useState, useEffect, useCallback, useRef } from "react";

export const useFocusDetection = (maxViolations = 3, onMaxViolations) => {
  // REMOVED initialViolations
  const [violations, setViolations] = useState(0); // Start from 0
  const [showWarning, setShowWarning] = useState(false);
  const lastViolationTime = useRef(0);

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

      if (newCount >= maxViolations) {
        console.log("Max violations reached! Auto-submitting...");
        onMaxViolations();
      }

      return newCount;
    });
  }, [maxViolations, onMaxViolations]);

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
