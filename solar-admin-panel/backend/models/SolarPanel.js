// models/SolarPanel.js
const mongoose = require('mongoose');

const solarPanelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  efficiency: { type: Number, required: true }, // Efficiency percentage (0-100)
  pricePerWatt: { type: Number, default: 150 }, // Price per watt in LKR
  warrantyYears: { type: Number, default: 25 }, // Warranty period in years
  manufacturer: { type: String, default: '' }, // Panel manufacturer
  technology: { 
    type: String, 
    enum: ['Monocrystalline', 'Polycrystalline', 'Thin Film', 'Bifacial'],
    default: 'Monocrystalline' 
  },
  maxPowerOutput: { type: Number, default: 400 }, // Maximum power output in watts
  dimensions: {
    length: { type: Number, default: 2 }, // Length in meters
    width: { type: Number, default: 1 }, // Width in meters
    thickness: { type: Number, default: 0.04 } // Thickness in meters
  },
  weight: { type: Number, default: 20 }, // Weight in kg
  temperatureCoefficient: { type: Number, default: -0.4 }, // %/°C
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Virtual field to calculate area
solarPanelSchema.virtual('area').get(function() {
  return this.dimensions.length * this.dimensions.width;
});

// Virtual field to calculate price per square meter
solarPanelSchema.virtual('pricePerSqm').get(function() {
  const area = this.dimensions.length * this.dimensions.width;
  const totalPrice = (this.maxPowerOutput * this.pricePerWatt);
  return totalPrice / area;
});

module.exports = mongoose.model('SolarPanel', solarPanelSchema);