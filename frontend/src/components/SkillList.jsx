function SkillList({ skills }) {
    return (
        <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
                <span
                    key={skill}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium text-sm"
                >
                    {skill}
                </span>
            ))}
        </div>
    );
}

export default SkillList;