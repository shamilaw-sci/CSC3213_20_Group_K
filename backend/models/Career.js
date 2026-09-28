/**
 * Career.js — Career MongoDB Model (Admin Dashboard)
 */
const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  name:            { type: String, required: true, trim: true },
  description:     { type: String, trim: true },
  requiredSkills:  [{ type: String }],
  industry:        { type: String, trim: true },
  educationLevel:  { type: String, enum: ["Bachelor's","Master's","PhD","Diploma","Any"], default: "Bachelor's" },
  demandLevel:     { type: String, enum: ['Very High','High','Medium','Low'], default: 'Medium' },
  averageSalary:   { type: Number },
  imageUrl:        { type: String },
  jobOutlook:      { type: String },
  certifications:  [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema);
