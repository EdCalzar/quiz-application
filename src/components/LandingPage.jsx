import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerStudent, hasStudentTakenQuiz } from "../db/database";

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
      // Check if student already took quiz
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

  return (
    <div>
    </div>
  );
}
