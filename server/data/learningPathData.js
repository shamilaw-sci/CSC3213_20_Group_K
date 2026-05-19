// ─────────────────────────────────────────────
// Learning Path Data
// This file holds static data for each career's learning path.
// Keys are lowercase career names so lookups are case-insensitive.
// ─────────────────────────────────────────────

const learningPaths = {

  "software engineer": {
    career: "Software Engineer",
    skills: [
      "JavaScript",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Git & GitHub",
      "REST APIs",
      "Problem Solving",
    ],
    courses: [
      "The Complete Web Development Bootcamp (Udemy)",
      "Data Structures & Algorithms (Coursera)",
      "CS50 – Introduction to Computer Science (Harvard)",
      "Full-Stack Open (University of Helsinki)",
      "System Design for Beginners",
    ],
    projects: [
      "Portfolio Website",
      "To-Do App with React",
      "Chat Application with Socket.io",
      "E-Commerce Store (MERN Stack)",
      "REST API with Authentication",
    ],
  },

  "data scientist": {
    career: "Data Scientist",
    skills: [
      "Python",
      "Pandas & NumPy",
      "Machine Learning",
      "Data Visualization (Matplotlib, Seaborn)",
      "SQL",
      "Statistics & Probability",
      "TensorFlow / Scikit-learn",
      "Jupyter Notebooks",
    ],
    courses: [
      "Python for Data Science (Coursera)",
      "Machine Learning by Andrew Ng (Coursera)",
      "Data Analysis with Pandas (Kaggle)",
      "Deep Learning Specialization (DeepLearning.AI)",
      "SQL for Data Science (Coursera)",
    ],
    projects: [
      "House Price Prediction (Linear Regression)",
      "Customer Churn Analysis",
      "Sentiment Analysis on Twitter Data",
      "COVID-19 Data Dashboard",
      "Image Classifier with TensorFlow",
    ],
  },

  "ui/ux designer": {
    career: "UI/UX Designer",
    skills: [
      "Figma",
      "Adobe XD",
      "Wireframing & Prototyping",
      "User Research",
      "Design Systems",
      "Typography & Color Theory",
      "Accessibility (WCAG)",
      "HTML & CSS Basics",
    ],
    courses: [
      "Google UX Design Certificate (Coursera)",
      "UI Design Fundamentals (Scrimba)",
      "Figma UI Design Tutorial (YouTube – freeCodeCamp)",
      "Interaction Design Foundation – UX Design",
      "Design Thinking (IDEO U)",
    ],
    projects: [
      "Mobile App UI Redesign",
      "E-Commerce Website Prototype",
      "Design System / Component Library",
      "User Research Case Study",
      "Dashboard UI for Analytics Tool",
    ],
  },

  "cyber security analyst": {
    career: "Cyber Security Analyst",
    skills: [
      "Networking Fundamentals (TCP/IP)",
      "Linux Command Line",
      "Ethical Hacking",
      "Firewalls & IDS/IPS",
      "Python for Security Scripting",
      "SIEM Tools (Splunk)",
      "Vulnerability Assessment",
      "Cryptography Basics",
    ],
    courses: [
      "Google Cybersecurity Certificate (Coursera)",
      "CompTIA Security+ Exam Prep",
      "Ethical Hacking Full Course (Udemy)",
      "TryHackMe – Cyber Security Labs",
      "Networking Basics (Cisco NetAcad)",
    ],
    projects: [
      "Home Lab with Virtual Machines",
      "Network Traffic Analyzer",
      "Capture The Flag (CTF) Writeups",
      "Password Manager CLI Tool",
      "Basic Intrusion Detection System",
    ],
  },

  "devops engineer": {
    career: "DevOps Engineer",
    skills: [
      "Linux & Shell Scripting",
      "Docker & Kubernetes",
      "CI/CD Pipelines (GitHub Actions, Jenkins)",
      "Cloud Platforms (AWS / Azure / GCP)",
      "Infrastructure as Code (Terraform)",
      "Monitoring (Prometheus, Grafana)",
      "Git & Version Control",
      "Networking Basics",
    ],
    courses: [
      "Docker & Kubernetes – The Complete Guide (Udemy)",
      "AWS Certified Cloud Practitioner (AWS Training)",
      "DevOps Bootcamp (TechWorld with Nana – YouTube)",
      "GitHub Actions Full Course",
      "Terraform for Beginners (HashiCorp Learn)",
    ],
    projects: [
      "Dockerize a MERN App",
      "CI/CD Pipeline with GitHub Actions",
      "Deploy Node.js App to AWS EC2",
      "Kubernetes Cluster Setup",
      "Monitor App with Prometheus & Grafana",
    ],
  },

};

module.exports = learningPaths;
