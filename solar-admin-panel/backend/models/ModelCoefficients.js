// models/ModelCoefficients.js
const mongoose = require('mongoose');

const modelCoefficientsSchema = new mongoose.Schema({
  beta0: { type: Number, required: true, default: 2.5 }, // Intercept
  beta1: { type: Number, required: true, default: 0.8 }, // Solar Irradiance coefficient
  beta2: { type: Number, required: true, default: -0.3 }, // Temperature coefficient
  beta3: { type: Number, required: true, default: 0.6 }, // Humidity coefficient
  beta4: { type: Number, required: true, default: 0.4 }, // Cloud Cover coefficient
  epsilon: { type: Number, required: true, default: 0.1 }, // Error term
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ModelCoefficients', modelCoefficientsSchema);