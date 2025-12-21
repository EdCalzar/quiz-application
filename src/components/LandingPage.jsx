import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerStudent, hasStudentTakenQuiz } from "../db/database";
// For resetting or clearing data (only for development phase)
import { db } from "../db/database";

export default function LandingPage() {
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: "",
  });

  // Errors and loading states
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    // Check if student ID is filled
    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    }

    // Check if student ID contains only numbers
    else if (!/^\d+$/.test(formData.studentId)) {
      newErrors.studentId = "Student ID must contain only numbers";
    }

    // Check if name is filled
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Validate first
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Check if student already took quiz from the database
      const hasTaken = await hasStudentTakenQuiz(formData.studentId);

      if (hasTaken) {
        setErrors({
          general:
            "You have already taken this quiz. Please wait for the instructor to release your score.",
        });
        setLoading(false);
        return;
      }

      // Register student in database
      const student = await registerStudent(formData);

      // Store student info in sessionStorage for current session
      sessionStorage.setItem("currentStudent", JSON.stringify(student));

      // Navigate to quiz page
      navigate("/quiz");
    } catch (error) {
      console.error("Error:", error);
      setErrors({
        general: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset or clear data button (only for development phase)
  const handleResetDatabase = async () => {
    if (window.confirm("⚠️ Are you sure? This will delete ALL data!")) {
      // Clear tables BEFORE closing the connection
      await db.students.clear();
      await db.submissions.clear();
      await db.quizStatus.clear();
      await db.quizProgress.clear();

      console.log("✅ Database cleared successfully");
      alert("✅ Database cleared successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📝 Quiz Application
          </h1>
          <h2 className="text-xl text-gray-600">JavaScript Fundamentals</h2>
        </div>

        {/* Instructions Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">
            Quiz Instructions:
          </h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 20 multiple-choice questions</li>
            <li>• 30 minutes duration</li>
            <li>• No retakes allowed</li>
            <li>• Tab switching will be detected</li>
            <li>• Auto-submit after 3 violations</li>
          </ul>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student ID Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID *
            </label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.studentId ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., 2023-12345"
            />
            {errors.studentId && (
              <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>
            )}
          </div>

          {/* Full Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="student@gmail.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Checking..." : "START QUIZ"}
          </button>
        </form>

        {/* Instructor Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/instructor-login")}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            I am an Instructor →
          </button>
        </div>

        {/* Reset button (only for development phase) */}
        <div className="mt-4 text-center">
          <button
            onClick={handleResetDatabase}
            className="text-red-500 hover:text-red-700 text-xs font-medium"
          >
            Reset Database (Dev Only)
          </button>
        </div>
      </div>
    </div>
  );
}
