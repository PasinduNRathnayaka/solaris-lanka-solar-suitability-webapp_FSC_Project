const express = require('express');
const router = express.Router();
const Variable = require('../models/Variable');

// Get all variables
router.get('/', async (req, res) => {
  try {
    const variables = await Variable.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(variables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new variable
router.post('/', async (req, res) => {
  try {
    const { name, unit, description } = req.body;
    
    const variable = new Variable({
      name,
      unit,
      description
    });
    
    await variable.save();
    res.status(201).json(variable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update variable
router.put('/:id', async (req, res) => {
  try {
    const { name, unit, description } = req.body;
    
    const variable = await Variable.findByIdAndUpdate(
      req.params.id,
      { name, unit, description },
      { new: true }
    );
    
    if (!variable) {
      return res.status(404).json({ message: 'Variable not found' });
    }
    
    res.json(variable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete variable
router.delete('/:id', async (req, res) => {
  try {
    const variable = await Variable.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!variable) {
      return res.status(404).json({ message: 'Variable not found' });
    }
    
    res.json({ message: 'Variable deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;