// models/ElectricityRate.js
const mongoose = require('mongoose');

const electricityRateSchema = new mongoose.Schema({
  fromUnits: { type: Number, required: true },
  toUnits: { type: Number, required: true }, // Use 999999 for unlimited
  ratePerKwh: { type: Number, required: true }, // Rate in LKR per kWh
  description: { type: String, default: '' }, // Description of the tier
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure no overlapping tiers
electricityRateSchema.index({ fromUnits: 1, toUnits: 1 }, { unique: true });

// Update the updatedAt field before saving
electricityRateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('ElectricityRate', electricityRateSchema);
