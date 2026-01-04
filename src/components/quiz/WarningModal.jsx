export default function WarningModal({ 
  violations, 
  maxViolations, 
  onDismiss 
}) {
  const remainingAttempts = maxViolations - violations;
  
  return (
    // Backdrop overlay
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
        
        {/* Warning Icon */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-red-600">
            Tab Switch Detected!
          </h2>
        </div>
        
        {/* Warning Message */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
          <p className="text-gray-800 mb-2">
            You switched tabs or left the quiz window.
          </p>
          <p className="text-sm text-gray-600">
            <strong>Violations: {violations}/{maxViolations}</strong>
          </p>
          
          {remainingAttempts > 0 ? (
            <p className="text-sm text-red-600 mt-2">
              {remainingAttempts} warning{remainingAttempts !== 1 ? 's' : ''} remaining before auto-submit!
            </p>
          ) : (
            <p className="text-sm text-red-700 font-bold mt-2">
              Maximum violations reached! Quiz will be submitted automatically.
            </p>
          )}
        </div>
        
        {/* Rules Reminder */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-600">
            <strong>Reminder:</strong> You must stay on this tab during the quiz. 
            Switching tabs, minimizing the window, or losing focus is not allowed.
          </p>
        </div>
        
        {/* Dismiss Button */}
        {remainingAttempts > 0 && (
          <button
            onClick={onDismiss}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            I Understand, Continue Quiz
          </button>
        )}
      </div>
    </div>
  );
}