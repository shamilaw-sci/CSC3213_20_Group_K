import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { User, CheckCircle2, AlertCircle, Briefcase, Code2, GraduationCap, Target } from "lucide-react";
import "./Profile.css";

const initialProfile = {
  name: "", email: "", interest: "", skills: "", education: "", careerGoal: "",
};

function Profile() {
  const [formData, setFormData] = useState(initialProfile);
  const [status,   setStatus]   = useState({ type: "", message: "" });
  const [saving,   setSaving]   = useState(false);
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profile = response.data?.profile || response.data || {};
        setFormData((current) => ({
          ...current,
          ...profile,
          skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : (profile.skills || ""),
        }));
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const saveProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login", { replace: true });

    setSaving(true);
    setStatus({ type: "", message: "" });
    try {
      await axios.post(
        "http://localhost:5000/api/profile",
        {
          ...formData,
          skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus({ type: "success", message: "Profile saved. Your AI tools can now personalise their guidance." });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else {
        setStatus({
          type: "error",
          message: err.response?.data?.message || "Could not save your profile. Please try again.",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const profileName = typeof formData.name === "string" ? formData.name : "";
  const profileSkillText = typeof formData.skills === "string" ? formData.skills : "";
  const profileInitials = profileName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const profileSkills = profileSkillText
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <div className="page-shell profile-theme">
      <Navbar />

      <div className="main-content profile-page">
        <div className="profile-inner">

          <header className="profile-hero">
            <div className="profile-hero-copy">
              <span className="profile-kicker">
                <User size={14} strokeWidth={2} aria-hidden="true" />
                Student profile
              </span>
              <h1>Your Career Profile</h1>
              <p>Keep your education, skills, and career direction up to date for more relevant guidance.</p>
            </div>
            <div className="profile-identity">
              <div className="profile-avatar" aria-hidden="true">
                {profileInitials || <User size={25} strokeWidth={1.7} />}
              </div>
              <div className="profile-identity-copy">
                <span>Profile owner</span>
                <strong>{profileName || "Name not provided"}</strong>
                {formData.email && <small>{formData.email}</small>}
              </div>
            </div>
          </header>

          <section className="profile-overview" aria-label="Profile overview">
            <article className="profile-overview-item">
              <div className="profile-overview-icon"><GraduationCap size={17} aria-hidden="true" /></div>
              <div><span>Education</span><strong>{formData.education || (loading ? "Loading profile…" : "Not provided")}</strong></div>
            </article>
            <article className="profile-overview-item">
              <div className="profile-overview-icon"><Briefcase size={17} aria-hidden="true" /></div>
              <div><span>Career interest</span><strong>{formData.interest || (loading ? "Loading profile…" : "Not provided")}</strong></div>
            </article>
            <article className="profile-overview-item profile-overview-skills">
              <div className="profile-overview-icon"><Code2 size={17} aria-hidden="true" /></div>
              <div className="profile-overview-skill-content">
                <span>Current skills</span>
                {profileSkills.length > 0 ? (
                  <div className="profile-skill-list">
                    {profileSkills.map((skill, index) => <span className="profile-skill-chip" key={`${skill}-${index}`}>{skill}</span>)}
                  </div>
                ) : (
                  <strong>{loading ? "Loading profile…" : "Not provided"}</strong>
                )}
              </div>
            </article>
            <article className="profile-overview-item">
              <div className="profile-overview-icon"><Target size={17} aria-hidden="true" /></div>
              <div><span>Career goal</span><strong>{formData.careerGoal || (loading ? "Loading profile…" : "Not provided")}</strong></div>
            </article>
          </section>

          {/* Form card */}
          <section className="profile-card" aria-labelledby="profile-form-heading">
            <div className="profile-card-heading">
              <div className="profile-card-icon"><User size={18} aria-hidden="true" /></div>
              <div>
                <h2 id="profile-form-heading">Edit your profile</h2>
                <p>Complete all fields to unlock the most accurate AI recommendations.</p>
              </div>
            </div>

            {status.message && (
              <div
                className={`profile-status ${status.type === "success" ? "profile-status--success" : "profile-status--error"}`}
                role="status"
                aria-live="polite"
              >
                {status.type === "success"
                  ? <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
                  : <AlertCircle  size={16} strokeWidth={2} aria-hidden="true" />
                }
                {status.message}
              </div>
            )}

            {loading ? <div className="profile-loading" aria-live="polite"><div className="spinner" /> Loading your profile…</div> : <form onSubmit={saveProfile} className="profile-form">
              <div className="profile-grid">
                <div className="profile-section-heading profile-grid--wide">
                  <span>01</span>
                  <h3>Personal information</h3>
                </div>
                <div className="form-group">
                  <label htmlFor="pf-name">Full name <span className="pf-required">*</span></label>
                  <input
                    id="pf-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pf-email">Email address <span className="pf-required">*</span></label>
                  <input
                    id="pf-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="profile-section-heading profile-grid--wide">
                  <span>02</span>
                  <h3>Career direction</h3>
                </div>
                <div className="form-group">
                  <label htmlFor="pf-education">Education <span className="pf-required">*</span></label>
                  <input
                    id="pf-education"
                    name="education"
                    type="text"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="e.g. BSc in Computer Science"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pf-interest">Career interest <span className="pf-required">*</span></label>
                  <input
                    id="pf-interest"
                    name="interest"
                    type="text"
                    value={formData.interest}
                    onChange={handleChange}
                    placeholder="e.g. Data and AI"
                    required
                  />
                </div>

                <div className="form-group profile-grid--wide">
                  <label htmlFor="pf-skills">
                    Current skills <span className="pf-required">*</span>
                    <span className="pf-hint">Separate each skill with a comma</span>
                  </label>
                  <input
                    id="pf-skills"
                    name="skills"
                    type="text"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Python, SQL, React, Machine Learning"
                    required
                  />
                </div>

                <div className="form-group profile-grid--wide">
                  <label htmlFor="pf-goal">
                    Career goal <span className="pf-required">*</span>
                  </label>
                  <input
                    id="pf-goal"
                    name="careerGoal"
                    type="text"
                    value={formData.careerGoal}
                    onChange={handleChange}
                    placeholder="e.g. Become a data scientist at a tech company"
                    required
                  />
                </div>
              </div>

              <div className="profile-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving profile…" : "Save profile"}
                </button>
              </div>
            </form>}
          </section>

        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Profile;
