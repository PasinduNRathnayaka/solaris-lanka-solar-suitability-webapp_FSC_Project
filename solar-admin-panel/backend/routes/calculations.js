// routes/calculations.js
const express = require('express');
const router = express.Router();
const Calculation = require('../models/Calculation');
const ModelCoefficients = require('../models/ModelCoefficients');
const SolarPanel = require('../models/SolarPanel');
const LocationData = require('../models/LocationData');

// Enhanced calculation with solar plans analysis
router.post('/calculate', async (req, res) => {
  try {
    const { 
      province, 
      district, 
      city, 
      solarPanelId, 
      panelArea,
      monthlyElectricityUnits = 0
    } = req.body;
    
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
    
    // Calculate PVOUT using the dynamic model
    let pvout = modelCoeff.beta0;
    
    // Add variable contributions using dynamic coefficients
    modelCoeff.coefficients.forEach(coeff => {
      const locationVariable = locationData.variables.find(v => 
        v.variableId._id.toString() === coeff.variableId.toString()
      );
      if (locationVariable) {
        pvout += coeff.value * locationVariable.value;
      }
    });
    
    // Convert annual PVOUT to different time periods
    const dailyPvout = pvout / 365;
    const monthlyPvout = pvout / 12;
    
    // Calculate energy production using panel area and efficiency
    const efficiency = solarPanel.efficiency / 100;
    const area = parseFloat(panelArea);
    
    const dailyEnergyProduction = dailyPvout * area * efficiency;
    const monthlyEnergyProduction = monthlyPvout * area * efficiency;
    const annualEnergyProduction = pvout * area * efficiency;
    
    // Calculate basic earnings
    const electricityRate = locationData.electricityRate || 25;
    const dailyEarnings = dailyEnergyProduction * electricityRate;
    const monthlyEarnings = monthlyEnergyProduction * electricityRate;
    const annualEarnings = annualEnergyProduction * electricityRate;
    
    // Calculate installation cost
    const numberOfPanels = Math.ceil(area / solarPanel.area);
    const totalPowerOutput = numberOfPanels * solarPanel.maxPowerOutput;
    const equipmentCost = totalPowerOutput * solarPanel.pricePerWatt;
    const installationCost = equipmentCost * 1.3; // Including installation, permits, misc
    
    // Solar plans analysis (if monthly consumption provided)
    let solarPlansAnalysis = null;
    if (monthlyElectricityUnits > 0) {
      const monthlyConsumption = parseFloat(monthlyElectricityUnits);
      const CEB_RATE_DOMESTIC = 25; // LKR per kWh
      const EXPORT_RATE = 22; // LKR per kWh
      const NET_PLUS_EXPORT_RATE = 24; // Slightly higher for Net Plus
      
      solarPlansAnalysis = {
        netMetering: calculateNetMeteringBenefits(monthlyEnergyProduction, monthlyConsumption, CEB_RATE_DOMESTIC),
        netAccounting: calculateNetAccountingBenefits(monthlyEnergyProduction, monthlyConsumption, CEB_RATE_DOMESTIC, EXPORT_RATE),
        netPlus: calculateNetPlusBenefits(monthlyEnergyProduction, monthlyConsumption, CEB_RATE_DOMESTIC, NET_PLUS_EXPORT_RATE)
      };
      
      // Add payback periods
      Object.keys(solarPlansAnalysis).forEach(plan => {
        const monthlyBenefit = parseFloat(solarPlansAnalysis[plan].netBenefit);
        if (monthlyBenefit > 0) {
          const paybackMonths = installationCost / monthlyBenefit;
          solarPlansAnalysis[plan].paybackPeriod = {
            months: Math.ceil(paybackMonths),
            years: Math.floor(paybackMonths / 12),
            remainingMonths: Math.ceil(paybackMonths % 12)
          };
        } else {
          solarPlansAnalysis[plan].paybackPeriod = null;
        }
      });
    }
    
    // Save calculation
    const calculation = new Calculation({
      location: { province, district, city },
      solarPanelId,
      numberOfPanels: 1,
      pvout,
      dailyEnergyProduction,
      monthlyEnergyProduction: monthlyEnergyProduction,
      monthlyEarnings,
      electricityRate,
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
        annual: pvout.toFixed(2)
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
      installation: {
        numberOfPanels,
        totalPowerOutput,
        equipmentCost: equipmentCost.toFixed(2),
        totalCost: installationCost.toFixed(2),
        costPerSqm: (installationCost / area).toFixed(2),
        costPerWatt: (installationCost / totalPowerOutput).toFixed(2)
      },
      solarPlans: solarPlansAnalysis,
      electricityRate,
      solarPanel: {
        ...solarPanel.toObject(),
        area: solarPanel.area,
        pricePerSqm: solarPanel.pricePerSqm
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

// Helper functions for solar plan calculations
function calculateNetMeteringBenefits(monthlyGeneration, monthlyConsumption, cebRate) {
  const selfConsumed = Math.min(monthlyGeneration, monthlyConsumption);
  const monthlySavings = selfConsumed * cebRate;
  
  return {
    monthlySavings: monthlySavings.toFixed(2),
    monthlyRevenue: '0.00',
    netBenefit: monthlySavings.toFixed(2),
    annualBenefit: (monthlySavings * 12).toFixed(2),
    description: 'Use solar first, excess carries forward'
  };
}

function calculateNetAccountingBenefits(monthlyGeneration, monthlyConsumption, cebRate, exportRate) {
  const selfConsumed = Math.min(monthlyGeneration, monthlyConsumption);
  const excess = Math.max(0, monthlyGeneration - monthlyConsumption);
  
  const monthlySavings = selfConsumed * cebRate;
  const monthlyRevenue = excess * exportRate;
  const netBenefit = monthlySavings + monthlyRevenue;
  
  return {
    monthlySavings: monthlySavings.toFixed(2),
    monthlyRevenue: monthlyRevenue.toFixed(2),
    netBenefit: netBenefit.toFixed(2),
    annualBenefit: (netBenefit * 12).toFixed(2),
    description: 'Use solar first, sell excess to grid'
  };
}

function calculateNetPlusBenefits(monthlyGeneration, monthlyConsumption, cebRate, exportRate) {
  const monthlyRevenue = monthlyGeneration * exportRate;
  const electricityCost = monthlyConsumption * cebRate;
  const netBenefit = monthlyRevenue - electricityCost;
  
  return {
    monthlySavings: '0.00',
    monthlyRevenue: monthlyRevenue.toFixed(2),
    electricityCost: electricityCost.toFixed(2),
    netBenefit: netBenefit.toFixed(2),
    annualBenefit: (netBenefit * 12).toFixed(2),
    description: 'Sell all solar power, buy all consumption from grid'
  };
}

// Get cost estimation for installation
router.post('/cost-estimation', async (req, res) => {
  try {
    const { solarPanelId, area } = req.body;
    
    if (!solarPanelId || !area) {
      return res.status(400).json({ 
        message: 'Solar panel ID and area are required' 
      });
    }

    const solarPanel = await SolarPanel.findById(solarPanelId);
    if (!solarPanel) {
      return res.status(404).json({ message: 'Solar panel not found' });
    }

    const panelArea = solarPanel.area;
    const numberOfPanels = Math.ceil(parseFloat(area) / panelArea);
    const totalPowerOutput = numberOfPanels * solarPanel.maxPowerOutput;
    const equipmentCost = totalPowerOutput * solarPanel.pricePerWatt;
    
    // Additional costs breakdown
    const installationCost = equipmentCost * 0.15; // 15% of equipment cost
    const permitsAndInspection = equipmentCost * 0.05; // 5% of equipment cost
    const miscellaneous = equipmentCost * 0.10; // 10% of equipment cost
    
    const totalCost = equipmentCost + installationCost + permitsAndInspection + miscellaneous;

    res.json({
      solarPanel: {
        ...solarPanel.toObject(),
        area: solarPanel.area,
        pricePerSqm: solarPanel.pricePerSqm
      },
      estimation: {
        numberOfPanels,
        totalPowerOutput,
        totalArea: numberOfPanels * panelArea,
        costs: {
          equipment: equipmentCost.toFixed(2),
          installation: installationCost.toFixed(2),
          permits: permitsAndInspection.toFixed(2),
          miscellaneous: miscellaneous.toFixed(2),
          total: totalCost.toFixed(2)
        },
        costPerSqm: (totalCost / parseFloat(area)).toFixed(2),
        costPerWatt: (totalCost / totalPowerOutput).toFixed(2)
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

module.exports = router;