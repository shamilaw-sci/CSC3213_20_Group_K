/**
 * migrate-career-data.js
 * ======================
 * Migration script to insert career data from static file into MongoDB.
 * Run this once with: npm run migrate:careers
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Career = require("../models/Career");

const careerDataStatic = [
  {
    title: "Software Engineer",
    category: "Full-Time",
    workArea: "Technology",
    relatedSkills: ["JavaScript", "React", "Node.js", "Python", "Problem Solving"],
    educationLevels: ["Bachelor's Degree", "Master's Degree"],
    description: "Design, develop, and maintain software applications and systems.",
    averageSalary: "$95,000 - $140,000",
  },
  {
    title: "Data Scientist",
    category: "Full-Time",
    workArea: "Technology",
    relatedSkills: ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization"],
    educationLevels: ["Bachelor's Degree", "Master's Degree", "PhD"],
    description: "Analyze complex data sets to identify trends and drive business decisions.",
    averageSalary: "$100,000 - $150,000",
  },
  {
    title: "UX/UI Designer",
    category: "Full-Time",
    workArea: "Design",
    relatedSkills: ["Figma", "Adobe XD", "CSS", "User Research", "Prototyping"],
    educationLevels: ["Diploma", "Bachelor's Degree"],
    description: "Create intuitive and visually appealing user interfaces and experiences.",
    averageSalary: "$70,000 - $110,000",
  },
  {
    title: "Digital Marketing Specialist",
    category: "Full-Time",
    workArea: "Marketing",
    relatedSkills: ["SEO", "Content Writing", "Social Media", "Google Analytics", "Email Marketing"],
    educationLevels: ["Diploma", "Bachelor's Degree"],
    description: "Plan and execute digital marketing campaigns to grow brand awareness.",
    averageSalary: "$50,000 - $80,000",
  },
  {
    title: "Cybersecurity Analyst",
    category: "Full-Time",
    workArea: "Technology",
    relatedSkills: ["Network Security", "Ethical Hacking", "Firewalls", "Linux", "Risk Assessment"],
    educationLevels: ["Bachelor's Degree", "Master's Degree"],
    description: "Protect organizational systems and data from cyber threats and vulnerabilities.",
    averageSalary: "$85,000 - $130,000",
  },
  {
    title: "Freelance Web Developer",
    category: "Freelance",
    workArea: "Technology",
    relatedSkills: ["HTML", "CSS", "JavaScript", "React", "WordPress"],
    educationLevels: ["Diploma", "Bachelor's Degree", "Self-Taught"],
    description: "Build websites and web applications for clients on a project basis.",
    averageSalary: "$40,000 - $100,000",
  },
  {
    title: "Business Analyst",
    category: "Full-Time",
    workArea: "Business",
    relatedSkills: ["Data Analysis", "SQL", "Communication", "Problem Solving", "Excel"],
    educationLevels: ["Bachelor's Degree", "Master's Degree"],
    description: "Bridge the gap between IT and business by analyzing processes and requirements.",
    averageSalary: "$70,000 - $105,000",
  },
  {
    title: "Graphic Designer",
    category: "Freelance",
    workArea: "Design",
    relatedSkills: ["Photoshop", "Illustrator", "Typography", "Branding", "Creativity"],
    educationLevels: ["Diploma", "Bachelor's Degree"],
    description: "Create visual content for branding, advertising, and digital media.",
    averageSalary: "$45,000 - $75,000",
  },
  {
    title: "Cloud Solutions Architect",
    category: "Full-Time",
    workArea: "Technology",
    relatedSkills: ["AWS", "Azure", "Docker", "Kubernetes", "Networking"],
    educationLevels: ["Bachelor's Degree", "Master's Degree"],
    description: "Design and oversee cloud computing strategies and infrastructure for organizations.",
    averageSalary: "$120,000 - $170,000",
  },
  {
    title: "Content Writer",
    category: "Part-Time",
    workArea: "Marketing",
    relatedSkills: ["Content Writing", "SEO", "Research", "Communication", "Creativity"],
    educationLevels: ["Diploma", "Bachelor's Degree", "Self-Taught"],
    description: "Produce engaging written content for blogs, websites, and social media platforms.",
    averageSalary: "$35,000 - $60,000",
  },
];

const migrateCareerData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected for migration");

    // Check if careers already exist
    const existingCount = await Career.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing careers. Clearing before migration...`);
      await Career.deleteMany({});
    }

    // Insert all career data
    const insertedCareers = await Career.insertMany(careerDataStatic);
    console.log(`✅ Successfully migrated ${insertedCareers.length} careers to MongoDB`);

    // Verify insertion
    const finalCount = await Career.countDocuments();
    console.log(`📊 Total careers in database: ${finalCount}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
};

migrateCareerData();
