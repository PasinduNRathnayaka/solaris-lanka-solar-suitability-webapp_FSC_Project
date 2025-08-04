// models/SolarPanel.js
const mongoose = require('mongoose');

const solarPanelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  efficiency: { type: Number, required: true }, // Efficiency percentage (0-100)
  costPerSqm: { type: Number, required: true }, // Installation cost per square meter in LKR
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
solarPanelSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('SolarPanel', solarPanelSchema);