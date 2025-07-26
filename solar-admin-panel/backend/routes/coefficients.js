const express = require('express');
const router = express.Router();
const ModelCoefficient = require('../models/ModelCoefficient');

// Get current model coefficients
router.get('/', async (req, res) => {
  try {
    let coefficients = await ModelCoefficient.findOne({ name: 'default' });
    
    if (!coefficients) {
      // Create default coefficients if they don't exist
      coefficients = new ModelCoefficient({
        name: 'default',
        beta0: 2.5,
        beta1: 0.8,
        beta2: -0.3,
        beta3: 0.6,
        beta4: 0.4,
        epsilon: 0.1
      });
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
    
    let coefficients = await ModelCoefficient.findOne({ name: 'default' });
    
    if (!coefficients) {
      coefficients = new ModelCoefficient({ name: 'default' });
    }
    
    coefficients.beta0 = beta0;
    coefficients.beta1 = beta1;
    coefficients.beta2 = beta2;
    coefficients.beta3 = beta3;
    coefficients.beta4 = beta4;
    coefficients.epsilon = epsilon;
    
    await coefficients.save();
    
    res.json(coefficients);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;