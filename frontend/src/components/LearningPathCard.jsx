function LearningPathCard({
  careerTitle = "Software Engineer",
  duration = "34 Weeks",
  totalSteps = 6,
  description = "A structured roadmap designed to take you from foundational concepts to production-ready software development skills.",
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Target Career Roadmap
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            {careerTitle}
          </h2>

          <p className="text-gray-600 mt-2 max-w-2xl text-sm leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 px-5 py-4 rounded-xl flex-shrink-0">
          <div>
            <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide">
              Estimated Duration
            </p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">
              {duration}
            </p>
          </div>

          <div className="h-8 w-px bg-blue-200" />

          <div>
            <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide">
              Total Milestones
            </p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">
              {totalSteps} Steps
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningPathCard;
