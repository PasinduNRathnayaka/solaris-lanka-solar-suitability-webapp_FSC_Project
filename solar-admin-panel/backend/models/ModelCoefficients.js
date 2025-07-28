// models/ModelCoefficients.js
const mongoose = require('mongoose');

const modelCoefficientsSchema = new mongoose.Schema({
  beta0: { type: Number, required: true, default: 2.5 }, // Intercept
  coefficients: [{
    variableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Variable', required: true },
    variableName: { type: String, required: true },
    value: { type: Number, required: true, default: 0 }
  }],
  epsilon: { type: Number, required: true, default: 0.1 }, // Error term
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ModelCoefficients', modelCoefficientsSchema);