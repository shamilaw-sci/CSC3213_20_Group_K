import React, { useState, useEffect } from "react";
import { bookSlot, getSavedStudentProfile } from "../services/bookingService";
import "./MentorBooking.css";

function MentorProfileModal({ mentor, onClose, onBookingCompleted }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Student form fields
  const savedProfile = getSavedStudentProfile();
  const [formData, setFormData] = useState({
    studentName: savedProfile?.name || "",
    studentEmail: savedProfile?.email || "",
    studentId: savedProfile?.id || "",
    notes: "",
  });

  // Reset states when mentor changes
  useEffect(() => {
    setSelectedSlot(null);
    setBookingSuccess(null);
    setErrorMessage("");
  }, [mentor]);

  if (!mentor) return null;

  const handleSlotSelect = (slot) => {
    if (slot.isBooked) return;
    setSelectedSlot(slot);
    setErrorMessage("");
    setBookingSuccess(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!selectedSlot) return;

    if (!formData.studentName.trim() || !formData.studentEmail.trim()) {
      setErrorMessage("Please enter both your name and campus email.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const result = bookSlot(mentor.id, selectedSlot.id, formData);

      if (result.success) {
        setBookingSuccess({
          reference: result.bookingReference,
          mentorName: mentor.name,
          slot: result.slot,
          status: result.status,
        });
        setSelectedSlot(null);
        if (onBookingCompleted) {
          onBookingCompleted(result);
        }
      } else {
        setErrorMessage(result.message || "Could not complete booking.");
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred while booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 mentor-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-mentor-name"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 mentor-modal-shell">
        {/* Modal Top Header Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-6 sm:p-8 mentor-modal-header">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            aria-label="Close modal"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div
              className={`w-18 h-18 rounded-2xl bg-gradient-to-br ${
                mentor.avatarColor || "from-blue-600 to-indigo-700"
              } text-white flex items-center justify-center font-bold text-2xl shadow-lg border-2 border-white/20 flex-shrink-0`}
            >
              {mentor.avatarUrl ? <img src={mentor.avatarUrl} alt="" className="w-full h-full object-cover rounded-2xl" /> : mentor.avatarInitials || mentor.name.slice(0, 2).toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Career Guidance Mentor
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {mentor.rating || "4.9"} rating
                </span>
              </div>

              <h3
                id="modal-mentor-name"
                className="text-2xl sm:text-3xl font-extrabold text-white mt-1"
              >
                {mentor.name}
              </h3>

              <p className="text-blue-300 font-medium text-sm">
                {mentor.title}
              </p>

              <p className="text-xs text-slate-300 mt-1">
                {mentor.department} • {mentor.institution}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-8 mentor-modal-body">
          {/* Success Banner if Booked */}
          {bookingSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-emerald-950 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-lg text-emerald-900 leading-tight">
                    {bookingSuccess.status === "Pending" ? "Booking Request Sent" : "Guidance Slot Confirmed!"}
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Booking Reference: <span className="font-mono font-bold">{bookingSuccess.reference}</span>
                  </p>
                </div>
              </div>

              <div className="bg-white/80 rounded-xl p-4 border border-emerald-200/80 text-sm space-y-1.5 text-slate-700">
                <p>
                  <strong>Mentor:</strong> {bookingSuccess.mentorName}
                </p>
                <p>
                  <strong>Date & Time:</strong> {bookingSuccess.slot.date} at {bookingSuccess.slot.startTime} - {bookingSuccess.slot.endTime}
                </p>
                <p>
                  <strong>Location:</strong> {bookingSuccess.slot.location} ({bookingSuccess.slot.mode})
                </p>
              </div>

              <p className="text-xs text-emerald-700">
                {bookingSuccess.status === "Pending"
                  ? <>Your request is waiting for the guide to respond. This slot is reserved and unavailable to other students in the meantime.</>
                  : <>Your appointment is confirmed. This slot is unavailable to other students.</>}
              </p>
            </div>
          )}

          {/* Section 1: Brief Bio & Guidance Background */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Mentor Profile & Background
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {mentor.bio}
            </p>

            <div className="mt-4">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Specialized Advice Topics
              </h5>
              <div className="flex flex-wrap gap-2">
                {mentor.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Availability Slots Schedule */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-3 mentor-slots-heading">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Select an Available Guidance Slot
                </h4>
                <p className="text-xs text-slate-500">
                  Choose a free session slot below. Slots booked by other students will show as unavailable.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-medium mentor-slots-legend">
                <span className="inline-flex items-center gap-1 text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Available
                </span>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  Not Available
                </span>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mentor-slot-grid">
              {mentor.slots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                const isBooked = slot.isBooked;

                return (
                  <div
                    key={slot.id}
                    onClick={() => !isBooked && handleSlotSelect(slot)}
                    onKeyDown={(event) => {
                      if (!isBooked && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        handleSlotSelect(slot);
                      }
                    }}
                    role="button"
                    tabIndex={isBooked ? -1 : 0}
                    aria-pressed={isSelected}
                    aria-disabled={isBooked}
                    className={`rounded-2xl p-4 border transition-all text-left flex flex-col justify-between mentor-slot-card ${
                      isBooked
                        ? "is-booked"
                        : isSelected
                        ? "is-selected"
                        : "is-available"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2 mentor-slot-heading">
                        <span className="text-xs font-bold text-slate-800 mentor-slot-date">
                          {slot.date}
                        </span>

                        {isBooked ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 border border-slate-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Not Available
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            Available
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900 mentor-slot-time">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-600"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{slot.startTime} - {slot.endTime}</span>
                      </div>

                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 mentor-slot-location">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{slot.location}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs mentor-slot-meta">
                      <span className="font-semibold text-slate-500">
                        {slot.mode}
                      </span>

                      {!isBooked && (
                        <span
                          className={`font-bold ${
                            isSelected ? "text-blue-700" : "text-blue-600"
                          }`}
                        >
                          {isSelected ? "Selected ✓" : "Click to select"}
                        </span>
                      )}

                      {isBooked && (
                        <span className="text-[11px] font-medium text-slate-400 italic">
                          Booked by student
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Booking Form when Slot is Selected */}
          {selectedSlot && !bookingSuccess && (
            <div className="bg-slate-50 border border-blue-200 rounded-2xl p-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Confirm Guidance Slot Reservation
                  </h4>
                  <p className="text-xs text-slate-500">
                    Reserving: <strong>{selectedSlot.date}</strong> at <strong>{selectedSlot.startTime}</strong> ({selectedSlot.mode})
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedSlot(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
                >
                  Change Slot
                </button>
              </div>

              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      required
                      placeholder="e.g. Kasun Silva"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Campus Email Address *
                    </label>
                    <input
                      type="email"
                      name="studentEmail"
                      required
                      placeholder="e.g. student@campus.lk"
                      value={formData.studentEmail}
                      onChange={handleInputChange}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Student Registration ID (Optional)
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      placeholder="e.g. SC/2021/1190"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Session Goal / Questions
                    </label>
                    <input
                      type="text"
                      name="notes"
                      placeholder="e.g. Feedback on career switch to Software Eng."
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedSlot(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "Locking Slot..." : "Confirm & Book Slot"}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 mentor-modal-footer">
          <span>CSC3213 Academic Guidance Network</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default MentorProfileModal;
