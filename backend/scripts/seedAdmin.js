/**
 * seedAdmin.js — Seeds default admin account + sample data
 * 
 * Run with: node scripts/seedAdmin.js
 * 
 * Creates:
 *   Admin:   admin@futurepath.ai / Admin@123
 *   5 sample careers
 *   6 sample skills
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin    = require('../models/Admin');
const Career   = require('../models/Career');
const Skill    = require('../models/Skill');

const connectAndSeed = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/futurepath';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB:', uri);

    // ── Admin ─────────────────────────────────────────────────────
    const existing = await Admin.findOne({ email: 'admin@futurepath.ai' });
    if (!existing) {
      await Admin.create({
        name:     'Super Admin',
        email:    'admin@futurepath.ai',
        password: 'Admin@123',
        role:     'Super Admin',
      });
      console.log('👤 Admin created: admin@futurepath.ai / Admin@123');
    } else {
      console.log('👤 Admin already exists — skipping');
    }

    // ── Careers ───────────────────────────────────────────────────
    await Career.deleteMany({});
    await Career.insertMany([
      { name: 'Software Engineer',       industry: 'Technology', educationLevel: "Bachelor's", demandLevel: 'Very High', averageSalary: 85000,  jobOutlook: 'Excellent', requiredSkills: ['Python','Java','React'],        certifications: ['AWS Certified','Google Cloud'] },
      { name: 'Data Scientist',           industry: 'Technology', educationLevel: "Master's",   demandLevel: 'High',      averageSalary: 92000,  jobOutlook: 'Very Good', requiredSkills: ['Python','ML','SQL','TensorFlow'], certifications: ['TensorFlow Dev','Databricks'] },
      { name: 'UX Designer',              industry: 'Design',     educationLevel: "Bachelor's", demandLevel: 'High',      averageSalary: 72000,  jobOutlook: 'Good',      requiredSkills: ['Figma','CSS','User Research'],    certifications: ['Google UX','NN/g'] },
      { name: 'Cybersecurity Analyst',    industry: 'Security',   educationLevel: "Bachelor's", demandLevel: 'Very High', averageSalary: 90000,  jobOutlook: 'Excellent', requiredSkills: ['Network Security','SIEM'],        certifications: ['CISSP','CEH'] },
      { name: 'Cloud Architect',          industry: 'Technology', educationLevel: "Bachelor's", demandLevel: 'Very High', averageSalary: 115000, jobOutlook: 'Excellent', requiredSkills: ['AWS','Kubernetes','Terraform'],    certifications: ['AWS SA','GCP Pro'] },
    ]);
    console.log('💼 5 careers seeded');

    // ── Skills ────────────────────────────────────────────────────
    await Skill.deleteMany({});
    await Skill.insertMany([
      { name: 'Python',          category: 'Programming', description: 'High-level programming language' },
      { name: 'React',           category: 'Programming', description: 'JavaScript UI library' },
      { name: 'Machine Learning',category: 'Data',        description: 'Predictive modelling and AI' },
      { name: 'SQL',             category: 'Data',        description: 'Relational database querying' },
      { name: 'Figma',           category: 'Design',      description: 'Collaborative design tool' },
      { name: 'Docker',          category: 'DevOps',      description: 'Containerization platform' },
    ]);
    console.log('🧠 6 skills seeded');

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

connectAndSeed();
