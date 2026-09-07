import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FileSearch } from "lucide-react";
import { IconUpload, IconDocument } from "../components/icons/Icons";
import "./ResumeAnalyzer.css";

const ANALYSIS_SECTIONS = [
  ["Strengths", "strengths"],
  ["Weaknesses", "weaknesses"],
  ["Missing Skills", "missingSkills"],
  ["Career Matches", "careerMatches"],
  ["Recommended Certifications", "recommendedCertifications"],
  ["Recommended Courses", "recommendedCourses"],
  ["Portfolio Projects", "portfolioProjects"],
  ["Resume Improvements", "resumeImprovements"],
  ["Interview Preparation Tips", "interviewPreparation"],
  ["30-Day Learning Plan", "next30DaysPlan"],
];

const toItems = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value];
  return [];
};

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const selectFile = (selectedFile) => {
    setError("");
    setAnalysis(null);

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Your resume must not exceed 5 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    selectFile(event.dataTransfer.files[0]);
  };

  const analyzeResume = async () => {
    if (!file || loading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    setLoading(true);
    setUploadProgress(0);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/resume/analyze",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          onUploadProgress: (event) => {
            if (event.total) {
              setUploadProgress(Math.round((event.loaded * 100) / event.total));
            }
          },
        }
      );

      setAnalysis(response.data);
    } catch (requestError) {
      const status = requestError.response?.status;

      if (status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else if (status === 404) {
        setError("Profile not found. Please complete your profile first.");
      } else if (status === 500) {
        setError("Gemini could not analyze your resume right now. Please try again.");
      } else {
        setError(requestError.response?.data?.message || "Resume upload failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-page">
      <Navbar />
      <main className="resume-main">
        <section className="resume-hero">
          <span className="resume-hero-badge"><IconDocument /> GEMINI-POWERED RESUME INTELLIGENCE</span>
          <h1>Resume Analyzer</h1>
          <p>Uncover your resume’s strengths, ATS readiness, and a clear path to your next opportunity.</p>
        </section>

        {!analysis && !loading && (
          <section className="resume-upload-card">
            <div
              className={`resume-dropzone ${dragActive ? "is-dragging" : ""}`}
              onDragEnter={(event) => { event.preventDefault(); setDragActive(true); }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <div className="resume-upload-icon"><IconUpload /></div>
              <h2>{file ? "Your resume is ready" : "Drop your resume here"}</h2>
              <p>{file ? file.name : "Drag and drop a PDF, or browse from your device."}</p>
              <button type="button" onClick={() => inputRef.current?.click()}>Browse File</button>
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                onChange={(event) => selectFile(event.target.files[0])}
                hidden
              />
              <small>PDF only · Maximum file size 5 MB</small>
            </div>

            {file && <div className="resume-file-name"><span>PDF</span>{file.name}</div>}
            {error && <div className="resume-error" role="alert">{error}</div>}
            <button className="resume-analyze-button" type="button" disabled={!file} onClick={analyzeResume}>
              Analyze Resume <span>→</span>
            </button>
          </section>
        )}

        {loading && (
          <section className="resume-loading" aria-live="polite">
            <div className="resume-orb"><FileSearch aria-hidden="true" /></div>
            <h2>Gemini is analysing your resume...</h2>
            <p>Extracting your experience and matching it against career opportunities.</p>
            <div className="resume-progress"><i style={{ width: `${Math.max(uploadProgress, 8)}%` }} /></div>
            <small>{uploadProgress < 100 ? `Uploading ${uploadProgress}%` : "Generating your personalised report"}</small>
          </section>
        )}

        {analysis && !loading && (
          <section className="resume-results">
            <div className="resume-score-card">
              <div className="resume-score-ring" style={{ "--score": `${Math.min(Math.max(Number(analysis.atsScore) || 0, 0), 100)}%` }}>
                <div><strong>{Math.round(Number(analysis.atsScore) || 0)}</strong><span>ATS Score</span></div>
              </div>
              <div><span className="resume-eyebrow">YOUR RESUME REPORT</span><h2>Ready for a stronger application?</h2><p>{analysis.summary || "Use these focused recommendations to make your resume clearer, more relevant, and more competitive."}</p></div>
              <button type="button" onClick={() => { setAnalysis(null); setFile(null); }}>Analyze another resume</button>
            </div>

            <div className="resume-results-grid">
              {ANALYSIS_SECTIONS.map(([title, key]) => {
                const items = toItems(analysis[key]);
                return (
                  <article className="resume-result-card" key={key}>
                    <div className="resume-result-icon"><IconDocument /></div>
                    <h3>{title}</h3>
                    {items.length ? <ul>{items.map((item, index) => <li key={index}>{item}</li>)}</ul> : <p>No recommendations available for this section.</p>}
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default ResumeAnalyzer;
