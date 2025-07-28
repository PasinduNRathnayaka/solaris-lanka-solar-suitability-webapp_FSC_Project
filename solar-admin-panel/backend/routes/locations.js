// routes/locations.js
const express = require('express');
const router = express.Router();
const LocationData = require('../models/LocationData');

// Get location data
router.get('/:province/:district/:city', async (req, res) => {
  try {
    const { province, district, city } = req.params;
    const locationData = await LocationData.findOne({ province, district, city })
      .populate('variables.variableId');
    
    res.json(locationData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update location data
router.post('/', async (req, res) => {
  try {
    const { province, district, city, variables, electricityRate } = req.body;
    
    let locationData = await LocationData.findOne({ province, district, city });
    
    if (locationData) {
      locationData.variables = variables;
      locationData.electricityRate = electricityRate;
      locationData.updatedAt = new Date();
    } else {
      locationData = new LocationData({
        province,
        district,
        city,
        variables,
        electricityRate
      });
    }
    
    await locationData.save();
    res.json(locationData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await LocationData.find().populate('variables.variableId');
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;