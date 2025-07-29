// models/SolarPanel.js
const mongoose = require('mongoose');

const solarPanelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  efficiency: { type: Number, required: true }, // Efficiency percentage (0-100)
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SolarPanel', solarPanelSchema);