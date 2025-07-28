// models/LocationData.js
const mongoose = require('mongoose');

const locationDataSchema = new mongoose.Schema({
  province: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  variables: [{
    variableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Variable', required: true },
    value: { type: Number, required: true }
  }],
  electricityRate: { type: Number, required: true }, // Rate per unit (kWh)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create compound index for unique locations
locationDataSchema.index({ province: 1, district: 1, city: 1 }, { unique: true });

module.exports = mongoose.model('LocationData', locationDataSchema);
