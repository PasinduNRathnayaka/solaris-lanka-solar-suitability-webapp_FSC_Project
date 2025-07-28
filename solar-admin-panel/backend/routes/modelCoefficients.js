// routes/modelCoefficients.js
const express = require('express');
const router = express.Router();
const ModelCoefficients = require('../models/ModelCoefficients');

// Get active model coefficients
router.get('/', async (req, res) => {
  try {
    let coefficients = await ModelCoefficients.findOne({ isActive: true });
    
    // Create default if none exists
    if (!coefficients) {
      coefficients = new ModelCoefficients({});
      await coefficients.save();
    }
    
    res.json(coefficients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update model coefficients
router.put('/', async (req, res) => {
  try {
    const { beta0, beta1, beta2, beta3, beta4, epsilon } = req.body;
    
    let coefficients = await ModelCoefficients.findOne({ isActive: true });
    
    if (!coefficients) {
      coefficients = new ModelCoefficients();
    }
    
    coefficients.beta0 = beta0;
    coefficients.beta1 = beta1;
    coefficients.beta2 = beta2;
    coefficients.beta3 = beta3;
    coefficients.beta4 = beta4;
    coefficients.epsilon = epsilon;
    coefficients.updatedAt = new Date();
    
    await coefficients.save();
    res.json(coefficients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;