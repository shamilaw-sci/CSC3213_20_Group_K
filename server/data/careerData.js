// ─────────────────────────────────────────────
// Career Details Data
// Static data describing each career in depth.
// Keys are lowercase career names for easy lookup.
// ─────────────────────────────────────────────

const careerDetails = {

  "software engineer": {
    title: "Software Engineer",
    description:
      "Software Engineers design, develop, test, and maintain software applications. They work across industries to build web apps, mobile apps, APIs, and enterprise systems using programming languages like JavaScript, Python, Java, and more.",
    salaryRange: "$65,000 – $150,000 per year",
    requiredSkills: [
      "JavaScript / TypeScript",
      "React or Angular (Frontend)",
      "Node.js / Python / Java (Backend)",
      "Databases (SQL & NoSQL)",
      "Git & Version Control",
      "REST APIs & System Design",
      "Problem Solving & DSA",
    ],
    futureScope:
      "Extremely high demand across all industries. Specializations in AI/ML engineering, cloud-native development, and Web3 are growing rapidly. Remote-first roles are widely available globally.",
  },

  "data scientist": {
    title: "Data Scientist",
    description:
      "Data Scientists collect, clean, and analyze large datasets to extract meaningful insights and build predictive models. They use statistics, machine learning, and data visualization to help businesses make data-driven decisions.",
    salaryRange: "$70,000 – $160,000 per year",
    requiredSkills: [
      "Python (Pandas, NumPy, Scikit-learn)",
      "Machine Learning & Deep Learning",
      "Data Visualization (Matplotlib, Power BI)",
      "SQL & Big Data Tools",
      "Statistics & Probability",
      "TensorFlow / PyTorch",
      "Cloud Platforms (AWS / GCP)",
    ],
    futureScope:
      "One of the fastest-growing fields in tech. AI and automation are creating massive demand. Specializations in NLP, computer vision, and MLOps are particularly in demand.",
  },

  "ui/ux designer": {
    title: "UI/UX Designer",
    description:
      "UI/UX Designers create user-friendly, visually appealing interfaces for websites and apps. UI focuses on the look and feel (colors, typography, layouts) while UX focuses on the user journey, research, and overall usability.",
    salaryRange: "$55,000 – $120,000 per year",
    requiredSkills: [
      "Figma / Adobe XD",
      "Wireframing & Prototyping",
      "User Research & Usability Testing",
      "Design Systems & Component Libraries",
      "Typography & Color Theory",
      "Basic HTML & CSS",
      "Accessibility Standards (WCAG)",
    ],
    futureScope:
      "Growing demand as companies invest in digital products. Motion design, AR/VR interfaces, and AI-powered design tools are emerging specializations. Strong portfolio matters more than degree.",
  },

  "cyber security analyst": {
    title: "Cyber Security Analyst",
    description:
      "Cyber Security Analysts protect organizations from digital attacks. They monitor networks, investigate security breaches, implement defensive measures, and ensure compliance with security standards and regulations.",
    salaryRange: "$60,000 – $130,000 per year",
    requiredSkills: [
      "Networking & TCP/IP",
      "Linux & Shell Scripting",
      "Ethical Hacking & Penetration Testing",
      "SIEM Tools (Splunk, IBM QRadar)",
      "Firewalls, IDS/IPS Systems",
      "Risk Assessment & Compliance",
      "Python for Security Scripting",
    ],
    futureScope:
      "Cyber threats are increasing globally, making this one of the most secure career paths. Specializations in cloud security, malware analysis, and incident response are highly valued.",
  },

  "devops engineer": {
    title: "DevOps Engineer",
    description:
      "DevOps Engineers bridge the gap between software development and IT operations. They automate deployment pipelines, manage cloud infrastructure, and ensure applications are delivered reliably and at speed.",
    salaryRange: "$75,000 – $155,000 per year",
    requiredSkills: [
      "Docker & Kubernetes",
      "CI/CD Pipelines (GitHub Actions, Jenkins)",
      "Cloud Platforms (AWS, Azure, GCP)",
      "Infrastructure as Code (Terraform)",
      "Linux & Shell Scripting",
      "Monitoring (Prometheus, Grafana)",
      "Git & Branching Strategies",
    ],
    futureScope:
      "Cloud adoption is accelerating globally. Platform engineering and GitOps are emerging trends. DevOps engineers are among the highest-paid roles in tech with strong job security.",
  },

  "mobile app developer": {
    title: "Mobile App Developer",
    description:
      "Mobile App Developers build applications for iOS and Android platforms. They work with native (Swift, Kotlin) or cross-platform frameworks (React Native, Flutter) to create smooth, user-friendly mobile experiences.",
    salaryRange: "$60,000 – $140,000 per year",
    requiredSkills: [
      "React Native or Flutter",
      "Swift (iOS) or Kotlin (Android)",
      "REST API Integration",
      "Mobile UI Design Principles",
      "State Management (Redux, Provider)",
      "Push Notifications & Device APIs",
      "App Store Deployment",
    ],
    futureScope:
      "Mobile usage continues to grow worldwide. AR/VR mobile apps and cross-platform frameworks are expanding opportunities. Strong demand in e-commerce, health-tech, and fintech.",
  },

};

module.exports = careerDetails;
