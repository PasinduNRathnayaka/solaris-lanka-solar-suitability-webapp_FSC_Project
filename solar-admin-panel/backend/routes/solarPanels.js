// routes/solarPanels.js
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

// Create new solar panel
router.post('/', async (req, res) => {
  try {
    const solarPanel = new SolarPanel(req.body);
    await solarPanel.save();
    res.status(201).json(solarPanel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update solar panel
router.put('/:id', async (req, res) => {
  try {
    const solarPanel = await SolarPanel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(solarPanel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete solar panel (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await SolarPanel.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Solar panel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;