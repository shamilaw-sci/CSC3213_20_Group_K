import React, { useState, useEffect } from "react";
import { getStudentBookings, cancelBooking, getSavedStudentProfile } from "../services/bookingService";

function MyBookingsModal({ onClose, onBookingsChanged }) {
  const [bookings, setBookings] = useState([]);
  const [cancelMessage, setCancelMessage] = useState("");
  const savedProfile = getSavedStudentProfile();

  const loadBookings = () => {
    // If student has a saved email, filter by that email, or show all for convenience
    const allBookings = getStudentBookings(savedProfile?.email || null);
    setBookings(allBookings);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancelSlot = (mentorId, slotId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this guidance session? The slot will immediately become available for other students."
    );
    if (!confirmCancel) return;

    const res = cancelBooking(mentorId, slotId);
    if (res.success) {
      setCancelMessage("Booking cancelled successfully. Slot is now free.");
      loadBookings();
      if (onBookingsChanged) onBookingsChanged();
      setTimeout(() => setCancelMessage(""), 4000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                My Booked Guidance Sessions
              </h3>
              <p className="text-xs text-slate-400">
                Manage your confirmed appointments with faculty & industry mentors
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            aria-label="Close"
          >
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
          {cancelMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{cancelMessage}</span>
            </div>
          )}

          {bookings.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h4 className="text-slate-800 font-bold text-base">
                No Booked Sessions Found
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                You have not booked any guidance slots yet. Browse a career path and click "Book Guidance" on a mentor.
              </p>
            </div>
          ) : (
            bookings.map((item) => (
              <div
                key={item.slot.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Ref: {item.slot.bookedBy?.bookingReference || "GUIDE-CONFIRMED"}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {item.slot.mode}
                    </span>
                    {item.slot.bookedBy?.status === "Pending" && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Awaiting guide approval</span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    {item.mentorName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {item.mentorTitle}
                  </p>

                  <div className="pt-1 flex items-center gap-3 text-xs font-medium text-slate-700">
                    <span className="flex items-center gap-1 font-semibold text-blue-700">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {item.slot.date} • {item.slot.startTime} - {item.slot.endTime}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">{item.slot.location}</span>
                  </div>

                  {item.slot.bookedBy?.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-2 italic">
                      "{item.slot.bookedBy.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCancelSlot(item.mentorId, item.slot.id)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all"
                  >
                    Cancel Slot
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyBookingsModal;
