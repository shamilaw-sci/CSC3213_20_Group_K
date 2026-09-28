const CANONICAL_CAREERS = [
  "Software Engineer",
  "Data Scientist",
  "Cybersecurity Analyst",
  "Cloud Engineer",
  "AI/ML Engineer",
  "Web Developer",
  "DevOps Engineer",
  "Database Administrator",
];

const ALIASES = {
  "AI Engineer": "AI/ML Engineer",
  "Machine Learning Engineer": "AI/ML Engineer",
  "Cyber Security Analyst": "Cybersecurity Analyst",
  "Frontend Developer": "Web Developer",
  "Node.js Backend Developer": "Software Engineer",
  "Full Stack Engineer": "Software Engineer",
  "Cloud Backend Engineer": "Cloud Engineer",
};

const normalizeCareer = (name) => {
  if (!name || typeof name !== "string") return null;
  const trimmed = name.trim();
  if (CANONICAL_CAREERS.includes(trimmed)) return trimmed;
  if (ALIASES[trimmed]) return ALIASES[trimmed];
  // try case-insensitive match
  const found = CANONICAL_CAREERS.find((c) => c.toLowerCase() === trimmed.toLowerCase());
  if (found) return found;
  // try alias case-insensitive
  const aliasKey = Object.keys(ALIASES).find((k) => k.toLowerCase() === trimmed.toLowerCase());
  if (aliasKey) return ALIASES[aliasKey];
  return null;
};

module.exports = {
  CANONICAL_CAREERS,
  normalizeCareer,
};
