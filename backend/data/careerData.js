/**
 * careerData.js
 * ==============
 * This file contains sample/static career data used for recommendations.
 * Each career has a title, category, work area, related skills,
 * accepted education levels, a description, and average salary range.
 *
 * In the future, this data can be moved to a database (e.g., MongoDB).
 *
 * Author: Thimira (Student Profile & Career Recommendation Module)
 */

const careerData = [
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

// Export the career data so other files can use it
module.exports = careerData;
