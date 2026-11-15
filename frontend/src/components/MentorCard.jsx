import React from "react";

function MentorCard({ mentor, onSelectMentor }) {
  if (!mentor) return null;

  const availableSlotsCount = mentor.slots.filter((s) => !s.isBooked).length;
  const hasAvailableSlots = availableSlotsCount > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 p-6 flex flex-col justify-between">
      <div>
        {/* Mentor Header Profile */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mentor.avatarColor || "from-blue-600 to-indigo-700"} text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0`}
            aria-hidden="true"
          >
            {mentor.avatarUrl ? <img src={mentor.avatarUrl} alt="" className="w-full h-full object-cover rounded-2xl" /> : mentor.avatarInitials || mentor.name.slice(0, 2).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-slate-900 text-lg leading-snug truncate">
                {mentor.name}
              </h4>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {mentor.rating || "4.9"}
              </span>
            </div>

            <p className="text-sm font-medium text-blue-600 leading-tight mt-0.5">
              {mentor.title}
            </p>

            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              {mentor.department} • {mentor.institution}
            </p>
          </div>
        </div>

        {/* Bio Excerpt */}
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {mentor.bio}
        </p>

        {/* Focus Areas */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Guidance Specialties
          </p>
          <div className="flex flex-wrap gap-1.5">
            {mentor.specialties.slice(0, 3).map((spec, i) => (
              <span
                key={i}
                className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md"
              >
                {spec}
              </span>
            ))}
            {mentor.specialties.length > 3 && (
              <span className="text-xs text-slate-400 font-medium py-1 px-1">
                +{mentor.specialties.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer with Availability & Action */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              hasAvailableSlots
                ? "bg-emerald-500 animate-pulse"
                : "bg-slate-300"
            }`}
          />
          <span
            className={`text-xs font-semibold ${
              hasAvailableSlots ? "text-emerald-700" : "text-slate-500"
            }`}
          >
            {hasAvailableSlots
              ? `${availableSlotsCount} Free ${availableSlotsCount === 1 ? "Slot" : "Slots"}`
              : "No Slots Free"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelectMentor(mentor)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
            hasAvailableSlots
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <span>{hasAvailableSlots ? "Book Guidance" : "View Bio"}</span>
          <svg
            width="12"
            height="12"
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
    </div>
  );
}

export default MentorCard;
