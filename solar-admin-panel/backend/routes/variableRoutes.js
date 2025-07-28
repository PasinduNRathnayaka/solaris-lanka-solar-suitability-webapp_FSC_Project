// routes/variableRoutes.js
const express = require('express');
const { Variable } = require('../models');
const router = express.Router();

// Get all variables
router.get('/', async (req, res) => {
  try {
    const variables = await Variable.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(variables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching variables', error: error.message });
  }
});

// Create new variable
router.post('/', async (req, res) => {
  try {
    const { name, unit, description, order } = req.body;
    
    if (!name || !unit || !description) {
      return res.status(400).json({ message: 'Name, unit, and description are required' });
    }
    
    const variable = new Variable({ name, unit, description, order });
    await variable.save();
    
    res.status(201).json(variable);
  } catch (error) {
    res.status(500).json({ message: 'Error creating variable', error: error.message });
  }
});

// Update variable
router.put('/:id', async (req, res) => {
  try {
    const variable = await Variable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!variable) {
      return res.status(404).json({ message: 'Variable not found' });
    }
    
    res.json(variable);
  } catch (error) {
    res.status(500).json({ message: 'Error updating variable', error: error.message });
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
    res.status(500).json({ message: 'Error deleting variable', error: error.message });
  }
});

module.exports = router;

