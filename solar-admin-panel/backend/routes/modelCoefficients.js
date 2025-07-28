// routes/modelCoefficients.js
const express = require('express');
const router = express.Router();
const ModelCoefficients = require('../models/ModelCoefficients');
const Variable = require('../models/Variable');

// Get active model coefficients with variable data
router.get('/', async (req, res) => {
  try {
    // Get active variables
    const activeVariables = await Variable.find({ isActive: true });
    
    // Get active model coefficients
    let coefficients = await ModelCoefficients.findOne({ isActive: true });
    
    // Create default if none exists or sync with current variables
    if (!coefficients) {
      const defaultCoefficients = activeVariables.map((variable, index) => ({
        variableId: variable._id,
        variableName: variable.name,
        value: 0.5 // Default coefficient value
      }));
      
      coefficients = new ModelCoefficients({
        coefficients: defaultCoefficients
      });
      await coefficients.save();
    } else {
      // Sync coefficients with current active variables
      const currentVariableIds = activeVariables.map(v => v._id.toString());
      const existingVariableIds = coefficients.coefficients.map(c => c.variableId.toString());
      
      let needsUpdate = false;
      
      // Add new variables
      const newVariables = activeVariables.filter(v => 
        !existingVariableIds.includes(v._id.toString())
      );
      
      if (newVariables.length > 0) {
        newVariables.forEach(variable => {
          coefficients.coefficients.push({
            variableId: variable._id,
            variableName: variable.name,
            value: 0.5 // Default coefficient value
          });
        });
        needsUpdate = true;
      }
      
      // Remove inactive variables
      coefficients.coefficients = coefficients.coefficients.filter(c => 
        currentVariableIds.includes(c.variableId.toString())
      );
      
      // Update variable names if changed
      coefficients.coefficients.forEach(coeff => {
        const variable = activeVariables.find(v => v._id.toString() === coeff.variableId.toString());
        if (variable && coeff.variableName !== variable.name) {
          coeff.variableName = variable.name;
          needsUpdate = true;
        }
      });
      
      if (needsUpdate || coefficients.coefficients.length !== existingVariableIds.length) {
        coefficients.updatedAt = new Date();
        await coefficients.save();
      }
    }
    
    res.json({
      ...coefficients.toObject(),
      variables: activeVariables
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update model coefficients
router.put('/', async (req, res) => {
  try {
    const { beta0, coefficients: updatedCoefficients, epsilon } = req.body;
    
    let coefficients = await ModelCoefficients.findOne({ isActive: true });
    
    if (!coefficients) {
      coefficients = new ModelCoefficients();
    }
    
    coefficients.beta0 = beta0;
    coefficients.epsilon = epsilon;
    coefficients.updatedAt = new Date();
    
    // Update coefficient values
    if (updatedCoefficients && Array.isArray(updatedCoefficients)) {
      updatedCoefficients.forEach(updatedCoeff => {
        const existingCoeff = coefficients.coefficients.find(c => 
          c.variableId.toString() === updatedCoeff.variableId
        );
        if (existingCoeff) {
          existingCoeff.value = updatedCoeff.value;
        }
      });
    }
    
    await coefficients.save();
    
    // Return updated coefficients with variable data
    const activeVariables = await Variable.find({ isActive: true });
    res.json({
      ...coefficients.toObject(),
      variables: activeVariables
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;