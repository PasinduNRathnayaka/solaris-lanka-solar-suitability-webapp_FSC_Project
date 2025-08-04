// Updated routes/solarPanels.js
const express = require('express');
const router = express.Router();
const SolarPanel = require('../models/SolarPanel');

// Get all active solar panels
router.get('/', async (req, res) => {
  try {
    const solarPanels = await SolarPanel.find({ isActive: true });
    res.json(solarPanels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single solar panel by ID
router.get('/:id', async (req, res) => {
  try {
    const solarPanel = await SolarPanel.findById(req.params.id);
    if (!solarPanel) {
      return res.status(404).json({ message: 'Solar panel not found' });
    }
    res.json(solarPanel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new solar panel
router.post('/', async (req, res) => {
  try {
    const { name, efficiency, costPerSqm } = req.body;
    
    // Validate required fields
    if (!name || !efficiency || !costPerSqm) {
      return res.status(400).json({ 
        message: 'Panel name, efficiency, and cost per m² are required' 
      });
    }

    // Validate efficiency range
    if (efficiency < 0 || efficiency > 100) {
      return res.status(400).json({ 
        message: 'Efficiency must be between 0 and 100' 
      });
    }

    // Validate cost
    if (costPerSqm <= 0) {
      return res.status(400).json({ 
        message: 'Cost per m² must be greater than 0' 
      });
    }

    const solarPanel = new SolarPanel({
      name: name.trim(),
      efficiency: parseFloat(efficiency),
      costPerSqm: parseFloat(costPerSqm)
    });
    
    await solarPanel.save();
    res.status(201).json(solarPanel);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// Update solar panel
router.put('/:id', async (req, res) => {
  try {
    const { name, efficiency, costPerSqm } = req.body;
    
    // Validate required fields
    if (!name || !efficiency || !costPerSqm) {
      return res.status(400).json({ 
        message: 'Panel name, efficiency, and cost per m² are required' 
      });
    }

    // Validate efficiency range
    if (efficiency < 0 || efficiency > 100) {
      return res.status(400).json({ 
        message: 'Efficiency must be between 0 and 100' 
      });
    }

    // Validate cost
    if (costPerSqm <= 0) {
      return res.status(400).json({ 
        message: 'Cost per m² must be greater than 0' 
      });
    }

    const solarPanel = await SolarPanel.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        efficiency: parseFloat(efficiency),
        costPerSqm: parseFloat(costPerSqm),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!solarPanel) {
      return res.status(404).json({ message: 'Solar panel not found' });
    }

    res.json(solarPanel);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// Delete solar panel (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const solarPanel = await SolarPanel.findByIdAndUpdate(
      req.params.id, 
      { isActive: false },
      { new: true }
    );

    if (!solarPanel) {
      return res.status(404).json({ message: 'Solar panel not found' });
    }

    res.json({ message: 'Solar panel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
