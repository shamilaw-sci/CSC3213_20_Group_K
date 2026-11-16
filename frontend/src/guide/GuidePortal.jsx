import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  CAREER_PATH_OPTIONS,
  loadGuidePortalState,
  resetGuidePortalPreview,
  saveGuidePortalState,
} from "./guidePortalData";
import "./GuidePortal.css";
import { BOOKING_UPDATE_EVENT } from "../services/bookingService";
import { hydrateGuideFromStudent, respondToGuideBooking, syncGuideToStudent } from "./guideStudentBridge";
import { clearAuthSession, getAuthUser } from "../auth/session";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/guide/dashboard", icon: "grid" },
  { label: "My Expertise", path: "/guide/expertise", icon: "spark" },
  { label: "Availability", path: "/guide/availability", icon: "calendar" },
  { label: "Booking Settings", path: "/guide/booking-settings", icon: "sliders" },
  { label: "Booking Requests", path: "/guide/requests", icon: "inbox" },
  { label: "My Appointments", path: "/guide/appointments", icon: "clock" },
  { label: "My Students", path: "/guide/students", icon: "users" },
  { label: "Notifications", path: "/guide/notifications", icon: "bell" },
  { label: "Settings", path: "/guide/settings", icon: "settings" },
];

const PAGE_TITLES = {
  dashboard: ["Dashboard", "A clear view of your guidance activity."],
  profile: ["My profile", "Keep your professional profile current and useful to students."],
  expertise: ["Expertise & career paths", "Choose the areas where you can offer meaningful guidance."],
  availability: ["Availability", "Set your weekly schedule and manage individual session slots."],
  "booking-settings": ["Booking preferences", "Choose how student appointment requests are handled."],
  requests: ["Booking requests", "Review requests and respond to students."],
  appointments: ["My appointments", "Track upcoming and completed guidance sessions."],
  students: ["My students", "See students you have supported through career guidance."],
  notifications: ["Notifications", "Stay up to date with requests and account activity."],
  settings: ["Settings", "Manage this local development preview."],
};

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.6-3.3 3.1-5 7-5s6.4 1.7 7 5" /></>,
    spark: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" /><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /><path d="m9 15 2 2 4-4" /></>,
    sliders: <><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>,
    inbox: <><path d="M4 4h16l1 12H3L4 4Z" /><path d="M3 16h5l2 3h4l2-3h5" /><path d="M12 7v5m-2-2 2 2 2-2" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c.4-3 2.3-4.5 6-4.5s5.6 1.5 6 4.5" /><path d="M16 5.5a3 3 0 0 1 0 5.8M17 15.5c2.4.4 3.7 1.9 4 4.5" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.1 1.8-1.8 3.1-2.1-.5a8 8 0 0 1-1.7 1l-.8 2.1h-3.6l-.8-2.1a8 8 0 0 1-1.7-1l-2.1.5-1.8-3.1 1.1-1.8a8 8 0 0 1 0-2l-1.1-1.8 1.8-3.1 2.1.5a8 8 0 0 1 1.7-1l.8-2.1h3.6l.8 2.1a8 8 0 0 1 1.7 1l2.1-.5 1.8 3.1-1.1 1.8a8 8 0 0 1 0 2Z" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" /></>,
    moon: <path d="M20.5 14.1A8.5 8.5 0 0 1 9.9 3.5 8.6 8.6 0 1 0 20.5 14.1Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
  };
  return <svg {...common}>{paths[name] || paths.grid}</svg>;
}

const formatDate = (value) => {
  if (!value) return "Not set";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
};

const optimizeProfilePhoto = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error("The selected image could not be read."));
  reader.onload = () => {
    const image = new Image();
    image.onerror = () => reject(new Error("Please choose a valid image file."));
    image.onload = () => {
      const scale = Math.min(1, 480 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

function GuideAvatar({ profile, className = "gp-avatar" }) {
  const initials = (profile.fullName || "Guide").split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  return <span className={className}>{profile.profilePhoto ? <img src={profile.profilePhoto} alt="" /> : initials}</span>;
}

const initialState = () => {
  const state = loadGuidePortalState();
  syncGuideToStudent(state);
  return hydrateGuideFromStudent(state);
};
const initialTheme = () => {
  try {
    return window.localStorage.getItem("csc3213_guide_portal_theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

export default function GuidePortal() {
  const [data, setData] = useState(initialState);
  const [theme, setTheme] = useState(initialTheme);
  const [notice, setNotice] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const currentItem = NAV_ITEMS.find((item) => item.path === location.pathname);
  const routeKey = location.pathname.replace("/guide/", "");
  const [title, subtitle] = PAGE_TITLES[routeKey] || [];
  const pendingCount = data.requests.filter((request) => request.status === "Pending").length;
  const unreadCount = data.notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    const refresh = () => setData((current) => hydrateGuideFromStudent(loadGuidePortalState() || current));
    window.addEventListener(BOOKING_UPDATE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(BOOKING_UPDATE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    if (!profileMenuOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) setProfileMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setProfileMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileMenuOpen]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    try {
      window.localStorage.setItem("csc3213_guide_portal_theme", nextTheme);
    } catch {
      // Theme still changes for this session if browser storage is unavailable.
    }
    setTheme(nextTheme);
  };

  const signOut = () => {
    clearAuthSession();
    navigate("/login", { replace: true });
  };

  const commit = (change) => {
    const next = change(structuredClone(data));
    syncGuideToStudent(next);
    const hydrated = hydrateGuideFromStudent(next);
    const result = saveGuidePortalState(hydrated);
    if (!result.ok) {
      setNotice(result.message);
      return;
    }
    setData(hydrated);
    setNotice("Changes saved in this browser preview.");
    window.setTimeout(() => setNotice(""), 2600);
  };

  if (!title) return <Navigate to="/guide/dashboard" replace />;

  return (
    <div className="gp-shell" data-theme={theme}>
      <aside className="gp-sidebar">
        <Link to="/guide/dashboard" className="gp-brand" aria-label="Guide Portal home">
          <span className="gp-brand-mark"><Icon name="briefcase" size={20} /></span>
          <span><strong>Pathfinder</strong><small>GUIDE PORTAL</small></span>
        </Link>

        <div className="gp-workspace-label">WORKSPACE</div>
        <nav className="gp-nav" aria-label="Guide navigation">
          {NAV_ITEMS.map((item) => {
            const active = currentItem?.path === item.path;
            const badge = item.path === "/guide/requests" ? pendingCount : item.path === "/guide/notifications" ? unreadCount : 0;
            return (
              <Link key={item.path} to={item.path} className={`gp-nav-link ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined}>
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
                {badge > 0 && <span className="gp-nav-badge">{badge}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="gp-sidebar-bottom">
          <div className="gp-preview-note"><span className="gp-status-dot" />Development preview</div>
          <Link to="/career" className="gp-exit-link"><Icon name="arrow" size={17} /> Return to student portal</Link>
        </div>
      </aside>

      <main className="gp-main">
        <header className="gp-topbar">
          <div className="gp-breadcrumb">Guide workspace <span>/</span> <strong>{title}</strong></div>
          <div className="gp-topbar-actions">
            <button className="gp-theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} aria-pressed={theme === "dark"}>
              <Icon name={theme === "light" ? "moon" : "sun"} size={17} />
              <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
            </button>
            <span className="gp-preview-pill"><span className="gp-status-dot" /> Preview mode</span>
            <Link to="/guide/notifications" className="gp-icon-action" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}>
              <Icon name="bell" size={19} />{unreadCount > 0 && <i />}
            </Link>
            <div className="gp-profile-menu-wrap" ref={profileMenuRef}>
              <button className={`gp-profile-menu-trigger ${profileMenuOpen ? "is-open" : ""}`} type="button" aria-label="Open guide profile menu" aria-haspopup="menu" aria-expanded={profileMenuOpen} onClick={() => setProfileMenuOpen((open) => !open)}>
                <GuideAvatar profile={data.profile} className="gp-topbar-avatar" />
                <span className="gp-profile-trigger-name">{(authUser?.name || data.profile.fullName).split(/\s+/)[0]}</span>
                <svg className="gp-profile-chevron" width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              {profileMenuOpen && <div className="gp-profile-dropdown" role="menu" aria-label="Guide account menu">
                <div className="gp-profile-dropdown-header"><GuideAvatar profile={data.profile} className="gp-dropdown-avatar" /><div><strong>{authUser?.name || data.profile.fullName}</strong><span>{authUser?.email || data.profile.professionalTitle || data.profile.guideType}</span></div></div>
                <div className="gp-profile-dropdown-divider" />
                <Link to="/guide/profile" role="menuitem" onClick={() => setProfileMenuOpen(false)}><Icon name="user" size={17} /><span>My Profile</span><Icon name="arrow" size={15} /></Link>
                <Link to="/guide/settings" role="menuitem" onClick={() => setProfileMenuOpen(false)}><Icon name="settings" size={17} /><span>Settings</span><Icon name="arrow" size={15} /></Link>
                <button type="button" className="gp-profile-signout" role="menuitem" onClick={signOut}><Icon name="arrow" size={17} /><span>Sign out</span></button>
              </div>}
            </div>
          </div>
        </header>

        <div className="gp-page-content">
          <div className="gp-page-heading">
            <div><p className="gp-eyebrow">GUIDE WORKSPACE</p><h1>{title}</h1><p>{subtitle}</p></div>
            <span className="gp-heading-date">{new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date())}</span>
          </div>
          {notice && <div className="gp-toast" role="status">{notice}</div>}
          <GuidePage routeKey={routeKey} data={data} commit={commit} />
          <footer className="gp-footer">Guide Portal <span>·</span> Local development preview <span>·</span> No shared authentication connected</footer>
        </div>
      </main>
    </div>
  );
}

function GuidePage({ routeKey, data, commit }) {
  switch (routeKey) {
    case "dashboard": return <Dashboard data={data} />;
    case "profile": return <ProfilePage data={data} commit={commit} />;
    case "expertise": return <ExpertisePage data={data} commit={commit} />;
    case "availability": return <AvailabilityPage data={data} commit={commit} />;
    case "booking-settings": return <BookingSettingsPage data={data} commit={commit} />;
    case "requests": return <RequestsPage data={data} commit={commit} />;
    case "appointments": return <AppointmentsPage data={data} commit={commit} />;
    case "students": return <StudentsPage data={data} />;
    case "notifications": return <NotificationsPage data={data} commit={commit} />;
    case "settings": return <SettingsPage />;
    default: return null;
  }
}

function StatCard({ label, value, note, icon, tone = "blue" }) {
  return <article className="gp-stat-card"><span className={`gp-stat-icon tone-${tone}`}><Icon name={icon} size={19} /></span><div><p>{label}</p><strong>{value}</strong><small>{note}</small></div></article>;
}

function SectionCard({ title, action, children, className = "" }) {
  return <section className={`gp-card ${className}`}><div className="gp-card-heading"><h2>{title}</h2>{action}</div>{children}</section>;
}

function EmptyState({ title, body }) {
  return <div className="gp-empty"><span className="gp-empty-mark"><Icon name="inbox" size={21} /></span><strong>{title}</strong><p>{body}</p></div>;
}

function Dashboard({ data }) {
  const pending = data.requests.filter((item) => item.status === "Pending");
  const upcoming = data.appointments.filter((item) => item.status === "Confirmed");
  const completed = data.appointments.filter((item) => item.status === "Completed");
  const available = data.availability.slots.filter((slot) => slot.status === "Available");
  const recent = [...data.notifications].slice(0, 3);
  const profileFields = ["fullName", "professionalTitle", "bio", "email", "languages", "qualifications", "experience", ...(data.profile.guideType === "University Lecturer" ? ["university", "faculty", "department", "researchInterests", "teachingExperience"] : ["organization", "industry", "certifications"])];
  const profileCompletion = Math.round(profileFields.filter((field) => data.profile[field]?.trim()).length / profileFields.length * 100);
  return <>
    <div className="gp-welcome-banner"><div className="gp-welcome-intro"><GuideAvatar profile={data.profile} className="gp-dashboard-avatar" /><div><span className="gp-welcome-eyebrow">YOUR IMPACT, AT A GLANCE</span><h2>Welcome back, {data.profile.fullName.split(" ")[0]}.</h2><p>Your experience can help students take their next step with confidence.</p></div></div><div className="gp-profile-completion"><span>PROFILE COMPLETION</span><strong>{profileCompletion}%</strong><div><i style={{ width: `${profileCompletion}%` }} /></div><Link to="/guide/profile">Complete your profile <Icon name="arrow" size={15} /></Link></div></div>

    <div className="gp-stat-grid">
      <StatCard label="Students guided" value={data.students.length} note="Across your career paths" icon="users" tone="blue" />
      <StatCard label="Upcoming sessions" value={upcoming.length} note="Confirmed appointments" icon="calendar" tone="violet" />
      <StatCard label="Pending requests" value={pending.length} note="Need your response" icon="inbox" tone="amber" />
      <StatCard label="Open time slots" value={available.length} note="Ready for student bookings" icon="clock" tone="green" />
    </div>

    <div className="gp-dashboard-grid">
      <SectionCard title="Upcoming appointments" action={<Link className="gp-text-link" to="/guide/appointments">View schedule <Icon name="arrow" size={15} /></Link>}>
        {upcoming.length ? <div className="gp-list">{upcoming.map((appointment) => <AppointmentRow key={appointment.id} item={appointment} />)}</div> : <EmptyState title="No upcoming sessions" body="Confirmed student appointments will appear here." />}
      </SectionCard>
      <SectionCard title="Requests to review" action={<Link className="gp-text-link" to="/guide/requests">See requests <Icon name="arrow" size={15} /></Link>}>
        {pending.length ? <div className="gp-list">{pending.slice(0, 3).map((request) => <RequestMini key={request.id} item={request} />)}</div> : <EmptyState title="All caught up" body="New booking requests will show here." />}
      </SectionCard>
    </div>

    <div className="gp-dashboard-grid gp-dashboard-grid-bottom">
      <SectionCard title="Recent activity" action={<Link className="gp-text-link" to="/guide/notifications">All notifications <Icon name="arrow" size={15} /></Link>}>
        {recent.length ? <div className="gp-list">{recent.map((item) => <div className="gp-activity-row" key={item.id}><span className={`gp-activity-dot ${item.read ? "is-read" : ""}`} /><div><strong>{item.title}</strong><p>{item.body}</p></div><time>{formatDate(item.date)}</time></div>)}</div> : <EmptyState title="No activity yet" body="Updates about your guide workspace will appear here." />}
      </SectionCard>
      <SectionCard title="Your guidance focus" action={<Link className="gp-text-link" to="/guide/expertise">Edit expertise <Icon name="arrow" size={15} /></Link>}>
        <div className="gp-focus-list">{data.expertise.slice(0, 4).map((item) => <div className="gp-focus-item" key={item.id}><span className="gp-focus-symbol"><Icon name="spark" size={17} /></span><div><strong>{item.area}</strong><small>{item.careerPath} <span>·</span> {item.level}</small></div></div>)}</div>
      </SectionCard>
    </div>
    <div className="gp-session-summary"><span><Icon name="check" size={17} /></span><p><strong>{completed.length} sessions completed</strong><small>Every conversation helps a student move forward.</small></p><Link to="/guide/students">View students <Icon name="arrow" size={15} /></Link></div>
  </>;
}

function AppointmentRow({ item }) {
  return <div className="gp-appointment-row"><span className="gp-date-tile"><strong>{new Date(`${item.date}T00:00:00`).getDate()}</strong><small>{new Date(`${item.date}T00:00:00`).toLocaleDateString("en", { month: "short" })}</small></span><div className="gp-row-main"><strong>{item.studentName}</strong><span>{item.careerPath} <span>·</span> {item.topic}</span></div><div className="gp-row-time">{item.time}<small>{item.duration} min</small></div></div>;
}

function RequestMini({ item }) {
  return <div className="gp-request-mini"><span className="gp-avatar gp-avatar-small">{item.studentName.split(" ").map((part) => part[0]).join("")}</span><div><strong>{item.studentName}</strong><small>{item.careerPath} · {formatDate(item.requestedAt)}</small></div><span className="gp-status-pill status-pending">Pending</span></div>;
}

function ProfilePage({ data, commit }) {
  const [form, setForm] = useState(data.profile);
  const [photoError, setPhotoError] = useState("");
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => { event.preventDefault(); commit((state) => ({ ...state, profile: form })); };
  const choosePhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { setPhotoError("Choose an image file, such as JPG or PNG."); return; }
    if (file.size > 5 * 1024 * 1024) { setPhotoError("Choose an image smaller than 5 MB."); return; }
    try {
      set("profilePhoto", await optimizeProfilePhoto(file));
      setPhotoError("");
    } catch (error) {
      setPhotoError(error.message);
    }
  };
  return <form className="gp-form-page" onSubmit={submit}>
    <SectionCard title="Profile basics"><div className="gp-profile-cover"><GuideAvatar profile={form} className="gp-profile-avatar" /><div><strong>Profile preview</strong><p>This information will help students decide whether your guidance fits their goals.</p></div><span className="gp-profile-state">DRAFT PROFILE</span></div>
      <div className="gp-photo-field"><label className="gp-button gp-button-secondary" htmlFor="guide-profile-photo">{form.profilePhoto ? "Change profile photo" : "Upload profile photo"}</label><input id="guide-profile-photo" type="file" accept="image/*" onChange={choosePhoto} /><span>JPG or PNG, up to 5 MB. The image is resized for your profile.</span>{form.profilePhoto && <button className="gp-text-button" type="button" onClick={() => { set("profilePhoto", ""); setPhotoError(""); }}>Remove photo</button>}{photoError && <small role="alert">{photoError}</small>}</div>
      <div className="gp-form-grid">
        <Field label="Guide type"><select value={form.guideType} onChange={(e) => set("guideType", e.target.value)}><option>Industry Professional</option><option>University Lecturer</option></select></Field>
        <Field label="Full name" required><input required value={form.fullName} onChange={(e) => set("fullName", e.target.value)} /></Field>
        <Field label="Professional title" required><input required value={form.professionalTitle} onChange={(e) => set("professionalTitle", e.target.value)} /></Field>
        <Field label="Email address"><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
        <Field label="Phone number"><input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Add a contact number" /></Field>
        <Field label="Languages"><input value={form.languages} onChange={(e) => set("languages", e.target.value)} placeholder="English, Sinhala" /></Field>
        <Field label="Qualifications"><input value={form.qualifications} onChange={(e) => set("qualifications", e.target.value)} /></Field>
        <Field label="Professional experience"><input value={form.experience} onChange={(e) => set("experience", e.target.value)} placeholder="e.g. 8 years" /></Field>
        {form.guideType === "University Lecturer" ? <>
          <Field label="University"><input value={form.university} onChange={(e) => set("university", e.target.value)} /></Field>
          <Field label="Faculty"><input value={form.faculty} onChange={(e) => set("faculty", e.target.value)} /></Field>
          <Field label="Department"><input value={form.department} onChange={(e) => set("department", e.target.value)} /></Field>
          <Field label="Teaching experience"><input value={form.teachingExperience} onChange={(e) => set("teachingExperience", e.target.value)} /></Field>
          <Field label="Research interests" wide><textarea rows="3" value={form.researchInterests} onChange={(e) => set("researchInterests", e.target.value)} /></Field>
        </> : <>
          <Field label="Current organization"><input value={form.organization} onChange={(e) => set("organization", e.target.value)} /></Field>
          <Field label="Industry"><input value={form.industry} onChange={(e) => set("industry", e.target.value)} /></Field>
          <Field label="Certifications"><input value={form.certifications} onChange={(e) => set("certifications", e.target.value)} placeholder="Add relevant certifications" /></Field>
        </>}
        <Field label="Professional links" wide><input value={form.professionalLinks} onChange={(e) => set("professionalLinks", e.target.value)} placeholder="LinkedIn, portfolio, or professional website" /></Field>
        <Field label="About you" wide><textarea required rows="5" maxLength="800" value={form.bio} onChange={(e) => set("bio", e.target.value)} /><small className="gp-field-hint">{form.bio.length}/800 characters</small></Field>
      </div>
    </SectionCard>
    <div className="gp-form-actions"><span>Profile approval status: <strong>Pending administrator review</strong></span><button className="gp-button gp-button-primary" type="submit">Save profile <Icon name="check" size={16} /></button></div>
  </form>;
}

function Field({ label, children, required = false, wide = false }) {
  return <label className={`gp-field ${wide ? "is-wide" : ""}`}><span>{label}{required && <i> · required</i>}</span>{children}</label>;
}

function ExpertisePage({ data, commit }) {
  const [draft, setDraft] = useState({ careerPath: CAREER_PATH_OPTIONS[0], area: "", level: "Intermediate", description: "" });
  const [filter, setFilter] = useState("All");
  const items = filter === "All" ? data.expertise : data.expertise.filter((item) => item.careerPath === filter);
  const add = (event) => {
    event.preventDefault();
    if (!draft.area.trim()) return;
    commit((state) => ({ ...state, expertise: [...state.expertise, { ...draft, id: `exp-${Date.now()}`, area: draft.area.trim() }] }));
    setDraft({ ...draft, area: "", description: "" });
  };
  const update = (id, key, value) => commit((state) => ({ ...state, expertise: state.expertise.map((item) => item.id === id ? { ...item, [key]: value } : item) }));
  const remove = (id) => commit((state) => ({ ...state, expertise: state.expertise.filter((item) => item.id !== id) }));
  return <div className="gp-stack">
    <div className="gp-info-banner"><span className="gp-info-mark"><Icon name="spark" size={19} /></span><p><strong>Connect your strengths to student goals.</strong><small>Career paths you select can help students find relevant guidance.</small></p><span className="gp-info-count">{data.expertise.length} areas</span></div>
    <SectionCard title="Your expertise areas" action={<select className="gp-compact-select" value={filter} onChange={(e) => setFilter(e.target.value)}><option>All</option>{CAREER_PATH_OPTIONS.map((path) => <option key={path}>{path}</option>)}</select>}>
      {items.length ? <div className="gp-table-wrap"><table className="gp-table"><thead><tr><th>Career path</th><th>Expertise area</th><th>Experience level</th><th>Description</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><select aria-label="Career path" value={item.careerPath} onChange={(e) => update(item.id, "careerPath", e.target.value)}>{CAREER_PATH_OPTIONS.map((path) => <option key={path}>{path}</option>)}</select></td><td><input aria-label="Expertise area" value={item.area} onChange={(e) => update(item.id, "area", e.target.value)} /></td><td><select aria-label="Experience level" value={item.level} onChange={(e) => update(item.id, "level", e.target.value)}>{["Beginner", "Intermediate", "Advanced", "Expert"].map((level) => <option key={level}>{level}</option>)}</select></td><td><input aria-label="Description" value={item.description} onChange={(e) => update(item.id, "description", e.target.value)} /></td><td><button className="gp-icon-button danger" type="button" aria-label={`Remove ${item.area}`} onClick={() => remove(item.id)}><Icon name="close" size={17} /></button></td></tr>)}</tbody></table></div> : <EmptyState title="No expertise in this view" body="Choose another career path or add an expertise area below." />}
    </SectionCard>
    <SectionCard title="Add an expertise area"><form className="gp-form-grid gp-expertise-add" onSubmit={add}><Field label="Career path"><select value={draft.careerPath} onChange={(e) => setDraft({ ...draft, careerPath: e.target.value })}>{CAREER_PATH_OPTIONS.map((path) => <option key={path}>{path}</option>)}</select></Field><Field label="Expertise area" required><input required value={draft.area} onChange={(e) => setDraft({ ...draft, area: e.target.value })} placeholder="e.g. Cloud architecture" /></Field><Field label="Experience level"><select value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value })}>{["Beginner", "Intermediate", "Advanced", "Expert"].map((level) => <option key={level}>{level}</option>)}</select></Field><Field label="Description"><input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="What can students learn from you?" /></Field><div className="gp-field-submit"><button className="gp-button gp-button-primary" type="submit"><Icon name="plus" size={16} /> Add expertise</button></div></form></SectionCard>
  </div>;
}

function AvailabilityPage({ data, commit }) {
  const [slotDraft, setSlotDraft] = useState({ date: "", start: "09:00", duration: data.availability.defaultDuration });
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const toggleDay = (day) => commit((state) => ({ ...state, availability: { ...state.availability, weeklyDays: state.availability.weeklyDays.includes(day) ? state.availability.weeklyDays.filter((item) => item !== day) : [...state.availability.weeklyDays, day] } }));
  const addSlot = (event) => {
    event.preventDefault();
    commit((state) => ({ ...state, availability: { ...state.availability, slots: [...state.availability.slots, { ...slotDraft, id: `slot-${Date.now()}`, status: "Available" }] } }));
    setSlotDraft({ date: "", start: "09:00", duration: data.availability.defaultDuration });
  };
  const removeSlot = (id) => commit((state) => ({ ...state, availability: { ...state.availability, slots: state.availability.slots.filter((slot) => slot.id !== id) } }));
  return <div className="gp-stack">
    <SectionCard title="Weekly schedule"><p className="gp-section-intro">Select the days you are generally available. You can add specific dates and times below.</p><div className="gp-weekdays">{days.map((day) => <button type="button" key={day} onClick={() => toggleDay(day)} className={`gp-weekday ${data.availability.weeklyDays.includes(day) ? "is-selected" : ""}`}><span>{day.slice(0, 3)}</span><i>{data.availability.weeklyDays.includes(day) ? <Icon name="check" size={15} /> : ""}</i></button>)}</div><div className="gp-form-grid gp-availability-settings"><Field label="Default session duration"><select value={data.availability.defaultDuration} onChange={(e) => commit((state) => ({ ...state, availability: { ...state.availability, defaultDuration: Number(e.target.value) } }))}>{[30, 45, 60, 90].map((duration) => <option value={duration} key={duration}>{duration} minutes</option>)}</select></Field><Field label="Regular break time"><input value={data.availability.breaks} onChange={(e) => commit((state) => ({ ...state, availability: { ...state.availability, breaks: e.target.value } }))} /></Field><Field label="Unavailable dates" wide><input value={data.availability.unavailableDates} onChange={(e) => commit((state) => ({ ...state, availability: { ...state.availability, unavailableDates: e.target.value } }))} placeholder="Add dates you will be away" /></Field></div></SectionCard>
    <SectionCard title="Specific time slots"><form className="gp-slot-form" onSubmit={addSlot}><Field label="Date" required><input type="date" required min={new Date().toISOString().slice(0, 10)} value={slotDraft.date} onChange={(e) => setSlotDraft({ ...slotDraft, date: e.target.value })} /></Field><Field label="Start time" required><input type="time" required value={slotDraft.start} onChange={(e) => setSlotDraft({ ...slotDraft, start: e.target.value })} /></Field><Field label="Duration"><select value={slotDraft.duration} onChange={(e) => setSlotDraft({ ...slotDraft, duration: Number(e.target.value) })}>{[30, 45, 60, 90].map((duration) => <option key={duration} value={duration}>{duration} min</option>)}</select></Field><button className="gp-button gp-button-primary" type="submit"><Icon name="plus" size={16} /> Add slot</button></form>
      {data.availability.slots.length ? <div className="gp-slot-list">{[...data.availability.slots].sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`)).map((slot) => <div className="gp-slot-row" key={slot.id}><span className="gp-slot-icon"><Icon name="calendar" size={17} /></span><div><strong>{formatDate(slot.date)}</strong><small>{slot.start} · {slot.duration} minutes</small></div><span className={`gp-status-pill ${slot.status === "Booked" ? "status-confirmed" : slot.status === "Pending" ? "status-pending" : "status-available"}`}>{slot.status}</span>{slot.status === "Available" && <button className="gp-icon-button danger" type="button" aria-label="Remove slot" onClick={() => removeSlot(slot.id)}><Icon name="close" size={16} /></button>}</div>)}</div> : <EmptyState title="No specific slots yet" body="Add a date and time to create your first bookable session." />}
    </SectionCard>
  </div>;
}

function BookingSettingsPage({ data, commit }) {
  const choose = (mode) => commit((state) => ({ ...state, bookingApprovalMode: mode }));
  return <div className="gp-settings-layout"><SectionCard title="How should requests be handled?"><p className="gp-section-intro">Students booking one of your slots will follow this approval preference.</p><div className="gp-choice-grid">
    <button className={`gp-choice-card ${data.bookingApprovalMode === "manual" ? "is-selected" : ""}`} type="button" onClick={() => choose("manual")}><span className="gp-choice-icon"><Icon name="inbox" size={21} /></span><span className="gp-choice-radio">{data.bookingApprovalMode === "manual" && <i />}</span><strong>Manual approval</strong><p>Review each request and choose whether to accept or decline before it is confirmed.</p><small>YOU STAY IN CONTROL</small></button>
    <button className={`gp-choice-card ${data.bookingApprovalMode === "automatic" ? "is-selected" : ""}`} type="button" onClick={() => choose("automatic")}><span className="gp-choice-icon"><Icon name="check" size={21} /></span><span className="gp-choice-radio">{data.bookingApprovalMode === "automatic" && <i />}</span><strong>Automatic confirmation</strong><p>Confirm bookings as soon as a student selects one of your available slots.</p><small>LESS ADMIN, FASTER BOOKINGS</small></button>
  </div></SectionCard><aside className="gp-notice-card"><span><Icon name="settings" size={18} /></span><div><strong>Shared browser preview</strong><p>Student bookings and guide responses are connected in this browser. A backend is needed to share bookings across different users and devices.</p></div></aside></div>;
}

function RequestsPage({ data, commit }) {
  const [filter, setFilter] = useState("All requests");
  const requests = filter === "All requests" ? data.requests : data.requests.filter((request) => request.status === filter);
  const respond = (requestId, status) => {
    const request = data.requests.find((item) => item.id === requestId);
    if (!request || request.status !== "Pending") return;
    respondToGuideBooking(request.slotId, status === "Accepted" ? "Confirmed" : "Rejected");
    commit((current) => current);
  };
  return <SectionCard title="Student requests" action={<select className="gp-compact-select" value={filter} onChange={(e) => setFilter(e.target.value)}><option>All requests</option><option>Pending</option><option>Accepted</option><option>Rejected</option></select>}>
    {requests.length ? <div className="gp-request-list">{requests.map((request) => { const slot = data.availability.slots.find((item) => item.id === request.slotId); return <article className="gp-request-card" key={request.id}><div className="gp-request-head"><span className="gp-avatar">{request.studentName.split(" ").map((part) => part[0]).join("")}</span><div><h3>{request.studentName}</h3><p>{request.careerPath} <span>·</span> Requested {formatDate(request.requestedAt)}</p></div><span className={`gp-status-pill status-${request.status.toLowerCase()}`}>{request.status}</span></div><p className="gp-request-message">“{request.message}”</p><div className="gp-request-meta"><span><Icon name="calendar" size={16} /> Requested slot: {formatDate(slot?.date)}</span><span><Icon name="clock" size={16} /> {slot?.start || "Time pending"}</span></div>{request.status === "Pending" && <div className="gp-request-actions"><button type="button" className="gp-button gp-button-secondary" onClick={() => respond(request.id, "Rejected")}><Icon name="close" size={16} /> Decline</button><button type="button" className="gp-button gp-button-primary" onClick={() => respond(request.id, "Accepted")}><Icon name="check" size={16} /> Accept request</button></div>}</article>; })}</div> : <EmptyState title="No requests in this view" body="Student booking requests will appear here when submitted." />}
  </SectionCard>;
}

function AppointmentsPage({ data, commit }) {
  const [filter, setFilter] = useState("All sessions");
  const items = filter === "All sessions" ? data.appointments : data.appointments.filter((item) => item.status === filter);
  const complete = (id) => commit((state) => ({ ...state, appointments: state.appointments.map((item) => item.id === id ? { ...item, status: "Completed" } : item) }));
  const cancel = (id) => {
    respondToGuideBooking(id, "Cancelled");
    commit((state) => ({ ...state, appointments: state.appointments.filter((item) => item.slotId !== id && item.id !== id) }));
  };
  return <SectionCard title="All appointments" action={<select className="gp-compact-select" value={filter} onChange={(e) => setFilter(e.target.value)}><option>All sessions</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option></select>}>
    {items.length ? <div className="gp-appointment-list">{items.map((item) => <article className="gp-appointment-card" key={item.id}><AppointmentRow item={item} /><p className="gp-appointment-topic">{item.topic}</p><div className="gp-appointment-footer"><span className={`gp-status-pill status-${item.status.toLowerCase()}`}>{item.status}</span><span className="gp-appointment-career">{item.careerPath}</span>{item.status === "Confirmed" && <div className="gp-inline-actions"><button className="gp-button gp-button-small gp-button-secondary" type="button" onClick={() => cancel(item.id)}>Cancel session</button><button className="gp-button gp-button-small gp-button-primary" type="button" onClick={() => complete(item.id)}>Mark complete</button></div>}</div></article>)}</div> : <EmptyState title="No appointments in this view" body="Confirmed and completed appointments will be listed here." />}
  </SectionCard>;
}

function StudentsPage({ data }) {
  const [query, setQuery] = useState("");
  const students = data.students.filter((student) => `${student.name} ${student.careerPath}`.toLowerCase().includes(query.toLowerCase()));
  return <SectionCard title="Students you have guided" action={<input className="gp-compact-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search students" aria-label="Search students" />}>
    {students.length ? <div className="gp-table-wrap"><table className="gp-table gp-students-table"><thead><tr><th>Student</th><th>Career interest</th><th>Sessions</th><th>Last session</th><th>Relationship</th></tr></thead><tbody>{students.map((student) => <tr key={student.id}><td><span className="gp-student-cell"><span className="gp-avatar gp-avatar-small">{student.name.split(" ").map((part) => part[0]).join("")}</span><strong>{student.name}</strong></span></td><td>{student.careerPath}</td><td>{student.sessions}</td><td>{formatDate(student.lastSession)}</td><td><span className="gp-student-status">Active</span></td></tr>)}</tbody></table></div> : <EmptyState title="No students found" body="Students you have guided will appear here." />}
  </SectionCard>;
}

function NotificationsPage({ data, commit }) {
  const markAll = () => commit((state) => ({ ...state, notifications: state.notifications.map((item) => ({ ...item, read: true })) }));
  const markRead = (id) => commit((state) => ({ ...state, notifications: state.notifications.map((item) => item.id === id ? { ...item, read: true } : item) }));
  return <SectionCard title="Your notifications" action={data.notifications.some((item) => !item.read) && <button className="gp-text-button" type="button" onClick={markAll}>Mark all as read</button>}>
    {data.notifications.length ? <div className="gp-notification-list">{data.notifications.map((item) => <article className={`gp-notification ${item.read ? "is-read" : ""}`} key={item.id}><span className="gp-notification-icon"><Icon name={item.title.includes("request") ? "inbox" : item.title.includes("Session") ? "check" : "user"} size={18} /></span><div><strong>{item.title}</strong><p>{item.body}</p><time>{formatDate(item.date)}</time></div>{!item.read && <button className="gp-text-button" type="button" onClick={() => markRead(item.id)}>Mark read</button>}</article>)}</div> : <EmptyState title="You are all caught up" body="New guide activity will appear here." />}
  </SectionCard>;
}

function SettingsPage() {
  const reset = () => {
    if (!window.confirm("Reset the guide preview to its original sample data?")) return;
    const next = resetGuidePortalPreview();
    saveGuidePortalState(next);
    window.location.assign("/guide/dashboard");
  };
  return <div className="gp-settings-layout"><SectionCard title="Development preview"><div className="gp-settings-row"><div><strong>Local preview data</strong><p>Guide profile, expertise, schedule, requests, and sample activity are stored in this browser only.</p></div><span className="gp-preview-pill"><span className="gp-status-dot" /> Enabled</span></div><div className="gp-settings-row"><div><strong>Authentication integration</strong><p>No guide identity or production access control is simulated here. Shared authentication can be connected later through the guide API boundary.</p></div><span className="gp-status-pill status-pending">Not connected</span></div></SectionCard><SectionCard title="Reset preview data"><p className="gp-section-intro">Reset this browser's guide preview changes to the original sample profile and activity.</p><button className="gp-button gp-button-danger" type="button" onClick={reset}>Reset sample data</button></SectionCard></div>;
}
