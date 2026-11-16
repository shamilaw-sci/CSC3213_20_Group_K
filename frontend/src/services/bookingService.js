import { INITIAL_MENTORS_DATA } from "../data/mentorBookingData";

const STORAGE_KEY = "csc3213_mentors_data_v1";
const STUDENT_KEY = "csc3213_student_profile_v1";

// Custom event name for multi-component reactive sync
export const BOOKING_UPDATE_EVENT = "csc3213_booking_updated";

/**
 * Helper to retrieve stored mentors with fallbacks
 */
export const getStoredMentors = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MENTORS_DATA));
      return INITIAL_MENTORS_DATA;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read mentors from localStorage:", err);
    return INITIAL_MENTORS_DATA;
  }
};

/**
 * Helper to persist mentors to storage and notify listeners
 */
export const saveMentors = (mentors) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mentors));
    window.dispatchEvent(new CustomEvent(BOOKING_UPDATE_EVENT, { detail: { timestamp: Date.now() } }));
  } catch (err) {
    console.error("Failed to save mentors to localStorage:", err);
  }
};

export const updateSlotBookingStatus = (mentorId, slotId, status) => {
  const mentors = getStoredMentors();
  const mentor = mentors.find((item) => item.id === mentorId);
  const slot = mentor?.slots.find((item) => item.id === slotId);
  if (!slot?.bookedBy) return { success: false, message: "Booking not found." };
  if (status === "Cancelled" || status === "Rejected") {
    slot.isBooked = false;
    slot.bookedBy = null;
  } else {
    slot.bookedBy.status = status;
    slot.isBooked = true;
  }
  saveMentors(mentors);
  return { success: true, slot };
};

export const upsertMentor = (mentorRecord) => {
  const mentors = getStoredMentors();
  const index = mentors.findIndex((item) => item.id === mentorRecord.id);
  if (index < 0) mentors.push(mentorRecord);
  else mentors[index] = mentorRecord;
  saveMentors(mentors);
  return mentorRecord;
};

/**
 * Get mentors filtered by career path
 */
export const getMentorsByCareer = (careerTitle) => {
  const mentors = getStoredMentors();
  if (!careerTitle || careerTitle === "All") return mentors;

  return mentors.filter((m) =>
    m.careerPaths.some(
      (cp) => cp.toLowerCase().trim() === careerTitle.toLowerCase().trim()
    )
  );
};

/**
 * Get single mentor by ID
 */
export const getMentorById = (mentorId) => {
  const mentors = getStoredMentors();
  return mentors.find((m) => m.id === mentorId) || null;
};

/**
 * Book a guidance slot
 * @param {string} mentorId
 * @param {string} slotId
 * @param {{ studentName: string, studentEmail: string, studentId: string, notes: string }} studentDetails
 */
export const bookSlot = (mentorId, slotId, studentDetails) => {
  const mentors = getStoredMentors();
  const mentorIndex = mentors.findIndex((m) => m.id === mentorId);

  if (mentorIndex === -1) {
    return { success: false, message: "Mentor not found." };
  }

  const mentor = mentors[mentorIndex];
  const slotIndex = mentor.slots.findIndex((s) => s.id === slotId);

  if (slotIndex === -1) {
    return { success: false, message: "Guidance slot not found." };
  }

  const slot = mentor.slots[slotIndex];

  // Concurrency check: If already booked by another student
  if (slot.isBooked) {
    return {
      success: false,
      message: "This slot was just booked by another student. Please select another slot.",
    };
  }

  // Generate Booking Reference
  const bookingReference = `GUIDE-${Math.floor(100000 + Math.random() * 900000)}`;

  // Mark slot as booked
  slot.isBooked = true;
  let bookingApprovalMode = "automatic";
  if (mentorId === "guide-preview-1") {
    try {
      bookingApprovalMode = JSON.parse(localStorage.getItem("csc3213_guide_portal_preview_v1") || "{}").bookingApprovalMode || "manual";
    } catch {
      bookingApprovalMode = "manual";
    }
  }
  const status = bookingApprovalMode === "manual" ? "Pending" : "Confirmed";
  slot.bookedBy = {
    bookingReference,
    studentName: studentDetails.studentName.trim(),
    studentEmail: studentDetails.studentEmail.trim(),
    studentId: studentDetails.studentId ? studentDetails.studentId.trim() : "STU-REG",
    notes: studentDetails.notes ? studentDetails.notes.trim() : "",
    bookedAt: new Date().toISOString(),
    status,
  };

  mentors[mentorIndex].slots[slotIndex] = slot;
  saveMentors(mentors);

  // Remember student details for convenience
  try {
    localStorage.setItem(
      STUDENT_KEY,
      JSON.stringify({
        name: studentDetails.studentName,
        email: studentDetails.studentEmail,
        id: studentDetails.studentId,
      })
    );
  } catch {
    // ignore
  }

  return {
    success: true,
    bookingReference,
    mentorName: mentor.name,
    slot,
    status,
    message: status === "Pending" ? "Your request was sent to the guide for approval." : "Guidance session confirmed successfully!",
  };
};

/**
 * Cancel a booked slot and make it free/available again
 */
export const cancelBooking = (mentorId, slotId) => {
  const mentors = getStoredMentors();
  const mentorIndex = mentors.findIndex((m) => m.id === mentorId);

  if (mentorIndex === -1) {
    return { success: false, message: "Mentor not found." };
  }

  const mentor = mentors[mentorIndex];
  const slotIndex = mentor.slots.findIndex((s) => s.id === slotId);

  if (slotIndex === -1) {
    return { success: false, message: "Slot not found." };
  }

  const slot = mentor.slots[slotIndex];
  slot.isBooked = false;
  slot.bookedBy = null;

  mentors[mentorIndex].slots[slotIndex] = slot;
  saveMentors(mentors);

  return { success: true, message: "Booking cancelled. Slot is now available." };
};

/**
 * Get all active bookings for a student (or all bookings across system for demo)
 */
export const getStudentBookings = (studentEmail = null) => {
  const mentors = getStoredMentors();
  const bookings = [];

  mentors.forEach((mentor) => {
    mentor.slots.forEach((slot) => {
      if (slot.isBooked && slot.bookedBy) {
        if (!studentEmail || slot.bookedBy.studentEmail.toLowerCase() === studentEmail.toLowerCase()) {
          bookings.push({
            mentorId: mentor.id,
            mentorName: mentor.name,
            mentorTitle: mentor.title,
            mentorDepartment: mentor.department,
            slot,
          });
        }
      }
    });
  });

  return bookings;
};

/**
 * Saved student profile helper
 */
export const getSavedStudentProfile = () => {
  try {
    const raw = localStorage.getItem(STUDENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Future Lecturer Role: Add a new guidance slot
 */
export const addLecturerSlot = (mentorId, newSlotData) => {
  const mentors = getStoredMentors();
  const mentorIndex = mentors.findIndex((m) => m.id === mentorId);

  if (mentorIndex === -1) return { success: false, message: "Mentor not found." };

  const newSlot = {
    id: `slot-${Date.now()}`,
    date: newSlotData.date,
    dateCode: newSlotData.dateCode || new Date().toISOString().split("T")[0],
    startTime: newSlotData.startTime,
    endTime: newSlotData.endTime,
    mode: newSlotData.mode || "Zoom Meeting",
    location: newSlotData.location || "Online",
    isBooked: false,
    bookedBy: null,
  };

  mentors[mentorIndex].slots.push(newSlot);
  saveMentors(mentors);
  return { success: true, slot: newSlot };
};
