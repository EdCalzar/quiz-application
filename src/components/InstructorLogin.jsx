import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InstructorLogin() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Get passcode from .env file
  const CORRECT_PASSCODE = import.meta.env.VITE_INSTRUCTOR_PASSCODE;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate passcode
    if (passcode === CORRECT_PASSCODE) {
      // Store authentication in localStorage
      localStorage.setItem("instructorAuth", "true");
      localStorage.setItem("instructorLoginTime", new Date().toISOString());

      // Navigate to instructor dashboard
      navigate("/instructor/dashboard");
    } else {
      setError("Incorrect passcode. Please try again.");
      setPasscode(""); // Clear input
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800">
            Instructor Access
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Enter passcode to continue
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Passcode Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(""); // Clear error when typing
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter passcode"
                autoFocus
              />

              {/* Show/Hide Password Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Access Dashboard
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Back to Student Login
          </button>
        </div>
      </div>
    </div>
  );
}
