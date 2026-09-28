/**
 * Feedback.js — Feedback MongoDB Model
 */
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  student:   { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  studentName: { type: String, trim: true },
  rating:    { type: Number, min: 1, max: 5, required: true },
  comment:   { type: String, trim: true },
  status:    { type: String, enum: ['Pending', 'Reviewed'], default: 'Pending' },
  reply:     { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
