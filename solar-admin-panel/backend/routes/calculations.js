// routes/calculations.js
const express = require('express');
const router = express.Router();
const Calculation = require('../models/Calculation');
const ModelCoefficients = require('../models/ModelCoefficients');
const SolarPanel = require('../models/SolarPanel');
const LocationData = require('../models/LocationData');

// Calculate PVOUT and energy production
router.post('/calculate', async (req, res) => {
  try {
    const { province, district, city, solarPanelId, numberOfPanels = 1 } = req.body;
    
    // Get model coefficients
    const modelCoeff = await ModelCoefficients.findOne({ isActive: true });
    if (!modelCoeff) {
      return res.status(404).json({ message: 'Model coefficients not found' });
    }
    
    // Get location data
    const locationData = await LocationData.findOne({ province, district, city })
      .populate('variables.variableId');
    if (!locationData) {
      return res.status(404).json({ message: 'Location data not found' });
    }
    
    // Get solar panel data
    const solarPanel = await SolarPanel.findById(solarPanelId);
    if (!solarPanel) {
      return res.status(404).json({ message: 'Solar panel not found' });
    }
    
    // Calculate PVOUT using the model
    const variables = locationData.variables;
    let pvout = modelCoeff.beta0 + modelCoeff.epsilon;
    
    // Add variable contributions (assuming first 4 variables match beta1-beta4)
    if (variables[0]) pvout += modelCoeff.beta1 * variables[0].value;
    if (variables[1]) pvout += modelCoeff.beta2 * variables[1].value;
    if (variables[2]) pvout += modelCoeff.beta3 * variables[2].value;
    if (variables[3]) pvout += modelCoeff.beta4 * variables[3].value;
    
    // Calculate energy production
    const absorptionFactor = solarPanel.absorptionRate / 100;
    const dailyEnergyPerPanel = pvout * solarPanel.area * absorptionFactor;
    const dailyEnergyProduction = dailyEnergyPerPanel * numberOfPanels;
    const monthlyEnergyProduction = dailyEnergyProduction * 30;
    const monthlyEarnings = monthlyEnergyProduction * locationData.electricityRate;
    
    // Save calculation
    const calculation = new Calculation({
      location: { province, district, city },
      solarPanelId,
      numberOfPanels,
      pvout,
      dailyEnergyProduction,
      monthlyEnergyProduction,
      monthlyEarnings,
      electricityRate: locationData.electricityRate,
      modelCoefficients: {
        beta0: modelCoeff.beta0,
        beta1: modelCoeff.beta1,
        beta2: modelCoeff.beta2,
        beta3: modelCoeff.beta3,
        beta4: modelCoeff.beta4,
        epsilon: modelCoeff.epsilon
      },
      variables: variables.map(v => ({
        variableId: v.variableId._id,
        name: v.variableId.name,
        value: v.value,
        unit: v.variableId.unit
      }))
    });
    
    await calculation.save();
    
    res.json({
      calculation,
      solarPanel,
      results: {
        pvout: pvout.toFixed(3),
        dailyEnergyProduction: dailyEnergyProduction.toFixed(3),
        monthlyEnergyProduction: monthlyEnergyProduction.toFixed(3),
        monthlyEarnings: monthlyEarnings.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get calculation history
router.get('/', async (req, res) => {
  try {
    const calculations = await Calculation.find()
      .populate('solarPanelId')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(calculations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;