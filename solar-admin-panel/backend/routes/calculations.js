// routes/calculations.js
const express = require('express');
const router = express.Router();
const Calculation = require('../models/Calculation');
const ModelCoefficients = require('../models/ModelCoefficients');
const SolarPanel = require('../models/SolarPanel');
const LocationData = require('../models/LocationData');
const ElectricityRate = require('../models/ElectricityRate');

// Enhanced calculation with PVOUT model and simplified cost structure
router.post('/calculate', async (req, res) => {
  try {
    const { 
      province, 
      district, 
      city, 
      solarPanelId, 
      panelArea
    } = req.body;
    
    // Validate required inputs
    if (!province || !district || !city || !solarPanelId || !panelArea) {
      return res.status(400).json({ 
        message: 'Province, district, city, solar panel ID, and panel area are required' 
      });
    }

    if (parseFloat(panelArea) <= 0) {
      return res.status(400).json({ 
        message: 'Panel area must be greater than 0' 
      });
    }
    
    // Get model coefficients
    const modelCoeff = await ModelCoefficients.findOne({ isActive: true });
    if (!modelCoeff) {
      return res.status(404).json({ message: 'Model coefficients not found' });
    }
    
    // Get location data with variables
    const locationData = await LocationData.findOne({ province, district, city })
      .populate('variables.variableId');
    if (!locationData) {
      return res.status(404).json({ message: 'Location data not found for the specified location' });
    }
    
    // Get solar panel data
    const solarPanel = await SolarPanel.findById(solarPanelId);
    if (!solarPanel) {
      return res.status(404).json({ message: 'Solar panel not found' });
    }
    
    // Calculate PVOUT using the mathematical model
    let annualPvout = modelCoeff.beta0; // Start with intercept
    
    // Add variable contributions using dynamic coefficients
    modelCoeff.coefficients.forEach(coeff => {
      const locationVariable = locationData.variables.find(v => 
        v.variableId._id.toString() === coeff.variableId.toString()
      );
      if (locationVariable) {
        annualPvout += coeff.value * locationVariable.value;
      }
    });
    
    // Convert annual PVOUT to different time periods
    const dailyPvout = annualPvout / 365;
    const monthlyPvout = annualPvout / 12;
    
    // Calculate energy production using panel area and efficiency
    const efficiency = solarPanel.efficiency / 100;
    const area = parseFloat(panelArea);
    
    const dailyEnergyProduction = dailyPvout * area * efficiency;
    const monthlyEnergyProduction = monthlyPvout * area * efficiency;
    const annualEnergyProduction = annualPvout * area * efficiency;
    
    // Calculate basic financial values using a simple rate for display
    const baseElectricityRate = 25; // Simple rate for basic calculation display
    const dailyEarnings = dailyEnergyProduction * baseElectricityRate;
    const monthlyEarnings = monthlyEnergyProduction * baseElectricityRate;
    const annualEarnings = annualEnergyProduction * baseElectricityRate;
    
    // Save calculation record
    const calculation = new Calculation({
      location: { province, district, city },
      solarPanelId,
      numberOfPanels: 1, // Not used anymore, but kept for compatibility
      pvout: annualPvout,
      dailyEnergyProduction,
      monthlyEnergyProduction,
      monthlyEarnings,
      electricityRate: baseElectricityRate,
      modelCoefficients: {
        beta0: modelCoeff.beta0,
        epsilon: modelCoeff.epsilon
      },
      variables: locationData.variables.map(v => ({
        variableId: v.variableId._id,
        name: v.variableId.name,
        value: v.value,
        unit: v.variableId.unit
      }))
    });
    
    await calculation.save();
    
    res.json({
      pvout: {
        daily: dailyPvout.toFixed(3),
        monthly: monthlyPvout.toFixed(2),
        annual: annualPvout.toFixed(2)
      },
      absorbedEnergy: {
        daily: dailyEnergyProduction.toFixed(3),
        monthly: monthlyEnergyProduction.toFixed(2),
        annual: annualEnergyProduction.toFixed(2)
      },
      earnings: {
        daily: dailyEarnings.toFixed(2),
        monthly: monthlyEarnings.toFixed(2),
        annual: annualEarnings.toFixed(2)
      },
      electricityRate: baseElectricityRate,
      solarPanel: {
        ...solarPanel.toObject(),
        _id: solarPanel._id,
        name: solarPanel.name,
        efficiency: solarPanel.efficiency,
        costPerSqm: solarPanel.costPerSqm
      },
      location: { province, district, city },
      panelArea: area,
      calculationId: calculation._id
    });
  } catch (error) {
    console.error('Calculation error:', error);
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

// Get calculation by ID
router.get('/:id', async (req, res) => {
  try {
    const calculation = await Calculation.findById(req.params.id)
      .populate('solarPanelId')
      .populate('variables.variableId');
    
    if (!calculation) {
      return res.status(404).json({ message: 'Calculation not found' });
    }
    
    res.json(calculation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Calculate tiered electricity bill
router.post('/calculate-tiered-bill', async (req, res) => {
  try {
    const { units } = req.body;
    
    if (!units || units <= 0) {
      return res.status(400).json({ message: 'Valid units required' });
    }

    const rates = await ElectricityRate.find({ isActive: true }).sort({ fromUnits: 1 });
    
    if (rates.length === 0) {
      return res.status(404).json({ message: 'No electricity rates configured' });
    }
    
    let totalBill = 0;
    let remainingUnits = parseFloat(units);
    let billBreakdown = [];
    
    for (const rate of rates) {
      if (remainingUnits <= 0) break;
      
      const tierMax = rate.toUnits === 999999 ? remainingUnits : rate.toUnits;
      const tierUnits = Math.min(remainingUnits, tierMax - rate.fromUnits + 1);
      
      if (tierUnits > 0) {
        const tierCost = tierUnits * rate.ratePerKwh;
        totalBill += tierCost;
        billBreakdown.push({
          tier: `${rate.fromUnits}-${rate.toUnits === 999999 ? '∞' : rate.toUnits}`,
          units: tierUnits,
          rate: rate.ratePerKwh,
          cost: tierCost,
          description: rate.description
        });
        remainingUnits -= tierUnits;
      }
    }
    
    res.json({
      units: parseFloat(units),
      totalBill: totalBill.toFixed(2),
      averageRate: (totalBill / parseFloat(units)).toFixed(2),
      breakdown: billBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;