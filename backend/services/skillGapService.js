
const REQUIRED_SKILLS = {
  "Software Engineer": ["JavaScript", "Python", "Git", "Data Structures", "Algorithms", "SQL", "Testing"],
  "Data Scientist": ["Python", "SQL", "Statistics", "Machine Learning", "Pandas", "Data Visualization"],
  "AI/ML Engineer": ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Data Structures"],
  "Cloud Engineer": ["Linux", "Networking", "AWS", "Docker", "Kubernetes", "Terraform"],
  "Cybersecurity Analyst": ["Networking", "Linux", "Security Fundamentals", "Python", "SIEM", "Incident Response"],
  "Web Developer": ["HTML", "CSS", "JavaScript", "React", "Node.js", "Git", "REST APIs"],
  "DevOps Engineer": ["Linux", "Git", "Docker", "Kubernetes", "CI/CD", "AWS", "Terraform"],
  "Database Administrator": ["SQL", "Database Design", "MySQL", "PostgreSQL", "Backup and Recovery", "Performance Tuning"],
};

const CAREER_ALIASES = {
  "AI Engineer": "AI/ML Engineer",
  "Machine Learning Engineer": "AI/ML Engineer",
  "Cyber Security Analyst": "Cybersecurity Analyst",
  "Frontend Developer": "Web Developer",
  "Node.js Backend Developer": "Software Engineer",
  "Full Stack Engineer": "Software Engineer",
  "Cloud Backend Engineer": "Cloud Engineer",
};

const normalizeSkill = (skill) => skill.trim().toLowerCase();

const calculateSkillGap = (career, userSkills = []) => {
  const normalizedCareer = CAREER_ALIASES[career] || career;
  const requiredSkills = REQUIRED_SKILLS[normalizedCareer] || [];
  const currentSkills = Array.isArray(userSkills) ? userSkills.filter(Boolean) : [];
  const knownSkills = new Set(currentSkills.map(normalizeSkill));
  const missingSkills = requiredSkills.filter((skill) => !knownSkills.has(normalizeSkill(skill)));
  const readinessScore = requiredSkills.length
    ? Math.round(((requiredSkills.length - missingSkills.length) / requiredSkills.length) * 100)
    : 0;

  return {
    career: normalizedCareer,
    currentSkills,
    missingSkills,
    readinessScore,
    learningPriority: missingSkills,
  };
};

module.exports = {
  calculateSkillGap,
};
