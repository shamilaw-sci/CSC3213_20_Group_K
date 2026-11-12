import { Link } from "react-router-dom";
import LearningPathCard from "../components/LearningPathCard";
import RoadmapStep from "../components/RoadmapStep";
import "./LearningPath.css";

function LearningPath() {
  const steps = [
    {
      number: 1,
      title: "Learn Programming Fundamentals",
      description:
        "Learn variables, data types, conditions, loops, functions, and basic problem solving.",
      duration: "4 Weeks",
      topics: ["Variables & Types", "Control Flow", "Functions", "Problem Solving"],
    },
    {
      number: 2,
      title: "Learn HTML, CSS & JavaScript",
      description:
        "Build a strong foundation in web development and learn how modern websites work.",
      duration: "6 Weeks",
      topics: ["HTML5 Semantics", "Modern CSS & Flex/Grid", "DOM Manipulation", "ES6+ JS"],
    },
    {
      number: 3,
      title: "Learn React",
      description:
        "Learn components, props, state, hooks, routing, and how to build React applications.",
      duration: "6 Weeks",
      topics: ["JSX", "Components & Props", "Hooks (useState, useEffect)", "React Router"],
    },
    {
      number: 4,
      title: "Learn Backend Development",
      description:
        "Learn Node.js, Express.js, REST APIs, authentication, and server-side development.",
      duration: "6 Weeks",
      topics: ["Node.js Basics", "Express.js Routing", "RESTful APIs", "JWT Auth"],
    },
    {
      number: 5,
      title: "Learn Databases",
      description:
        "Understand database concepts and learn how to store, retrieve, and manage application data.",
      duration: "4 Weeks",
      topics: ["SQL & Relational DBs", "MongoDB / NoSQL", "CRUD Operations", "Data Modeling"],
    },
    {
      number: 6,
      title: "Build Real Projects",
      description:
        "Create practical projects and use Git and GitHub to manage and showcase your work.",
      duration: "8 Weeks",
      topics: ["Full-Stack App", "Git & GitHub Workflow", "Deployment", "Portfolio Building"],
    },
  ];

  return (
    <div className="min-h-screen bg-transparent py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Back navigation & Page Header */}
        <div className="mb-6">
          <Link
            to="/career"
            className="lp-back-link mb-4"
          >
            <span className="lp-back-icon" aria-hidden="true">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
            </span>
            <span>Back to Career Details</span>
          </Link>

          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
            Career Guidance
          </p>

          <h1 className="lp-page-heading mt-2">
            Learning Path
          </h1>

          <p className="text-gray-600 mt-2">
            Follow this step-by-step roadmap to develop the skills needed to become a Software Engineer.
          </p>
        </div>

        {/* Reusable Career Summary Card */}
        <LearningPathCard
          careerTitle="Software Engineer"
          duration="34 Weeks"
          totalSteps={steps.length}
          description="A structured step-by-step roadmap designed to take you from core programming concepts to production-grade full-stack engineering."
        />

        {/* Roadmap Steps */}
        <div className="space-y-5">
          {steps.map((step) => (
            <RoadmapStep key={step.number} step={step} />
          ))}
        </div>

        {/* Bottom Message & Action Card */}
        <div className="bg-blue-600 rounded-2xl p-8 mt-10 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">
              Ready to start your journey?
            </h3>

            <p className="mt-2 text-blue-100 max-w-xl text-sm leading-relaxed">
              Follow each milestone, practice regularly, and build portfolio projects to strengthen your skills. You can also view your comprehensive career report.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link
              to="/career-report"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-5 py-2.5 rounded-lg transition shadow-sm text-sm"
            >
              View Career Report
            </Link>
            <Link
              to="/career"
              className="app-link-button"
            >
              <span>Career Overview</span>
              <span className="app-link-arrow" aria-hidden="true">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LearningPath;
