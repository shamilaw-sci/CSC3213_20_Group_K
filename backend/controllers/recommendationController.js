/**
 * recommendationController.js
 * =============================
 * Contains the logic for generating career recommendations.
 * Uses simple rule-based matching to score each career
 * against the student's profile data.
 *
 * Scoring breakdown (100 points total):
 *   - Skill match:      40 points (how many of the student's skills match the career)
 *   - Interest match:   25 points (do the student's interests align with the career)
 *   - Education match:  15 points (does the student's education level fit)
 *   - Job type match:   10 points (does the preferred job type match)
 *   - Work area match:  10 points (does the preferred work area match)
 *
 * Author: Thimira (Student Profile & Career Recommendation Module)
 */

// Import the Career model from MongoDB
const Career = require("../models/Career");

/**
 * POST /api/recommendations
 *
 * Request body:
 *   {
 *     name: "Thimira",
 *     skills: ["JavaScript", "React", "Python"],
 *     interests: ["Web Development", "AI"],
 *     educationLevel: "Bachelor's Degree",
 *     preferredJobType: "Full-Time",
 *     preferredWorkArea: "Technology"
 *   }
 *
 * Response:
 *   {
 *     success: true,
 *     studentName: "Thimira",
 *     totalResults: 8,
 *     recommendations: [ ... ]
 *   }
 */
const getRecommendations = async (req, res) => {
  try {
    // ── Step 1: Extract the student's profile data from the request body ──
    const {
      name,
      skills,
      interests,
      educationLevel,
      preferredJobType,
      preferredWorkArea,
    } = req.body;

    // ── Step 2: Validate required fields ──
    if (!name || !skills || !interests || !educationLevel || !preferredJobType || !preferredWorkArea) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, skills, interests, educationLevel, preferredJobType, preferredWorkArea",
      });
    }

    // Make sure skills and interests are arrays
    if (!Array.isArray(skills) || !Array.isArray(interests)) {
      return res.status(400).json({
        success: false,
        message: "Skills and interests must be arrays",
      });
    }

    // ── Step 3: Fetch all careers from MongoDB ──
    // Changed from static careerData to querying the database
    const careerData = await Career.find({});

    if (careerData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No careers found in database. Please run the migration: npm run migrate:careers",
      });
    }

    // ── Step 4: Convert student skills & interests to lowercase for comparison ──
    const studentSkills = skills.map((s) => s.toLowerCase().trim());
    const studentInterests = interests.map((i) => i.toLowerCase().trim());

    // ── Step 5: Score each career against the student's profile ──
    const scoredCareers = careerData.map((career) => {
      let score = 0;        // Total match score (out of 100)
      let maxScore = 0;     // Maximum possible score
      const reasons = [];   // Array of reasons why this career was recommended

      // ──── 5a. Skill Match (up to 40 points) ────
      // Compare student's skills with the career's required skills
      maxScore += 40;
      const careerSkillsLower = career.relatedSkills.map((s) => s.toLowerCase());

      // Find which student skills match the career's required skills
      const matchedSkills = studentSkills.filter((skill) =>
        careerSkillsLower.some(
          (careerSkill) => careerSkill.includes(skill) || skill.includes(careerSkill)
        )
      );

      // Calculate skill match ratio and add points
      const skillMatchRatio = matchedSkills.length / career.relatedSkills.length;
      score += Math.round(skillMatchRatio * 40);

      // Add reason if skills matched
      if (matchedSkills.length > 0) {
        reasons.push(
          `Your skills in ${matchedSkills.join(", ")} match this career`
        );
      }

      // ──── 5b. Interest Match (up to 25 points) ────
      // Check if any of the student's interests align with the career
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

      // ──── 5c. Education Level Match (up to 15 points) ────
      // Check if the student's education level is accepted by this career
      maxScore += 15;
      if (career.educationLevels.includes(educationLevel)) {
        score += 15;
        reasons.push(`Suitable for your ${educationLevel} education`);
      }

      // ──── 5d. Job Type Match (up to 10 points) ────
      // Check if the career type matches the student's preference
      maxScore += 10;
      if (preferredJobType === "Any" || career.category === preferredJobType) {
        score += 10;
        reasons.push(`Matches your preferred ${career.category} job type`);
      }

      // ──── 5e. Work Area Match (up to 10 points) ────
      // Check if the career's work area matches the student's preference
      maxScore += 10;
      if (preferredWorkArea === "Any" || career.workArea === preferredWorkArea) {
        score += 10;
        reasons.push(`Falls within your preferred ${career.workArea} work area`);
      }

      // ── Step 6: Calculate the final match percentage ──
      const matchPercentage = Math.round((score / maxScore) * 100);

      // Build the recommendation reason string
      const reason =
        reasons.length > 0
          ? reasons.join(". ") + "."
          : "General career opportunity based on your profile.";

      // Return the career with its match data
      return {
        _id: career._id,
        id: career._id.toString(),
        title: career.title,
        matchPercentage,
        reason,
        relatedSkills: career.relatedSkills,
        requiredSkills: career.relatedSkills,
        matchedSkills,
        category: career.category,
        workArea: career.workArea,
        description: career.description,
        averageSalary: career.averageSalary,
      };
    });

    // ── Step 7: Sort by match percentage (highest first) ──
    // Only include careers that have some match (> 0%)
    const recommendations = scoredCareers
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .filter((career) => career.matchPercentage > 0);

    // ── Step 8: Send the response ──
    console.log(`✅ Generated ${recommendations.length} recommendations for ${name}`);

    res.status(200).json({
      success: true,
      studentName: name,
      totalResults: recommendations.length,
      recommendations,
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("❌ Error generating recommendations:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while generating recommendations",
    });
  }
};

// Export the controller function
module.exports = { getRecommendations };
