/**
 * StudentProfile.jsx
 * ===================
 * Page that wraps the ProfileForm component.
 * Collects student data, saves to MongoDB, and navigates to recommendations.
 * 
 * Author: Thimira (Student Profile & Career Recommendation Module)
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "../components/ProfileForm";
import { createStudentProfile } from "../api/recommendationApi";

const StudentProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form submission — save to MongoDB and navigate to recommendations
  const handleProfileSubmit = async (profileData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Save profile to MongoDB
      const savedProfile = await createStudentProfile(profileData);

      // Store profile data in sessionStorage for the Recommendations page
      sessionStorage.setItem("studentProfile", JSON.stringify(profileData));
      sessionStorage.setItem("studentProfileId", savedProfile._id);

      // Navigate to the recommendations page
      navigate("/recommendations");
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError("Failed to save your profile. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="student-profile-page" id="student-profile-page">
      {/* Page Header */}
      <div className="page-header">
        <button className="page-header__back" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
        <h1 className="page-header__title">Build Your Profile</h1>
        <p className="page-header__subtitle">
          Tell us about yourself so we can recommend the best career paths for you.
        </p>
      </div>

      {/* Error message display */}
      {error && (
        <div className="error-banner" style={{ 
          padding: "15px", 
          backgroundColor: "#fee", 
          color: "#c00", 
          borderRadius: "4px",
          marginBottom: "20px"
        }}>
          {error}
        </div>
      )}

      {/* Profile Form Component */}
      <ProfileForm onSubmit={handleProfileSubmit} disabled={isLoading} />
    </div>
  );
};

export default StudentProfile;
