const STORAGE_KEY = "csc3213_guide_portal_preview_v1";

export const CAREER_PATH_OPTIONS = [
  "Software Engineer",
  "Data Scientist",
  "Cybersecurity Analyst",
  "Cloud Engineer",
  "AI/ML Engineer",
  "Web Developer",
  "DevOps Engineer",
  "Database Administrator",
];

const previewState = {
  profile: {
    guideType: "Industry Professional",
    fullName: "Guide Preview",
    professionalTitle: "Senior Software Engineer",
    bio: "I help students turn strong technical foundations into confident, job-ready practice through project reviews, career planning, and interview preparation.",
    email: "guide.preview@campus.lk",
    phone: "",
    languages: "English, Sinhala",
    qualifications: "BSc in Computer Science",
    experience: "8 years",
    professionalLinks: "",
    university: "",
    faculty: "",
    department: "",
    researchInterests: "",
    teachingExperience: "",
    organization: "Technology Company",
    industry: "Software & Technology",
    certifications: "",
  },
  expertise: [
    { id: "exp-1", careerPath: "Software Engineer", area: "System design and architecture", level: "Advanced", description: "Designing scalable applications and APIs." },
    { id: "exp-2", careerPath: "Web Developer", area: "Full-stack web development", level: "Expert", description: "Modern React interfaces and Node.js services." },
    { id: "exp-3", careerPath: "Software Engineer", area: "Technical interviews", level: "Advanced", description: "Problem solving, communication, and interview practice." },
  ],
  availability: {
    weeklyDays: ["Monday", "Wednesday", "Friday"],
    defaultDuration: 45,
    breaks: "12:00 PM – 1:00 PM",
    unavailableDates: "",
    slots: [
      { id: "slot-a", date: "2026-11-18", start: "10:00", duration: 45, status: "Available" },
      { id: "slot-b", date: "2026-11-19", start: "14:00", duration: 45, status: "Available" },
      { id: "slot-c", date: "2026-11-20", start: "09:30", duration: 45, status: "Booked" },
    ],
  },
  bookingApprovalMode: "manual",
  requests: [
    { id: "req-1", studentName: "Nethmi Perera", careerPath: "Software Engineer", requestedAt: "2026-11-14", slotId: "slot-a", message: "I would appreciate feedback on my portfolio and junior developer applications.", status: "Pending" },
    { id: "req-2", studentName: "Kavindu Silva", careerPath: "Web Developer", requestedAt: "2026-11-13", slotId: "slot-b", message: "Could we discuss a good structure for my final-year web project?", status: "Pending" },
    { id: "req-3", studentName: "Amaya Fernando", careerPath: "Software Engineer", requestedAt: "2026-11-12", slotId: "slot-c", message: "I want to prepare for a technical interview.", status: "Accepted" },
  ],
  appointments: [
    { id: "apt-1", studentName: "Amaya Fernando", careerPath: "Software Engineer", date: "2026-11-20", time: "09:30", duration: 45, status: "Confirmed", topic: "Technical interview preparation" },
    { id: "apt-2", studentName: "Dilshan Jayawardena", careerPath: "Web Developer", date: "2026-11-09", time: "11:00", duration: 45, status: "Completed", topic: "Portfolio review" },
  ],
  students: [
    { id: "stu-1", name: "Amaya Fernando", careerPath: "Software Engineer", sessions: 3, lastSession: "2026-11-10" },
    { id: "stu-2", name: "Dilshan Jayawardena", careerPath: "Web Developer", sessions: 2, lastSession: "2026-11-09" },
    { id: "stu-3", name: "Nethmi Perera", careerPath: "Software Engineer", sessions: 1, lastSession: "2026-11-07" },
  ],
  notifications: [
    { id: "note-1", title: "New booking request", body: "Nethmi Perera requested a Software Engineer guidance session.", date: "2026-11-14", read: false },
    { id: "note-2", title: "Profile preview is ready", body: "Your profile preview is available to review and edit.", date: "2026-11-13", read: false },
    { id: "note-3", title: "Session completed", body: "Your recent portfolio review has been marked complete.", date: "2026-11-09", read: true },
  ],
};

const clone = (value) => JSON.parse(JSON.stringify(value));

// Development-only repository. Replace this adapter with authenticated API calls
// after the shared user/session contract and backend endpoints are agreed.
export function loadGuidePortalState() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(previewState));
      return clone(previewState);
    }
    return { ...clone(previewState), ...JSON.parse(stored) };
  } catch {
    return clone(previewState);
  }
}

export function saveGuidePortalState(nextState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    return { ok: true };
  } catch {
    return { ok: false, message: "Changes could not be saved in this browser." };
  }
}

export function resetGuidePortalPreview() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // A browser with storage disabled will continue using the in-memory preview.
  }
  return clone(previewState);
}
