/**
 * LearningResource.js — Learning Resource MongoDB Model
 */
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title:          { type: String, required: true, trim: true },
  provider:       { type: String, trim: true },
  url:            { type: String, trim: true },
  difficultyLevel:{ type: String, enum: ['Beginner','Intermediate','Advanced','Expert'], default: 'Beginner' },
  relatedSkill:   { type: String, trim: true },
  duration:       { type: String, trim: true },
  language:       { type: String, default: 'English' },
}, { timestamps: true });

module.exports = mongoose.model('LearningResource', resourceSchema);
