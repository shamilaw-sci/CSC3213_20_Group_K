/**
 * ProfileForm.jsx
 * ================
 * A form component that collects the student's profile information.
 * Fields: Name, Skills, Interests, Education Level, Preferred Job Type, Preferred Work Area.
 * 
 * Author: Thimira (Student Profile & Career Recommendation Module)
 */
import React, { useState } from "react";

// Predefined options for dropdown fields
const EDUCATION_LEVELS = ["Self-Taught", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD"];
const JOB_TYPES = ["Any", "Full-Time", "Part-Time", "Freelance", "Internship"];
const WORK_AREAS = ["Any", "Technology", "Design", "Marketing", "Business", "Healthcare", "Education"];

// Suggested skills (user can also type custom ones)
const SUGGESTED_SKILLS = [
  "JavaScript", "Python", "React", "Node.js", "HTML", "CSS", "SQL",
  "Java", "Machine Learning", "Data Analysis", "Figma", "Adobe XD",
  "Communication", "Problem Solving", "SEO", "Content Writing",
];

// Suggested interests
const SUGGESTED_INTERESTS = [
  "Web Development", "Artificial Intelligence", "Data Science", "Cybersecurity",
  "Mobile Apps", "Cloud Computing", "Graphic Design", "Digital Marketing",
  "Game Development", "Blockchain", "Robotics", "E-Commerce",
];

const ProfileForm = ({ onSubmit }) => {
  // ─── Form State ──────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: "",
    skills: [],
    interests: [],
    educationLevel: "",
    preferredJobType: "",
    preferredWorkArea: "",
  });

  // State for the custom skill/interest input fields
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  // Validation errors
  const [errors, setErrors] = useState({});

  // ─── Handlers ────────────────────────────────────────────────

  // Handle simple input/select changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Add a skill (from suggestion or custom input)
  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      if (errors.skills) setErrors((prev) => ({ ...prev, skills: "" }));
    }
    setSkillInput("");
  };

  // Remove a skill
  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Add an interest
  const addInterest = (interest) => {
    const trimmed = interest.trim();
    if (trimmed && !formData.interests.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, interests: [...prev.interests, trimmed] }));
      if (errors.interests) setErrors((prev) => ({ ...prev, interests: "" }));
    }
    setInterestInput("");
  };

  // Remove an interest
  const removeInterest = (interestToRemove) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interestToRemove),
    }));
  };

  // Handle Enter key in skill/interest inputs
  const handleKeyDown = (e, type) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (type === "skill") addSkill(skillInput);
      else addInterest(interestInput);
    }
  };

  // Validate form before submitting
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Please enter your name";
    if (formData.skills.length === 0) newErrors.skills = "Please add at least one skill";
    if (formData.interests.length === 0) newErrors.interests = "Please add at least one interest";
    if (!formData.educationLevel) newErrors.educationLevel = "Please select your education level";
    if (!formData.preferredJobType) newErrors.preferredJobType = "Please select a job type";
    if (!formData.preferredWorkArea) newErrors.preferredWorkArea = "Please select a work area";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData); // Pass form data to parent component
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit} id="profile-form">
      {/* Step indicator */}
      <div className="profile-form__steps">
        <div className="profile-form__step profile-form__step--active">
          <span className="profile-form__step-num">1</span>
          <span>Basic Info</span>
        </div>
        <div className="profile-form__step-line"></div>
        <div className="profile-form__step profile-form__step--active">
          <span className="profile-form__step-num">2</span>
          <span>Skills & Interests</span>
        </div>
        <div className="profile-form__step-line"></div>
        <div className="profile-form__step profile-form__step--active">
          <span className="profile-form__step-num">3</span>
          <span>Preferences</span>
        </div>
      </div>

      {/* ── Section 1: Basic Information ── */}
      <div className="profile-form__section">
        <h3 className="profile-form__section-title">
          <span className="profile-form__section-icon">👤</span>
          Basic Information
        </h3>
        <div className="profile-form__field">
          <label htmlFor="name">Full Name</label>
          <input
            id="name" name="name" type="text"
            placeholder="Enter your full name"
            value={formData.name} onChange={handleChange}
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
      </div>

      {/* ── Section 2: Skills ── */}
      <div className="profile-form__section">
        <h3 className="profile-form__section-title">
          <span className="profile-form__section-icon">🛠️</span>
          Your Skills
        </h3>
        <div className="profile-form__field">
          <label htmlFor="skill-input">Add your skills</label>
          <div className="profile-form__input-with-btn">
            <input
              id="skill-input" type="text" placeholder="Type a skill and press Enter"
              value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "skill")}
              className={errors.skills ? "input-error" : ""}
            />
            <button type="button" className="profile-form__add-btn" onClick={() => addSkill(skillInput)}>
              Add
            </button>
          </div>
          {errors.skills && <span className="error-text">{errors.skills}</span>}

          {/* Selected skills chips */}
          {formData.skills.length > 0 && (
            <div className="profile-form__chips">
              {formData.skills.map((skill, i) => (
                <span key={i} className="profile-form__chip">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="profile-form__chip-remove">×</button>
                </span>
              ))}
            </div>
          )}

          {/* Suggested skills */}
          <div className="profile-form__suggestions">
            <span className="profile-form__suggestions-label">Suggestions:</span>
            {SUGGESTED_SKILLS.filter((s) => !formData.skills.includes(s)).slice(0, 8).map((skill, i) => (
              <button key={i} type="button" className="profile-form__suggestion-btn" onClick={() => addSkill(skill)}>
                + {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 3: Interests ── */}
      <div className="profile-form__section">
        <h3 className="profile-form__section-title">
          <span className="profile-form__section-icon">💡</span>
          Your Interests
        </h3>
        <div className="profile-form__field">
          <label htmlFor="interest-input">Add your interests</label>
          <div className="profile-form__input-with-btn">
            <input
              id="interest-input" type="text" placeholder="Type an interest and press Enter"
              value={interestInput} onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "interest")}
              className={errors.interests ? "input-error" : ""}
            />
            <button type="button" className="profile-form__add-btn" onClick={() => addInterest(interestInput)}>
              Add
            </button>
          </div>
          {errors.interests && <span className="error-text">{errors.interests}</span>}

          {/* Selected interests chips */}
          {formData.interests.length > 0 && (
            <div className="profile-form__chips">
              {formData.interests.map((interest, i) => (
                <span key={i} className="profile-form__chip profile-form__chip--interest">
                  {interest}
                  <button type="button" onClick={() => removeInterest(interest)} className="profile-form__chip-remove">×</button>
                </span>
              ))}
            </div>
          )}

          {/* Suggested interests */}
          <div className="profile-form__suggestions">
            <span className="profile-form__suggestions-label">Suggestions:</span>
            {SUGGESTED_INTERESTS.filter((i) => !formData.interests.includes(i)).slice(0, 6).map((interest, i) => (
              <button key={i} type="button" className="profile-form__suggestion-btn" onClick={() => addInterest(interest)}>
                + {interest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 4: Preferences ── */}
      <div className="profile-form__section">
        <h3 className="profile-form__section-title">
          <span className="profile-form__section-icon">⚙️</span>
          Your Preferences
        </h3>
        <div className="profile-form__grid">
          {/* Education Level */}
          <div className="profile-form__field">
            <label htmlFor="educationLevel">Education Level</label>
            <select id="educationLevel" name="educationLevel" value={formData.educationLevel}
              onChange={handleChange} className={errors.educationLevel ? "input-error" : ""}>
              <option value="">-- Select Education Level --</option>
              {EDUCATION_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            {errors.educationLevel && <span className="error-text">{errors.educationLevel}</span>}
          </div>

          {/* Preferred Job Type */}
          <div className="profile-form__field">
            <label htmlFor="preferredJobType">Preferred Job Type</label>
            <select id="preferredJobType" name="preferredJobType" value={formData.preferredJobType}
              onChange={handleChange} className={errors.preferredJobType ? "input-error" : ""}>
              <option value="">-- Select Job Type --</option>
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.preferredJobType && <span className="error-text">{errors.preferredJobType}</span>}
          </div>

          {/* Preferred Work Area */}
          <div className="profile-form__field">
            <label htmlFor="preferredWorkArea">Preferred Work Area</label>
            <select id="preferredWorkArea" name="preferredWorkArea" value={formData.preferredWorkArea}
              onChange={handleChange} className={errors.preferredWorkArea ? "input-error" : ""}>
              <option value="">-- Select Work Area --</option>
              {WORK_AREAS.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            {errors.preferredWorkArea && <span className="error-text">{errors.preferredWorkArea}</span>}
          </div>
        </div>
      </div>

      {/* Submit button */}
      <button type="submit" className="profile-form__submit" id="submit-profile-btn">
        🚀 Get Career Recommendations
      </button>
    </form>
  );
};

export default ProfileForm;
