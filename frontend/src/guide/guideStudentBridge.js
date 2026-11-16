import { getMentorById, getStoredMentors, updateSlotBookingStatus, upsertMentor } from "../services/bookingService";

export const GUIDE_MENTOR_ID = "guide-preview-1";

const toDisplayTime = (value = "09:00") => {
  const [hours, minutes] = value.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${String(hours % 12 || 12).padStart(2, "0")}:${String(minutes || 0).padStart(2, "0")} ${suffix}`;
};

const addMinutes = (value = "09:00", duration = 45) => {
  const [hours, minutes] = value.split(":").map(Number);
  const total = hours * 60 + minutes + Number(duration || 45);
  return toDisplayTime(`${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`);
};

const formattedDate = (date) => {
  if (!date) return "Date to be confirmed";
  return new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T00:00:00`));
};

export function syncGuideToStudent(state) {
  const existing = getMentorById(GUIDE_MENTOR_ID);
  const profile = state.profile;
  const guideSlots = state.availability.slots.map((slot) => {
    const previous = existing?.slots.find((item) => item.id === slot.id);
    const isBooked = Boolean(previous?.isBooked && previous.bookedBy);
    return {
      id: slot.id,
      date: formattedDate(slot.date),
      dateCode: slot.date,
      startTime: toDisplayTime(slot.start),
      endTime: addMinutes(slot.start, slot.duration),
      mode: "Online guidance",
      location: "Online meeting details shared after booking",
      isBooked,
      bookedBy: isBooked ? previous.bookedBy : null,
    };
  });
  upsertMentor({
    id: GUIDE_MENTOR_ID,
    name: profile.fullName || "Guide",
    title: profile.professionalTitle || profile.guideType || "Career Guide",
    department: profile.department || profile.industry || profile.organization || "Career Guidance",
    institution: profile.university || profile.organization || "Pathfinder Guide Network",
    avatarInitials: (profile.fullName || "G").split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase(),
    avatarUrl: profile.profilePhoto || "",
    avatarColor: "from-blue-600 to-indigo-700",
    rating: 5,
    totalSessions: 0,
    careerPaths: [...new Set(state.expertise.map((item) => item.careerPath).filter(Boolean))],
    bio: profile.bio || "Career guidance sessions with an experienced professional.",
    specialties: state.expertise.map((item) => item.area).filter(Boolean),
    slots: guideSlots,
  });
}

export function hydrateGuideFromStudent(state) {
  const mentor = getMentorById(GUIDE_MENTOR_ID);
  if (!mentor) return state;
  const slots = mentor.slots.map((slot) => {
    const previous = state.availability.slots.find((item) => item.id === slot.id);
    return {
      ...(previous || {}),
      id: slot.id,
      date: slot.dateCode,
      start: previous?.start || "09:00",
      duration: previous?.duration || state.availability.defaultDuration || 45,
      status: slot.isBooked ? (slot.bookedBy?.status === "Pending" ? "Pending" : "Booked") : "Available",
      booking: slot.bookedBy || null,
    };
  });
  const requests = [];
  const appointments = [];
  mentor.slots.forEach((slot) => {
    if (!slot.isBooked || !slot.bookedBy) return;
    const booking = slot.bookedBy;
    const status = booking.status || "Confirmed";
    const careerPath = state.expertise.find((item) => item.careerPath)?.careerPath || "Career guidance";
    const entry = {
      id: slot.id,
      slotId: slot.id,
      studentName: booking.studentName || "Student",
      studentEmail: booking.studentEmail || "",
      careerPath,
      requestedAt: booking.bookedAt?.slice(0, 10) || "",
      message: booking.notes || "The student has not added a session note.",
      status: status === "Pending" ? "Pending" : status === "Confirmed" ? "Accepted" : status,
    };
    if (status === "Pending" || status === "Confirmed") {
      requests.push(entry);
      if (status === "Confirmed") appointments.push({
        ...entry,
        date: slot.dateCode,
        time: slot.startTime,
        duration: 45,
        topic: entry.message,
        status: "Confirmed",
      });
    }
  });
  return {
    ...state,
    availability: { ...state.availability, slots },
    requests,
    appointments: [
      ...appointments,
      ...state.appointments.filter((item) => item.status === "Completed"),
    ],
    students: [
      ...new Map([...state.students, ...appointments.map((item) => ({ id: item.studentEmail || item.studentName, name: item.studentName, careerPath: item.careerPath, sessions: 1, lastSession: item.date }))].map((item) => [item.id, item])).values(),
    ],
    notifications: [
      ...requests.filter((item) => item.status === "Pending").map((item) => ({ id: `booking-${item.id}`, title: "New booking request", body: `${item.studentName} requested a ${item.careerPath} guidance session.`, date: item.requestedAt, read: Boolean(state.notifications.find((notification) => notification.id === `booking-${item.id}`)?.read) })),
      ...state.notifications.filter((item) => !item.title.includes("request")),
    ],
  };
}

export function respondToGuideBooking(slotId, status) {
  return updateSlotBookingStatus(GUIDE_MENTOR_ID, slotId, status);
}

export function guideBookingExists(slotId) {
  return Boolean(getStoredMentors().find((mentor) => mentor.id === GUIDE_MENTOR_ID)?.slots.find((slot) => slot.id === slotId)?.bookedBy);
}
