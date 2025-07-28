// models/SolarPanel.js
const mongoose = require('mongoose');

const solarPanelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  wattage: { type: Number, required: true }, // Peak wattage in watts
  efficiency: { type: Number, required: true }, // Efficiency percentage (0-100)
  absorptionRate: { type: Number, required: true }, // Percentage of PVOUT that can be absorbed (0-100)
  area: { type: Number, required: true }, // Panel area in m²
  pricePerUnit: { type: Number, required: true }, // Price per panel
  warranty: { type: Number, default: 25 }, // Warranty in years
  technology: { 
    type: String, 
    enum: ['Monocrystalline', 'Polycrystalline', 'Thin Film', 'Bifacial'],
    required: true 
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SolarPanel', solarPanelSchema);