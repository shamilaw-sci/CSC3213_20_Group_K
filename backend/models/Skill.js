/**
 * Skill.js — Skill MongoDB Model
 */
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, unique: true },
  category:    { type: String, enum: ['Programming','Design','Data','Business','DevOps','Security','Communication','Other'], default: 'Other' },
  description: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
