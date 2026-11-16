import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { User, CheckCircle2, AlertCircle } from "lucide-react";
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

  return (
    <div className="page-shell">
      <Navbar />

      <div className="main-content profile-page">
        <div className="profile-inner">

          {/* Page header */}
          <div className="page-header">
            <div className="page-kicker">
              <User size={13} strokeWidth={2} aria-hidden="true" />
              Personalisation
            </div>
            <h1>Your Career Profile</h1>
            <p>Share a few details so every AI insight is tailored specifically to you.</p>
          </div>

          {/* Form card */}
          <section className="profile-card" aria-labelledby="profile-form-heading">
            <div className="profile-card-heading">
              <h2 id="profile-form-heading">Your details</h2>
              <p>Complete all fields to unlock the most accurate AI recommendations.</p>
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
