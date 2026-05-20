/**
 * recommendationApi.js
 * =====================
 * This file contains sample/static career data and a function
 * that simulates fetching career recommendations from a backend API.
 * 
 * In the future, you can replace the static data with real API calls.
 * 
 * Author: Thimira (Student Profile & Career Recommendation Module)
 */

// ─── Sample Career Data ────────────────────────────────────────
// Each career object has a title, a category (job type), a work area,
// related skills, education requirements, and a description.
const sampleCareers = [
  {
    id: 1,
    title: "Software Engineer",
    category: "Full-Time",
    workArea: "Technology",
    relatedSkills: ["JavaScript", "React", "Node.js", "Python", "Problem Solving"],
    educationLevels: ["Bachelor's Degree", "Master's Degree"],
    description: "Design, develop, and maintain software applications and systems.",
    averageSalary: "$95,000 - $140,000",
  },
  {
    id: 2,
    title: "Data Scientist",
    category: "Full-Time",
    workArea: "Technology",
    relatedSkills: ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization"],
    educationLevels: ["Bachelor's Degree", "Master's Degree", "PhD"],
    description: "Analyze complex data sets to identify trends and drive business decisions.",
    averageSalary: "$100,000 - $150,000",
  },
  {
    id: 3,
    title: "UX/UI Designer",
    category: "Full-Time",
    workArea: "Design",
    relatedSkills: ["Figma", "Adobe XD", "CSS", "User Research", "Prototyping"],
    educationLevels: ["Diploma", "Bachelor's Degree"],
    description: "Create intuitive and visually appealing user interfaces and experiences.",
    averageSalary: "$70,000 - $110,000",
  },
  {
    id: 4,
    title: "Digital Marketing Specialist",
    category: "Full-Time",
    workArea: "Marketing",
    relatedSkills: ["SEO", "Content Writing", "Social Media", "Google Analytics", "Email Marketing"],
    educationLevels: ["Diploma", "Bachelor's Degree"],
    description: "Plan and execute digital marketing campaigns to grow brand awareness.",
    averageSalary: "$50,000 - $80,000",
  },
  {
    id: 5,
    title: "Cybersecurity Analyst",
    category: "Full-Time",
    workArea: "Technology",
    relatedSkills: ["Network Security", "Ethical Hacking", "Firewalls", "Linux", "Risk Assessment"],
    educationLevels: ["Bachelor's Degree", "Master's Degree"],
    description: "Protect organizational systems and data from cyber threats and vulnerabilities.",
    averageSalary: "$85,000 - $130,000",
  },
  {
    id: 6,
    title: "Freelance Web Developer",
    category: "Freelance",
    workArea: "Technology",
    relatedSkills: ["HTML", "CSS", "JavaScript", "React", "WordPress"],
    educationLevels: ["Diploma", "Bachelor's Degree", "Self-Taught"],
    description: "Build websites and web applications for clients on a project basis.",
    averageSalary: "$40,000 - $100,000",
  },
  {
    id: 7,
    title: "Business Analyst",
    category: "Full-Time",
    workArea: "Business",
    relatedSkills: ["Data Analysis", "SQL", "Communication", "Problem Solving", "Excel"],
    educationLevels: ["Bachelor's Degree", "Master's Degree"],
    description: "Bridge the gap between IT and business by analyzing processes and requirements.",
    averageSalary: "$70,000 - $105,000",
  },
  {
    id: 8,
    title: "Graphic Designer",
    category: "Freelance",
    workArea: "Design",
    relatedSkills: ["Photoshop", "Illustrator", "Typography", "Branding", "Creativity"],
    educationLevels: ["Diploma", "Bachelor's Degree"],
    description: "Create visual content for branding, advertising, and digital media.",
    averageSalary: "$45,000 - $75,000",
  },
  {
    id: 9,
    title: "Cloud Solutions Architect",
    category: "Full-Time",
    workArea: "Technology",
    relatedSkills: ["AWS", "Azure", "Docker", "Kubernetes", "Networking"],
    educationLevels: ["Bachelor's Degree", "Master's Degree"],
    description: "Design and oversee cloud computing strategies and infrastructure for organizations.",
    averageSalary: "$120,000 - $170,000",
  },
  {
    id: 10,
    title: "Content Writer",
    category: "Part-Time",
    workArea: "Marketing",
    relatedSkills: ["Content Writing", "SEO", "Research", "Communication", "Creativity"],
    educationLevels: ["Diploma", "Bachelor's Degree", "Self-Taught"],
    description: "Produce engaging written content for blogs, websites, and social media platforms.",
    averageSalary: "$35,000 - $60,000",
  },
];


// ─── Recommendation Engine (Static / Simulated) ───────────────
/**
 * getRecommendations(profileData)
 * 
 * Takes the student's profile data and returns a list of recommended careers
 * with a match percentage and a reason for the recommendation.
 * 
 * @param {Object} profileData - The student's profile information
 * @param {string} profileData.name - Student's name
 * @param {string[]} profileData.skills - Array of skills the student has
 * @param {string[]} profileData.interests - Array of student's interests
 * @param {string} profileData.educationLevel - Student's current education level
 * @param {string} profileData.preferredJobType - Preferred job type (Full-Time, Part-Time, Freelance)
 * @param {string} profileData.preferredWorkArea - Preferred work area (Technology, Design, etc.)
 * 
 * @returns {Promise<Array>} Array of career recommendation objects
 */
export const getRecommendations = (profileData) => {
  // Simulate an API delay (like a real backend would have)
  return new Promise((resolve) => {
    setTimeout(() => {
      // Convert student skills and interests to lowercase for comparison
      const studentSkills = profileData.skills.map((s) => s.toLowerCase().trim());
      const studentInterests = profileData.interests.map((i) => i.toLowerCase().trim());

      // Score each career based on how well it matches the student's profile
      const scoredCareers = sampleCareers.map((career) => {
        let score = 0;          // Total match score
        let maxScore = 0;       // Maximum possible score
        const reasons = [];     // Reasons for recommending this career

        // ── 1. Skill Match (worth up to 40 points) ──
        maxScore += 40;
        const careerSkillsLower = career.relatedSkills.map((s) => s.toLowerCase());
        const matchedSkills = studentSkills.filter((skill) =>
          careerSkillsLower.some((cs) => cs.includes(skill) || skill.includes(cs))
        );
        const skillMatchRatio = matchedSkills.length / career.relatedSkills.length;
        score += Math.round(skillMatchRatio * 40);
        if (matchedSkills.length > 0) {
          reasons.push(`Your skills in ${matchedSkills.join(", ")} match this career`);
        }

        // ── 2. Interest Match (worth up to 25 points) ──
        maxScore += 25;
        const interestMatch = studentInterests.some(
          (interest) =>
            career.title.toLowerCase().includes(interest) ||
            career.workArea.toLowerCase().includes(interest) ||
            career.description.toLowerCase().includes(interest) ||
            career.relatedSkills.some((s) => s.toLowerCase().includes(interest))
        );
        if (interestMatch) {
          score += 25;
          reasons.push("Aligns with your interests");
        }

        // ── 3. Education Level Match (worth up to 15 points) ──
        maxScore += 15;
        if (career.educationLevels.includes(profileData.educationLevel)) {
          score += 15;
          reasons.push(`Suitable for your ${profileData.educationLevel} education`);
        }

        // ── 4. Job Type Match (worth up to 10 points) ──
        maxScore += 10;
        if (
          profileData.preferredJobType === "Any" ||
          career.category === profileData.preferredJobType
        ) {
          score += 10;
          reasons.push(`Matches your preferred ${career.category} job type`);
        }

        // ── 5. Work Area Match (worth up to 10 points) ──
        maxScore += 10;
        if (
          profileData.preferredWorkArea === "Any" ||
          career.workArea === profileData.preferredWorkArea
        ) {
          score += 10;
          reasons.push(`Falls within your preferred ${career.workArea} work area`);
        }

        // Calculate the match percentage
        const matchPercentage = Math.round((score / maxScore) * 100);

        // Build the recommendation reason string
        const reason =
          reasons.length > 0
            ? reasons.join(". ") + "."
            : "General career opportunity based on your profile.";

        return {
          ...career,
          matchPercentage,
          reason,
          matchedSkills,
        };
      });

      // Sort careers by match percentage (highest first) and return top results
      const sortedCareers = scoredCareers
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .filter((career) => career.matchPercentage > 0); // Only show careers with some match

      resolve(sortedCareers);
    }, 800); // 800ms simulated delay
  });
};
