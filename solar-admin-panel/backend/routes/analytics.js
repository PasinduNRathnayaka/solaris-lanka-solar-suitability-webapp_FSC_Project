const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const Location = require('../models/Location');
const Variable = require('../models/Variable');

// Get analytics data
router.get('/', async (req, res) => {
  try {
    let analytics = await Analytics.findOne();
    
    if (!analytics) {
      // Create default analytics if they don't exist
      analytics = new Analytics();
      await analytics.save();
    }
    
    // Update real-time data
    const activeLocations = await Location.countDocuments({ isActive: true });
    const activeVariables = await Variable.countDocuments({ isActive: true });
    
    analytics.activeLocations = activeLocations;
    analytics.lastUpdated = new Date();
    
    await analytics.save();
    
    // Add computed data
    const analyticsData = {
      ...analytics.toObject(),
      activeVariables,
      coveredCities: activeLocations
    };
    
    res.json(analyticsData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update analytics
router.put('/', async (req, res) => {
  try {
    const updates = req.body;
    
    let analytics = await Analytics.findOne();
    
    if (!analytics) {
      analytics = new Analytics();
    }
    
    Object.keys(updates).forEach(key => {
      if (analytics.schema.paths[key]) {
        analytics[key] = updates[key];
      }
    });
    
    analytics.lastUpdated = new Date();
    await analytics.save();
    
    res.json(analytics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Increment calculation count
router.post('/increment-calculation', async (req, res) => {
  try {
    let analytics = await Analytics.findOne();
    
    if (!analytics) {
      analytics = new Analytics();
    }
    
    analytics.totalCalculations += 1;
    analytics.monthlyCalculations += 1;
    analytics.lastUpdated = new Date();
    
    await analytics.save();
    
    res.json({ message: 'Calculation count updated' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;