import React from "react";

function SkillList({ skills = [] }) {
  if (!skills || skills.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">No specific skills listed.</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      {skills.map((skill, index) => {
        const skillName = typeof skill === "string" ? skill : skill.name || skill.title;
        const category = typeof skill === "object" ? skill.category : null;

        return (
          <span
            key={`${skillName}-${index}`}
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50/60 hover:from-blue-100 hover:to-indigo-100 text-blue-800 border border-blue-200/80 rounded-full font-medium text-sm transition-all duration-200 ease-out hover:shadow-sm hover:-translate-y-0.5 cursor-default"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-125 transition-transform duration-200" />
            <span>{skillName}</span>
            {category && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-blue-200/60 text-blue-900 rounded-full">
                {category}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default SkillList;