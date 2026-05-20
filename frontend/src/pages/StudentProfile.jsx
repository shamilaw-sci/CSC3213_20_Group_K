/**
 * StudentProfile.jsx
 * ===================
 * Page that wraps the ProfileForm component.
 * Collects student data and navigates to recommendations.
 * 
 * Author: Thimira (Student Profile & Career Recommendation Module)
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "../components/ProfileForm";

const StudentProfile = () => {
  const navigate = useNavigate();

  // Handle form submission — navigate to recommendations with profile data
  const handleProfileSubmit = (profileData) => {
    // Store profile data in sessionStorage so the Recommendations page can access it
    sessionStorage.setItem("studentProfile", JSON.stringify(profileData));
    // Navigate to the recommendations page
    navigate("/recommendations");
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

      {/* Profile Form Component */}
      <ProfileForm onSubmit={handleProfileSubmit} />
    </div>
  );
};

export default StudentProfile;
