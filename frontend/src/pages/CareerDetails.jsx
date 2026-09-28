import { Link } from "react-router-dom";
import SkillList from "../components/SkillList";

function CareerDetails() {
  const skills = [
    "JavaScript",
    "React",
    "Node.js",
    "Database",
    "Git & GitHub",
    "Problem Solving",
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
            Career Guidance
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mt-2">
            Career Details
          </h1>

          <p className="text-gray-600 mt-2">
            Explore career information, required skills, and opportunities.
          </p>
        </div>

        {/* Career Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* Career Title */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Software Engineer
            </h2>

            <p className="text-gray-600 mt-4 leading-relaxed">
              A Software Engineer designs, develops, tests, and maintains
              software applications. Software engineers use programming,
              problem-solving, and software development skills to create
              reliable and efficient software systems.
            </p>
          </div>

          {/* Career Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-gray-200">

            <div>
              <p className="text-sm text-gray-500">
                Job Type
              </p>

              <p className="font-semibold text-gray-900 mt-1">
                Full Time
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Experience Level
              </p>

              <p className="font-semibold text-gray-900 mt-1">
                Entry Level
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Work Area
              </p>

              <p className="font-semibold text-gray-900 mt-1">
                Software Development
              </p>
            </div>

          </div>

          {/* Required Skills */}
          <div className="pt-6">
            <h3 className="text-xl font-bold text-gray-900">
              Required Skills
            </h3>

            <p className="text-gray-600 mt-2 mb-4">
              Important skills for becoming a successful Software Engineer.
            </p>

            <SkillList skills={skills} />
          </div>

          {/* Navigation Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/learning-path"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-sm"
            >
              Start Learning Path &rarr;
            </Link>

            <Link
              to="/career-report"
              className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-lg border border-gray-300 transition"
            >
              View Career Report
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CareerDetails;