const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const Variable = require('../models/Variable');
const ModelCoefficient = require('../models/ModelCoefficient');

// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true })
      .populate('variables.variableId')
      .sort({ province: 1, district: 1, city: 1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get location by province, district, city
router.get('/:province/:district/:city', async (req, res) => {
  try {
    const { province, district, city } = req.params;
    
    const location = await Location.findOne({
      province,
      district,
      city,
      isActive: true
    }).populate('variables.variableId');
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update location data
router.post('/', async (req, res) => {
  try {
    const { province, district, city, variables } = req.body;
    
    // Calculate PVOUT
    const coefficients = await ModelCoefficient.findOne({ name: 'default' });
    let pvout = 0;
    
    if (coefficients && variables && variables.length >= 4) {
      const x1 = variables.find(v => v.variableId)?.value || 0; // Solar Irradiance
      const x2 = variables.find(v => v.variableId)?.value || 0; // Temperature
      const x3 = variables.find(v => v.variableId)?.value || 0; // Humidity
      const x4 = variables.find(v => v.variableId)?.value || 0; // Cloud Cover
      
      pvout = coefficients.beta0 + 
              (coefficients.beta1 * x1) + 
              (coefficients.beta2 * x2) + 
              (coefficients.beta3 * x3) + 
              (coefficients.beta4 * x4) + 
              coefficients.epsilon;
    }
    
    const location = await Location.findOneAndUpdate(
      { province, district, city },
      {
        province,
        district,
        city,
        variables,
        calculatedPVOUT: pvout,
        lastCalculated: new Date()
      },
      { upsert: true, new: true }
    ).populate('variables.variableId');
    
    res.json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete location
router.delete('/:id', async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;