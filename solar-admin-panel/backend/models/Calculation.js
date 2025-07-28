// models/Calculation.js
const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
  location: {
    province: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true }
  },
  solarPanelId: { type: mongoose.Schema.Types.ObjectId, ref: 'SolarPanel', required: true },
  numberOfPanels: { type: Number, required: true, default: 1 },
  pvout: { type: Number, required: true }, // Calculated PVOUT
  dailyEnergyProduction: { type: Number, required: true }, // kWh per day
  monthlyEnergyProduction: { type: Number, required: true }, // kWh per month
  monthlyEarnings: { type: Number, required: true }, // Monthly earnings in currency
  electricityRate: { type: Number, required: true }, // Rate per kWh used in calculation
  modelCoefficients: {
    beta0: Number,
    beta1: Number,
    beta2: Number,
    beta3: Number,
    beta4: Number,
    epsilon: Number
  },
  variables: [{
    variableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Variable' },
    name: String,
    value: Number,
    unit: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Calculation', calculationSchema);