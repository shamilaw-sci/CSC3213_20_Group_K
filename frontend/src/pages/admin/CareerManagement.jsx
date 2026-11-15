import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Search,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";
import "./AdminDashboard.css";
import "./CareerManagement.css";

const API = "http://localhost:5000/api/admin";
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const EMPTY_FORM = {
  title: "",
  description: "",
  salaryRange: "",
  requiredSkills: "",
  futureScope: "",
};

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

function CareerManagement() {
  const [careers, setCareers] = useState([]);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCareers: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [viewCareer, setViewCareer] = useState(null);
  const formSectionRef = useRef(null);
  const navigate = useNavigate();

  const handleAuthError = useCallback((requestError) => {
    if (requestError.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login", { replace: true });
      return true;
    }

    if (requestError.response?.status === 403) {
      navigate("/dashboard", { replace: true });
      return true;
    }

    return false;
  }, [navigate]);

  const fetchCareers = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (appliedQuery) {
      params.set("search", appliedQuery);
    }

    try {
      const response = await axios.get(`${API}/careers?${params.toString()}`, authConfig());
      const result = response.data;
      if (!Array.isArray(result.careers) || !result.pagination) {
        throw new Error("The server returned an invalid career list.");
      }

      setCareers(result.careers);
      setPagination(result.pagination);
      if (result.pagination.page !== page) {
        setPage(result.pagination.page);
      }
    } catch (requestError) {
      if (!handleAuthError(requestError)) {
        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Failed to load careers. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [appliedQuery, handleAuthError, page, pageSize]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }
    Promise.resolve().then(fetchCareers);
  }, [fetchCareers, navigate]);

  useEffect(() => {
    if (showForm) {
      formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editId, showForm]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setAppliedQuery(query.trim());
  };

  const clearSearch = () => {
    setQuery("");
    setAppliedQuery("");
    setPage(1);
  };

  const openCreate = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM });
    setFormError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEdit = (career) => {
    setViewCareer(null);
    setEditId(career._id);
    setForm({
      title: career.title || "",
      description: career.description || "",
      salaryRange: career.salaryRange || "",
      requiredSkills: Array.isArray(career.requiredSkills)
        ? career.requiredSkills.join(", ")
        : "",
      futureScope: career.futureScope || "",
    });
    setFormError("");
    setSuccess("");
    setShowForm(true);
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      return "Career title is required.";
    }
    if (form.title.trim().length > 150) {
      return "Career title cannot exceed 150 characters.";
    }
    if (form.description.trim().length > 5000) {
      return "Description cannot exceed 5000 characters.";
    }
    if (form.salaryRange.trim().length > 200) {
      return "Salary range cannot exceed 200 characters.";
    }
    if (form.futureScope.trim().length > 3000) {
      return "Future scope cannot exceed 3000 characters.";
    }

    const skills = form.requiredSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    if (skills.length > 100) {
      return "Enter no more than 100 required skills.";
    }
    if (skills.some((skill) => skill.length > 80)) {
      return "Each required skill must be at most 80 characters.";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      salaryRange: form.salaryRange.trim(),
      requiredSkills: form.requiredSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      futureScope: form.futureScope.trim(),
    };

    setSaving(true);
    setFormError("");
    setError("");

    try {
      const response = editId
        ? await axios.put(`${API}/careers/${editId}`, payload, authConfig())
        : await axios.post(`${API}/careers`, payload, authConfig());

      setShowForm(false);
      await fetchCareers();
      setSuccess(response.data.message || `Career ${editId ? "updated" : "created"} successfully.`);
    } catch (requestError) {
      if (!handleAuthError(requestError)) {
        setFormError(
          requestError.response?.data?.message ||
            "Failed to save career. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (career) => {
    if (!window.confirm(`Delete "${career.title}"? This cannot be undone.`)) {
      return;
    }

    setDeleting(career._id);
    setError("");
    setSuccess("");

    try {
      const response = await axios.delete(`${API}/careers/${career._id}`, authConfig());
      if (viewCareer?._id === career._id) {
        setViewCareer(null);
      }
      await fetchCareers();
      setSuccess(response.data.message || `Career "${career.title}" was deleted.`);
    } catch (requestError) {
      if (!handleAuthError(requestError)) {
        setError(
          requestError.response?.data?.message ||
            "Failed to delete career. Please try again."
        );
      }
    } finally {
      setDeleting(null);
    }
  };

  const totalCareers = pagination.totalCareers || 0;
  const firstCareer = totalCareers === 0 ? 0 : (pagination.page - 1) * pageSize + 1;
  const lastCareer = Math.min(pagination.page * pageSize, totalCareers);

  return (
    <div className="page-shell admin-theme">
      <AdminNavbar />
      <main className="main-content adm-page cm-page">
        <div className="adm-page-header">
          <div className="adm-page-kicker">
            <Shield size={13} /> Admin
          </div>
          <h1 className="adm-page-title">Career Management</h1>
          <p className="adm-page-sub">Create, view and manage career information</p>
        </div>

        {success && (
          <div className="cm-feedback cm-feedback--success" role="status">
            {success}
          </div>
        )}
        {error && (
          <div className="cm-feedback cm-feedback--error" role="alert">
            {error}
          </div>
        )}

        {showForm && (
          <section
            ref={formSectionRef}
            className="adm-section cm-form-section"
            aria-labelledby="cm-form-title"
          >
            <div className="adm-section-header">
              <h2 className="adm-section-title" id="cm-form-title">
                {editId ? "Edit Career" : "Add New Career"}
              </h2>
              <button
                className="btn btn-sm"
                type="button"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                <X size={14} /> Cancel
              </button>
            </div>
            <form className="cm-form" onSubmit={handleSubmit} noValidate>
              {formError && (
                <div className="cm-feedback cm-feedback--error" role="alert">
                  {formError}
                </div>
              )}
              <div className="cm-form-grid">
                <div className="form-group cm-form-wide">
                  <label htmlFor="cm-title">Title *</label>
                  <input
                    id="cm-title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    maxLength={150}
                    required
                    aria-invalid={Boolean(formError && !form.title.trim())}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cm-salary">Salary range</label>
                  <input
                    id="cm-salary"
                    name="salaryRange"
                    type="text"
                    value={form.salaryRange}
                    onChange={(event) => setForm((current) => ({ ...current, salaryRange: event.target.value }))}
                    maxLength={200}
                    placeholder="e.g. $80k–$120k"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cm-skills">Required skills (comma-separated)</label>
                  <input
                    id="cm-skills"
                    name="requiredSkills"
                    type="text"
                    value={form.requiredSkills}
                    onChange={(event) => setForm((current) => ({ ...current, requiredSkills: event.target.value }))}
                    placeholder="Python, React, AWS"
                  />
                </div>
                <div className="form-group cm-form-wide">
                  <label htmlFor="cm-description">Description</label>
                  <textarea
                    id="cm-description"
                    name="description"
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    maxLength={5000}
                    rows={4}
                  />
                </div>
                <div className="form-group cm-form-wide">
                  <label htmlFor="cm-future-scope">Future scope</label>
                  <textarea
                    id="cm-future-scope"
                    name="futureScope"
                    value={form.futureScope}
                    onChange={(event) => setForm((current) => ({ ...current, futureScope: event.target.value }))}
                    maxLength={3000}
                    rows={3}
                  />
                </div>
              </div>
              <div className="cm-form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : editId ? "Update Career" : "Create Career"}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="adm-section" aria-labelledby="cm-list-title" aria-busy={loading}>
          <div className="adm-section-header cm-section-header">
            <h2 className="adm-section-title" id="cm-list-title">
              <Briefcase size={16} aria-hidden="true" />
              Careers
            </h2>
            <div className="cm-list-actions">
              <span className="cm-result-count">
                {loading ? "Loading…" : `${totalCareers.toLocaleString()} career${totalCareers === 1 ? "" : "s"}`}
              </span>
              <button className="btn btn-primary btn-sm" type="button" onClick={openCreate}>
                <Plus size={15} /> Add Career
              </button>
            </div>
          </div>

          <form className="cm-toolbar" onSubmit={handleSearch}>
            <label className="cm-search">
              <Search size={16} aria-hidden="true" />
              <span className="visually-hidden">Search career information</span>
              <input
                type="search"
                placeholder="Search title, description, salary, skills or future scope…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Search
            </button>
            {query && (
              <button type="button" className="btn" onClick={clearSearch}>
                Clear
              </button>
            )}
            <label className="cm-page-size">
              <span>Page size</span>
              <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>
          </form>

          {loading ? (
            <div className="adm-loading cm-loading" role="status" aria-live="polite">
              <div className="spinner" />
              <span>Loading careers from the database…</span>
            </div>
          ) : error && careers.length === 0 ? (
            <div className="cm-empty-state">
              <p>Careers could not be loaded.</p>
              <button type="button" className="btn btn-sm" onClick={fetchCareers}>
                Try again
              </button>
            </div>
          ) : careers.length === 0 ? (
            <div className="cm-empty-state" role="status">
              <Briefcase size={24} aria-hidden="true" />
              <p>{appliedQuery ? "No careers match your search." : "No career records are available."}</p>
              {!appliedQuery && (
                <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
                  <Plus size={14} /> Add the first career
                </button>
              )}
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Salary range</th>
                    <th>Required skills</th>
                    <th className="cm-actions-heading">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {careers.map((career) => (
                    <tr key={career._id}>
                      <td>
                        <strong>{career.title}</strong>
                        {career.description && (
                          <div className="cm-description-preview">{career.description}</div>
                        )}
                      </td>
                      <td>{career.salaryRange || "—"}</td>
                      <td>
                        {career.requiredSkills?.length
                          ? `${career.requiredSkills.length} skill${career.requiredSkills.length === 1 ? "" : "s"}`
                          : "—"}
                      </td>
                      <td>
                        <div className="cm-row-actions">
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => setViewCareer(career)}
                          >
                            <Eye size={14} aria-hidden="true" /> View
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => openEdit(career)}
                          >
                            <Pencil size={13} aria-hidden="true" /> Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm cm-delete-button"
                            disabled={deleting === career._id}
                            onClick={() => handleDelete(career)}
                          >
                            {deleting === career._id
                              ? <span className="spinner cm-button-spinner" />
                              : <Trash2 size={13} aria-hidden="true" />}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && (
            <div className="cm-pagination">
              <span>
                {totalCareers === 0
                  ? "No careers to display"
                  : `Showing ${firstCareer}–${lastCareer} of ${totalCareers.toLocaleString()}`}
              </span>
              <div className="cm-page-controls">
                <button
                  type="button"
                  className="btn btn-sm"
                  disabled={pagination.page <= 1 || totalCareers === 0}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft size={14} aria-hidden="true" /> Previous
                </button>
                <span>
                  {totalCareers === 0
                    ? "Page 0 of 0"
                    : `Page ${pagination.page} of ${pagination.totalPages}`}
                </span>
                <button
                  type="button"
                  className="btn btn-sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next <ChevronRight size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </section>
        <Footer />
      </main>

      {viewCareer && (
        <div className="cm-modal-backdrop">
          <section
            className="cm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cm-details-title"
          >
            <header className="cm-modal-header">
              <div>
                <span className="adm-page-kicker">Career details</span>
                <h2 id="cm-details-title">{viewCareer.title}</h2>
              </div>
              <button
                className="btn btn-sm"
                type="button"
                aria-label="Close career details"
                onClick={() => setViewCareer(null)}
              >
                <X size={17} />
              </button>
            </header>
            <div className="cm-modal-content">
              <div className="cm-detail-item">
                <h3>Description</h3>
                <p>{viewCareer.description || "No description provided."}</p>
              </div>
              <div className="cm-detail-grid">
                <div className="cm-detail-item">
                  <h3>Salary range</h3>
                  <p>{viewCareer.salaryRange || "Not specified."}</p>
                </div>
                <div className="cm-detail-item">
                  <h3>Required skills</h3>
                  {viewCareer.requiredSkills?.length ? (
                    <ul>{viewCareer.requiredSkills.map((skill, index) => <li key={`${skill}-${index}`}>{skill}</li>)}</ul>
                  ) : <p>No skills listed.</p>}
                </div>
              </div>
              <div className="cm-detail-item">
                <h3>Future scope</h3>
                <p>{viewCareer.futureScope || "Not specified."}</p>
              </div>
              <div className="cm-modal-actions">
                <button type="button" className="btn btn-primary" onClick={() => openEdit(viewCareer)}>
                  <Pencil size={14} /> Edit Career
                </button>
                <button type="button" className="btn" onClick={() => setViewCareer(null)}>
                  Close
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default CareerManagement;
