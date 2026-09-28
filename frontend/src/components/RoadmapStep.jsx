function RoadmapStep({ step }) {
  if (!step) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-200 border border-transparent hover:border-blue-100">
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Step Number */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {step.number}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3 className="text-xl font-bold text-gray-900">
              {step.title}
            </h3>

            {step.duration && (
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full self-start md:self-auto">
                {step.duration}
              </span>
            )}
          </div>

          <p className="text-gray-600 mt-3 leading-relaxed">
            {step.description}
          </p>

          {/* Optional Topics or Key Concepts */}
          {step.topics && step.topics.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              {step.topics.map((topic, index) => (
                <span
                  key={index}
                  className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoadmapStep;
