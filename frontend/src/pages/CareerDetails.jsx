import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import SkillList from "../components/SkillList";
import MentorCard from "../components/MentorCard";
import MentorProfileModal from "../components/MentorProfileModal";
import MyBookingsModal from "../components/MyBookingsModal";
import {
  getMentorsByCareer,
  getMentorById,
  getStudentBookings,
  BOOKING_UPDATE_EVENT,
} from "../services/bookingService";
import "./CareerDetails.css";

// Clean Professional Vector Icons (No sparkles, no emojis)
const IconCode = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconChart = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const IconShield = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconCloud = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);

const IconCpu = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </svg>
);

const IconGlobe = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconCog = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const IconDatabase = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const IconBriefcase = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconClipboardList = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="m9 14 2 2 4-4" />
  </svg>
);

const IconCurrencyDollar = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconTrendingUp = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

// Map career titles to their dedicated SVG icon
const getCareerIcon = (title, size = 18) => {
  switch (title) {
    case "Software Engineer":
      return <IconCode size={size} />;
    case "Data Scientist":
      return <IconChart size={size} />;
    case "Cybersecurity Analyst":
      return <IconShield size={size} />;
    case "Cloud Engineer":
      return <IconCloud size={size} />;
    case "AI/ML Engineer":
      return <IconCpu size={size} />;
    case "Web Developer":
      return <IconGlobe size={size} />;
    case "DevOps Engineer":
      return <IconCog size={size} />;
    case "Database Administrator":
      return <IconDatabase size={size} />;
    default:
      return <IconBriefcase size={size} />;
  }
};

// Comprehensive dataset for the canonical careers in the system
const CAREERS_DATA = {
  "Software Engineer": {
    title: "Software Engineer",
    category: "Software",
    tagline: "Build scalable software systems, APIs, and modern digital applications.",
    description:
      "A Software Engineer designs, develops, tests, and maintains robust software applications and system architectures. Software engineers apply computer science fundamentals, algorithmic problem-solving, and modern engineering practices to build scalable, high-performance software products that solve real-world problems.",
    jobType: "Full-Time / Hybrid / Remote",
    experienceLevel: "Entry to Senior",
    workArea: "Software Development & Architecture",
    marketDemand: "Very High Demand",
    growthRate: "+22% (Faster than average)",
    salaryRange: "$75,000 - $145,000 / yr",
    salaryBreakdown: [
      { tier: "Entry Level (0-2 yrs)", amount: "$70,000 - $85,000", class: "entry" },
      { tier: "Mid Level (3-5 yrs)", amount: "$95,000 - $125,000", class: "mid" },
      { tier: "Senior / Lead (5+ yrs)", amount: "$135,000 - $175,000+", class: "senior" },
    ],
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "RESTful APIs",
      "SQL & NoSQL",
      "Data Structures & Algorithms",
      "Git & GitHub",
      "Unit & Integration Testing",
      "System Design",
    ],
    responsibilities: [
      "Architect, develop, and maintain clean, scalable, and reusable code for web and enterprise applications.",
      "Collaborate with cross-functional teams including product managers, UI/UX designers, and QA engineers.",
      "Design and consume efficient RESTful and GraphQL APIs for seamless client-server communication.",
      "Conduct thorough code reviews, debug complex production issues, and optimize application throughput.",
      "Implement automated unit, integration, and end-to-end tests to guarantee software reliability.",
    ],
    futureScope:
      "Software Engineering remains the backbone of the digital economy. With increasing shifts toward cloud-native ecosystems, microservices, and AI-assisted tooling, engineers with strong foundations in system design, data structures, and full-stack development will remain in high demand across all sectors.",
    topIndustries: ["FinTech", "SaaS & Cloud Software", "E-Commerce", "HealthTech", "Artificial Intelligence"],
  },

  "Data Scientist": {
    title: "Data Scientist",
    category: "Data & AI",
    tagline: "Turn complex data into predictive models and actionable business intelligence.",
    description:
      "A Data Scientist leverages statistical modeling, machine learning algorithms, and data visualization to analyze massive datasets. They identify hidden trends, automate predictions, and empower organizations to make evidence-based, data-driven decisions that fuel strategic growth.",
    jobType: "Full-Time / Hybrid / Remote",
    experienceLevel: "Entry to Senior",
    workArea: "Analytics, ML & Statistical Computing",
    marketDemand: "High Demand",
    growthRate: "+35% (Rapidly Expanding)",
    salaryRange: "$80,000 - $150,000 / yr",
    salaryBreakdown: [
      { tier: "Entry Level (0-2 yrs)", amount: "$75,000 - $90,000", class: "entry" },
      { tier: "Mid Level (3-5 yrs)", amount: "$100,000 - $130,000", class: "mid" },
      { tier: "Senior / Lead (5+ yrs)", amount: "$140,000 - $185,000+", class: "senior" },
    ],
    skills: [
      "Python",
      "R",
      "SQL",
      "Pandas & NumPy",
      "Scikit-Learn",
      "Machine Learning",
      "Statistics & Probability",
      "Data Visualization (Tableau/PowerBI)",
      "Big Data (Spark)",
      "A/B Testing",
    ],
    responsibilities: [
      "Extract, clean, and preprocess structured and unstructured data from heterogeneous sources.",
      "Build, evaluate, and fine-tune predictive machine learning models to solve complex business queries.",
      "Design interactive dashboards and visual reports to communicate key analytical insights to stakeholders.",
      "Formulate statistical hypotheses and design A/B experimentation frameworks for product optimization.",
      "Collaborate with data engineering teams to deploy production ML pipelines and automated monitoring.",
    ],
    futureScope:
      "As data generation accelerates globally, every industry requires predictive modeling and advanced analytics. Data Scientists who specialize in deep learning, natural language processing, and real-time big data pipelines enjoy exceptional career mobility and leadership opportunities.",
    topIndustries: ["Finance & Banking", "Healthcare & Genomics", "E-Commerce", "Consulting", "Tech Giants"],
  },

  "Cybersecurity Analyst": {
    title: "Cybersecurity Analyst",
    category: "Security",
    tagline: "Protect enterprise networks, cloud infrastructure, and sensitive data from cyber threats.",
    description:
      "A Cybersecurity Analyst monitors, protects, and defends computer networks, cloud infrastructure, and software applications against unauthorized access, malicious breaches, and cyber vulnerabilities. They implement security protocols, conduct vulnerability audits, and orchestrate emergency incident responses.",
    jobType: "Full-Time / On-Site / Hybrid",
    experienceLevel: "Entry to Senior",
    workArea: "Information Security & Threat Intelligence",
    marketDemand: "Critical High Demand",
    growthRate: "+32% (Mission-Critical)",
    salaryRange: "$72,000 - $138,000 / yr",
    salaryBreakdown: [
      { tier: "Entry Level (0-2 yrs)", amount: "$68,000 - $82,000", class: "entry" },
      { tier: "Mid Level (3-5 yrs)", amount: "$90,000 - $120,000", class: "mid" },
      { tier: "Senior / Lead (5+ yrs)", amount: "$130,000 - $170,000+", class: "senior" },
    ],
    skills: [
      "Network Security",
      "Linux & Unix Systems",
      "SIEM Tools (Splunk/QRadar)",
      "Penetration Testing",
      "Firewalls & IDS/IPS",
      "Incident Response",
      "Python for Security",
      "Ethical Hacking & OWASP",
      "Cryptography",
      "Compliance (ISO 27001, SOC2)",
    ],
    responsibilities: [
      "Monitor security event feeds and SIEM alerts to detect, triage, and mitigate potential network intrusions.",
      "Conduct regular vulnerability assessments and penetration testing on internal networks and web applications.",
      "Develop and enforce robust organizational security policies, encryption standards, and access control guidelines.",
      "Lead incident response teams during live breaches to contain threats and preserve forensic evidence.",
      "Deliver proactive security awareness training and audit adherence to compliance frameworks.",
    ],
    futureScope:
      "With rising ransomware threats and zero-trust security mandates, organizations face severe shortages of qualified security professionals. Cybersecurity specialists with cloud security (AWS/Azure) and AI threat-hunting expertise hold immense strategic influence.",
    topIndustries: ["Defense & Government", "Banking & Financial Services", "Healthcare", "Cloud Providers", "Telecom"],
  },

  "Cloud Engineer": {
    title: "Cloud Engineer",
    category: "Cloud & DevOps",
    tagline: "Architect, deploy, and manage highly resilient cloud infrastructure and services.",
    description:
      "A Cloud Engineer designs, deploys, and optimizes scalable cloud architectures on platforms such as AWS, Google Cloud, and Microsoft Azure. They automate infrastructure provisioning, ensure fault tolerance, and spearhead cloud migration strategies to guarantee high system uptime and cost efficiency.",
    jobType: "Full-Time / Hybrid / Remote",
    experienceLevel: "Entry to Senior",
    workArea: "Cloud Infrastructure & Systems Engineering",
    marketDemand: "Very High Demand",
    growthRate: "+28% (Accelerating)",
    salaryRange: "$82,000 - $155,000 / yr",
    salaryBreakdown: [
      { tier: "Entry Level (0-2 yrs)", amount: "$75,000 - $92,000", class: "entry" },
      { tier: "Mid Level (3-5 yrs)", amount: "$105,000 - $135,000", class: "mid" },
      { tier: "Senior / Lead (5+ yrs)", amount: "$145,000 - $190,000+", class: "senior" },
    ],
    skills: [
      "Amazon Web Services (AWS)",
      "Microsoft Azure / GCP",
      "Terraform (Infrastructure as Code)",
      "Docker & Containerization",
      "Kubernetes Orchestration",
      "Linux Administration",
      "Cloud Networking & VPCs",
      "IAM Security & Policies",
      "CI/CD Pipelines",
      "Cloud Cost Optimization",
    ],
    responsibilities: [
      "Provision and manage reliable cloud infrastructure utilizing Terraform and Infrastructure as Code (IaC).",
      "Migrate on-premise systems and monolithic applications to containerized, microservices-based cloud clusters.",
      "Implement automated failover, autoscaling, and disaster recovery strategies to ensure high availability.",
      "Optimize cloud resource utilization to reduce monthly hosting costs without compromising speed or capacity.",
      "Ensure cloud infrastructure adheres to zero-trust access policies, data encryption, and compliance standards.",
    ],
    futureScope:
      "Modern enterprises are transitioning toward 100% cloud-native operations. Skilled Cloud Engineers with expertise in Kubernetes, serverless architectures, and multi-cloud environments continue to be among the highest compensated engineers globally.",
    topIndustries: ["Enterprise Tech", "SaaS Providers", "Banking & Insurance", "Digital Media & Streaming", "Logistics"],
  },

  "AI/ML Engineer": {
    title: "AI/ML Engineer",
    category: "Data & AI",
    tagline: "Design, train, and deploy cutting-edge artificial intelligence and deep learning models.",
    description:
      "An AI/ML Engineer researches, designs, trains, and operationalizes artificial intelligence models and machine learning pipelines. Combining deep software engineering proficiency with machine learning theory, they transform experimental algorithms into high-throughput production AI applications.",
    jobType: "Full-Time / Remote / Hybrid",
    experienceLevel: "Mid to Senior",
    workArea: "Artificial Intelligence & Deep Learning",
    marketDemand: "Explosive Demand",
    growthRate: "+40% (Frontier Tech)",
    salaryRange: "$95,000 - $175,000 / yr",
    salaryBreakdown: [
      { tier: "Entry Level (0-2 yrs)", amount: "$85,000 - $105,000", class: "entry" },
      { tier: "Mid Level (3-5 yrs)", amount: "$120,000 - $155,000", class: "mid" },
      { tier: "Senior / Lead (5+ yrs)", amount: "$165,000 - $220,000+", class: "senior" },
    ],
    skills: [
      "Python",
      "PyTorch & TensorFlow",
      "Deep Learning & Neural Networks",
      "Natural Language Processing (NLP)",
      "Large Language Models (LLMs) & Fine-tuning",
      "Computer Vision",
      "MLOps (MLflow, Kubeflow)",
      "Vector Databases & RAG",
      "CUDA & GPU Acceleration",
      "Data Structures & Math",
    ],
    responsibilities: [
      "Research, prototype, and train deep learning models for classification, NLP, and computer vision tasks.",
      "Build robust MLOps pipelines for automated model retraining, versioning, deployment, and drift monitoring.",
      "Optimize model inference latencies using techniques like quantization, pruning, and GPU tensor parallelism.",
      "Implement Retrieval-Augmented Generation (RAG) and LLM agentic workflows into production software.",
      "Collaborate with backend engineers to integrate intelligent inference endpoints into consumer-facing apps.",
    ],
    futureScope:
      "Generative AI, autonomous agents, and foundation models are reshaping software worldwide. AI/ML Engineers who possess practical skills in deploying LLMs, fine-tuning models, and building efficient MLOps pipelines represent the forefront of tech talent.",
    topIndustries: ["AI Research Labs", "Autonomous Vehicles", "Healthcare & Biotech", "Robotics", "FinTech"],
  },

  "Web Developer": {
    title: "Web Developer",
    category: "Software",
    tagline: "Craft responsive, interactive, and high-performance modern web experiences.",
    description:
      "A Web Developer specializes in building dynamic, accessible, and responsive websites and web applications. Focusing on modern frontend frameworks, CSS architectures, and performant backend APIs, they turn UI designs into seamless interactive digital experiences that delight users across all screen sizes.",
    jobType: "Full-Time / Remote / Freelance",
    experienceLevel: "Entry to Mid",
    workArea: "Frontend & Full-Stack Web Development",
    marketDemand: "Steady High Demand",
    growthRate: "+18% (Consistently Strong)",
    salaryRange: "$65,000 - $125,000 / yr",
    salaryBreakdown: [
      { tier: "Entry Level (0-2 yrs)", amount: "$60,000 - $75,000", class: "entry" },
      { tier: "Mid Level (3-5 yrs)", amount: "$85,000 - $110,000", class: "mid" },
      { tier: "Senior / Lead (5+ yrs)", amount: "$120,000 - $150,000+", class: "senior" },
    ],
    skills: [
      "HTML5 & Semantic Markup",
      "Modern CSS (Flexbox, Grid, Animations)",
      "JavaScript (ES6+) & TypeScript",
      "React / Vue / Next.js",
      "Tailwind CSS & CSS Modules",
      "Responsive Web Design",
      "REST APIs & Fetching",
      "Web Performance & Core Web Vitals",
      "Git Version Control",
      "Web Accessibility (WCAG / a11y)",
    ],
    responsibilities: [
      "Translate Figma and designer wireframes into pixel-perfect, accessible, and responsive user interfaces.",
      "Optimize web applications for peak speed, minimal bundle sizes, and outstanding Core Web Vitals scores.",
      "Implement interactive client-side routing, state management, and seamless API integrations.",
      "Ensure cross-browser compatibility and responsive performance across mobile, tablet, and desktop devices.",
      "Maintain clean, modular frontend component libraries and style guides.",
    ],
    futureScope:
      "With web technologies evolving rapidly through React Server Components, WebAssembly, and modern CSS capabilities, developers who master responsive design, speed optimization, and full-stack JavaScript are perpetually in demand.",
    topIndustries: ["Digital Agencies", "E-Commerce", "Media & Publishing", "Tech Startups", "SaaS Companies"],
  },

  "DevOps Engineer": {
    title: "DevOps Engineer",
    category: "Cloud & DevOps",
    tagline: "Unify software development and IT operations through robust CI/CD automation.",
    description:
      "A DevOps Engineer bridges the gap between software development and IT operations. They create continuous integration and continuous deployment (CI/CD) pipelines, automate build systems, manage infrastructure as code, and implement observability tools to guarantee rapid, zero-downtime releases.",
    jobType: "Full-Time / Hybrid / Remote",
    experienceLevel: "Mid to Senior",
    workArea: "DevOps, Automation & Site Reliability",
    marketDemand: "Very High Demand",
    growthRate: "+26% (High Velocity)",
    salaryRange: "$85,000 - $160,000 / yr",
    salaryBreakdown: [
      { tier: "Entry Level (0-2 yrs)", amount: "$78,000 - $95,000", class: "entry" },
      { tier: "Mid Level (3-5 yrs)", amount: "$110,000 - $140,000", class: "mid" },
      { tier: "Senior / Lead (5+ yrs)", amount: "$150,000 - $195,000+", class: "senior" },
    ],
    skills: [
      "CI/CD (GitHub Actions, GitLab CI, Jenkins)",
      "Docker & Containerization",
      "Kubernetes & Helm",
      "Linux Shell Scripting & Bash",
      "Python / Go for Automation",
      "Terraform & Ansible",
      "Monitoring & Observability (Prometheus, Grafana)",
      "Cloud Platforms (AWS, Azure)",
      "Git & Trunk-Based Development",
      "Site Reliability Engineering (SRE) Principles",
    ],
    responsibilities: [
      "Construct, test, and maintain fully automated CI/CD pipelines for continuous build and deployment.",
      "Standardize development and staging environments using Docker containers and Kubernetes clusters.",
      "Implement comprehensive monitoring, alerting, and log aggregation systems to detect incidents proactively.",
      "Collaborate with software engineers to optimize deployment frequencies and lead time for changes.",
      "Execute automated security scans and vulnerability tests within the deployment pipeline (DevSecOps).",
    ],
    futureScope:
      "As software deployment cycles compress from months to minutes, organizations depend fundamentally on DevOps and Site Reliability Engineers to keep mission-critical systems running with 99.99% availability.",
    topIndustries: ["Cloud Native Enterprises", "FinTech", "Online Gaming", "SaaS Providers", "Global Telecoms"],
  },

  "Database Administrator": {
    title: "Database Administrator",
    category: "Software",
    tagline: "Ensure peak performance, data integrity, and bulletproof security for database clusters.",
    description:
      "A Database Administrator (DBA) manages, secures, and tunes relational and NoSQL database management systems. They specialize in high-concurrency schema design, query optimization, backup and disaster recovery, and data replication to guarantee data is always accessible, performant, and protected.",
    jobType: "Full-Time / Hybrid / On-Site",
    experienceLevel: "Entry to Senior",
    workArea: "Data Storage, Database Tuning & Management",
    marketDemand: "Steady Demand",
    growthRate: "+15% (Essential Foundation)",
    salaryRange: "$72,000 - $135,000 / yr",
    salaryBreakdown: [
      { tier: "Entry Level (0-2 yrs)", amount: "$65,000 - $80,000", class: "entry" },
      { tier: "Mid Level (3-5 yrs)", amount: "$90,000 - $120,000", class: "mid" },
      { tier: "Senior / Lead (5+ yrs)", amount: "$125,000 - $165,000+", class: "senior" },
    ],
    skills: [
      "Advanced SQL & Relational Schema Design",
      "PostgreSQL & MySQL",
      "MongoDB & NoSQL Stores",
      "Query Profiling & Index Optimization",
      "Backup, Restoration & Disaster Recovery",
      "High Availability & Database Replication",
      "Data Security, Encryption & RBAC",
      "Performance Tuning & Buffer Management",
      "Database Sharding & Partitioning",
      "ETL & Data Migration",
    ],
    responsibilities: [
      "Design, implement, and maintain highly available database clusters with automated failover.",
      "Profile and optimize slow-running database queries, indexes, and execution plans for peak throughput.",
      "Orchestrate strict database backup schedules, conduct routine disaster recovery drills, and test data integrity.",
      "Implement fine-grained role-based access control (RBAC) and data-at-rest encryption to protect sensitive data.",
      "Collaborate with developers on relational normalization, indexing strategies, and migration scripts.",
    ],
    futureScope:
      "With modern distributed databases, cloud databases (RDS, Aurora, Firestore), and exponential data volumes, Database Administrators and Data Platform Engineers remain critical guardians of enterprise information.",
    topIndustries: ["Banking & Financial Services", "Healthcare & Records", "Government", "Enterprise Retail", "Insurance"],
  },
};

const CATEGORIES = ["All", "Software", "Data & AI", "Cloud & DevOps", "Security"];

function CareerDetails() {
  const [selectedCareer, setSelectedCareer] = useState("Software Engineer");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Mentor guidance & booking states
  const [selectedMentorModal, setSelectedMentorModal] = useState(null);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [mentorsList, setMentorsList] = useState([]);
  const [myBookingsCount, setMyBookingsCount] = useState(0);

  const refreshMentorsAndBookings = useCallback(() => {
    const list = getMentorsByCareer(selectedCareer);
    setMentorsList(list);
    const bookings = getStudentBookings();
    setMyBookingsCount(bookings.length);
  }, [selectedCareer]);

  useEffect(() => {
    refreshMentorsAndBookings();

    const handleSync = () => {
      refreshMentorsAndBookings();
    };

    window.addEventListener(BOOKING_UPDATE_EVENT, handleSync);
    return () => {
      window.removeEventListener(BOOKING_UPDATE_EVENT, handleSync);
    };
  }, [selectedCareer, refreshMentorsAndBookings]);

  // Filter career keys based on search and category
  const filteredCareerKeys = useMemo(() => {
    return Object.keys(CAREERS_DATA).filter((key) => {
      const career = CAREERS_DATA[key];
      const matchesCategory =
        selectedCategory === "All" || career.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.skills.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const currentCareer = CAREERS_DATA[selectedCareer] || CAREERS_DATA["Software Engineer"];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="cd-wrapper">
      <div className="cd-container">

        {/* ── Page Header ── */}
        <div className="cd-header-section">
          <div className="cd-badge-pill">
            <IconBriefcase size={14} />
            <span>Career Intelligence Hub</span>
          </div>

          <h1 className="cd-page-title">Career Pathways & Insights</h1>

          <p className="cd-page-subtitle">
            Explore industry-standard roles, required competencies, salary projections, and clear roadmaps to launch your tech career.
          </p>
        </div>

        {/* ── Interactive Filter & Career Selector ── */}
        <div className="cd-toolbar">
          <div className="cd-selector-heading">
            <div>
              <span className="cd-selector-kicker">CAREER EXPLORER</span>
              <h2>Find your next move</h2>
            </div>
            <span className="cd-role-count">{filteredCareerKeys.length} {filteredCareerKeys.length === 1 ? "role" : "roles"}</span>
          </div>

          <div className="cd-filter-bar">
            {/* Category Chips */}
            <div className="cd-category-chips" role="group" aria-label="Career category filter">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`cd-category-btn ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="cd-search-input-wrap">
              <span className="cd-search-icon" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search career or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cd-search-input"
              />
            </div>
          </div>

          {/* Career Pills List */}
          <div className="cd-tabs-heading">
            <span>Browse career paths</span>
            <span className="cd-tabs-hint">Select a role to explore its outlook and skills</span>
          </div>
          <div className="cd-career-pills" role="tablist" aria-label="Available careers">
            {filteredCareerKeys.length > 0 ? (
              filteredCareerKeys.map((key) => {
                const item = CAREERS_DATA[key];
                const isActive = selectedCareer === key;
                return (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={isActive}
                    className={`cd-career-pill ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedCareer(key)}
                  >
                    <span className="cd-pill-icon">{getCareerIcon(item.title, 16)}</span>
                    <span>{item.title}</span>
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 py-1">No careers match your search criteria.</p>
            )}
          </div>
        </div>

        {/* ── Main Career Card ── */}
        <article className="cd-main-card">

          {/* Hero Banner inside Card */}
          <div className="cd-hero-banner" data-career={currentCareer.title}>
            <span
              key={selectedCareer}
              className="cd-hero-art"
              data-career={currentCareer.title}
              aria-hidden="true"
            />
            <div className="cd-hero-top">
              <div className="cd-hero-profile">
                <div className="cd-career-avatar" aria-hidden="true">
                  {getCareerIcon(currentCareer.title, 32)}
                </div>

                <div className="cd-hero-meta">
                  <div className="cd-tags-row">
                    <span className="cd-tag cd-tag-primary">{currentCareer.category}</span>
                    <span className="cd-tag cd-tag-success">{currentCareer.marketDemand}</span>
                    <span className="cd-tag cd-tag-neutral">{currentCareer.jobType}</span>
                  </div>

                  <h2 className="cd-career-heading">{currentCareer.title}</h2>
                  <p className="text-sm font-medium text-blue-600">{currentCareer.tagline}</p>
                </div>
              </div>

              {/* Action Buttons: My Bookings, Bookmark & Share */}
              <div className="cd-hero-actions">
                <button
                  type="button"
                  className="cd-icon-btn relative bg-blue-50/60 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-900"
                  onClick={() => setIsMyBookingsOpen(true)}
                  title="View My Booked Guidance Sessions"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>My Bookings</span>
                  {myBookingsCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-extrabold flex items-center justify-center -mr-1">
                      {myBookingsCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  className={`cd-icon-btn ${isBookmarked ? "active" : ""}`}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  title={isBookmarked ? "Remove Bookmark" : "Bookmark Career"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </svg>
                  <span>{isBookmarked ? "Bookmarked" : "Save"}</span>
                </button>

                <button
                  type="button"
                  className="cd-icon-btn"
                  onClick={handleShare}
                  title="Copy Link to Clipboard"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>

            <p className="cd-career-desc">{currentCareer.description}</p>
          </div>

          {/* 4-Column Quick Metrics Grid */}
          <div className="cd-metrics-grid">
            <div className="cd-metric-card">
              <div className="cd-metric-header">
                <IconCurrencyDollar size={14} />
                <span>Estimated Salary</span>
              </div>
              <div className="cd-metric-val">{currentCareer.salaryRange}</div>
              <div className="cd-metric-sub info">Competitive Market Rate</div>
            </div>

            <div className="cd-metric-card">
              <div className="cd-metric-header">
                <IconTrendingUp size={14} />
                <span>Growth Outlook</span>
              </div>
              <div className="cd-metric-val">{currentCareer.growthRate}</div>
              <div className="cd-metric-sub success">High Growth Rate</div>
            </div>

            <div className="cd-metric-card">
              <div className="cd-metric-header">
                <IconBriefcase size={14} />
                <span>Experience Level</span>
              </div>
              <div className="cd-metric-val">{currentCareer.experienceLevel}</div>
              <div className="cd-metric-sub info">Multi-Tier Progression</div>
            </div>

            <div className="cd-metric-card">
              <div className="cd-metric-header">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
                <span>Domain Focus</span>
              </div>
              <div className="cd-metric-val text-base">{currentCareer.workArea}</div>
              <div className="cd-metric-sub info">Core Specialization</div>
            </div>
          </div>

          {/* Content Body: 2 Columns */}
          <div className="cd-content-body">
            {/* Column 1: Core Responsibilities & Salary Progression */}
            <div className="cd-column">
              {/* Card 1: Key Responsibilities */}
              <div className="cd-section-card">
                <div className="cd-section-header">
                  <div className="cd-section-title-wrap">
                    <div className="cd-section-icon" aria-hidden="true">
                      <IconClipboardList size={18} />
                    </div>
                    <h3 className="cd-section-title">Core Responsibilities</h3>
                  </div>
                </div>

                <p className="cd-section-desc">
                  Key daily workflows, duties, and deliverables expected in this role:
                </p>

                <ul className="cd-tasks-list">
                  {currentCareer.responsibilities.map((resp, i) => (
                    <li key={i} className="cd-task-item">
                      <span className="cd-task-check" aria-hidden="true">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 2: Compensation Benchmark */}
              <div className="cd-section-card">
                <div className="cd-section-header">
                  <div className="cd-section-title-wrap">
                    <div className="cd-section-icon" aria-hidden="true">
                      <IconCurrencyDollar size={18} />
                    </div>
                    <h3 className="cd-section-title">Compensation Benchmarks</h3>
                  </div>
                </div>

                <p className="cd-section-desc">
                  Estimated annual compensation broken down by professional experience tier:
                </p>

                <div className="cd-salary-breakdown">
                  {currentCareer.salaryBreakdown.map((item, index) => (
                    <div key={index} className="cd-salary-tier-item">
                      <div className="cd-tier-label">
                        <span className={`cd-tier-dot ${item.class}`} />
                        <span>{item.tier}</span>
                      </div>
                      <span className="cd-tier-amount">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Required Skills & Industry Outlook */}
            <div className="cd-column">
              {/* Card 3: Required Skills */}
              <div className="cd-section-card">
                <div className="cd-section-header">
                  <div className="cd-section-title-wrap">
                    <div className="cd-section-icon" aria-hidden="true">
                      <IconCode size={18} />
                    </div>
                    <h3 className="cd-section-title">Essential Technical Skills</h3>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {currentCareer.skills.length} Skills
                  </span>
                </div>

                <p className="cd-section-desc">
                  Proficiencies and tools commonly demanded by employers for this career path:
                </p>

                <SkillList skills={currentCareer.skills} />
              </div>

              {/* Card 4: Future Scope & Hiring Sectors */}
              <div className="cd-section-card">
                <div className="cd-section-header">
                  <div className="cd-section-title-wrap">
                    <div className="cd-section-icon" aria-hidden="true">
                      <IconTrendingUp size={18} />
                    </div>
                    <h3 className="cd-section-title">Industry Scope & Outlook</h3>
                  </div>
                </div>

                <p className="cd-section-desc text-slate-700 leading-relaxed">
                  {currentCareer.futureScope}
                </p>

                <div className="pt-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Top Hiring Industries:
                  </p>
                  <div className="cd-scope-tags">
                    {currentCareer.topIndustries.map((ind, i) => (
                      <span key={i} className="cd-industry-pill">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Guidance Mentors & Academic Experts Section ── */}
          <div className="cd-mentors-section">
            <div className="cd-mentors-header">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Academic & Industry Guidance
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  {mentorsList.length} {mentorsList.length === 1 ? "Mentor" : "Mentors"} for {currentCareer.title}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                Mentors & Lecturers for {currentCareer.title}
              </h3>
              <p className="text-sm text-slate-600 max-w-3xl">
                Connect one-on-one with faculty members and seasoned industry leaders specialized in this career path. Select an available slot to reserve your guidance session.
              </p>
            </div>

            {mentorsList.length > 0 ? (
              <div className="cd-mentors-grid">
                {mentorsList.map((mentor) => (
                  <MentorCard
                    key={mentor.id}
                    mentor={mentor}
                    onSelectMentor={(m) => setSelectedMentorModal(m)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm font-semibold text-slate-700">No mentors currently registered for this path.</p>
                <p className="text-xs text-slate-400 mt-1">Check back soon as more faculty members publish their guidance schedules.</p>
              </div>
            )}
          </div>

          {/* ── Footer CTA Banner inside Card ── */}
          <div className="cd-footer-cta">
            <div className="cd-cta-text">
              <h3 className="cd-cta-title">
                Ready to become a {currentCareer.title}?
              </h3>
              <p className="cd-cta-subtitle">
                Access a tailored, milestone-based learning roadmap with free courses, recommended projects, and interview preparation.
              </p>
            </div>

            <div className="cd-cta-actions">
              <Link
                to="/learning-path"
                className="app-link-button"
              >
                <span>Start Learning Path</span>
                <span className="app-link-arrow" aria-hidden="true">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </span>
              </Link>

              <Link
                to="/career-report"
                className="cd-btn-secondary"
              >
                <span>View Career Report</span>
              </Link>
            </div>
          </div>

        </article>

      </div>

      {/* Copy Link Toast Notification */}
      {showToast && (
        <div className="cd-toast" role="status">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Page link copied to clipboard!</span>
        </div>
      )}

      {/* Mentor Profile & Booking Modal */}
      {selectedMentorModal && (
        <MentorProfileModal
          mentor={selectedMentorModal}
          onClose={() => setSelectedMentorModal(null)}
          onBookingCompleted={() => {
            refreshMentorsAndBookings();
            const updated = getMentorById(selectedMentorModal.id);
            if (updated) setSelectedMentorModal(updated);
          }}
        />
      )}

      {/* My Bookings Modal */}
      {isMyBookingsOpen && (
        <MyBookingsModal
          onClose={() => setIsMyBookingsOpen(false)}
          onBookingsChanged={refreshMentorsAndBookings}
        />
      )}
    </div>
  );
}

export default CareerDetails;
