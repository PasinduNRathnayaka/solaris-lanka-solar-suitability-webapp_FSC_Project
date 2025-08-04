// routes/electricityRates.js
const express = require('express');
const router = express.Router();
const ElectricityRate = require('../models/ElectricityRate');

// Get all active electricity rates
router.get('/', async (req, res) => {
  try {
    const rates = await ElectricityRate.find({ isActive: true }).sort({ fromUnits: 1 });
    res.json(rates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new electricity rate
router.post('/', async (req, res) => {
  try {
    const { fromUnits, toUnits, ratePerKwh, description } = req.body;
    
    // Validate required fields
    if (fromUnits === undefined || toUnits === undefined || !ratePerKwh) {
      return res.status(400).json({ 
        message: 'fromUnits, toUnits, and ratePerKwh are required' 
      });
    }

    // Validate logical range
    if (fromUnits >= toUnits) {
      return res.status(400).json({ 
        message: 'fromUnits must be less than toUnits' 
      });
    }

    const electricityRate = new ElectricityRate({
      fromUnits: parseInt(fromUnits),
      toUnits: parseInt(toUnits),
      ratePerKwh: parseFloat(ratePerKwh),
      description: description || ''
    });
    
    await electricityRate.save();
    res.status(201).json(electricityRate);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This tier range already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Update electricity rate
router.put('/:id', async (req, res) => {
  try {
    const { fromUnits, toUnits, ratePerKwh, description } = req.body;
    
    // Validate required fields
    if (fromUnits === undefined || toUnits === undefined || !ratePerKwh) {
      return res.status(400).json({ 
        message: 'fromUnits, toUnits, and ratePerKwh are required' 
      });
    }

    // Validate logical range
    if (fromUnits >= toUnits) {
      return res.status(400).json({ 
        message: 'fromUnits must be less than toUnits' 
      });
    }

    const electricityRate = await ElectricityRate.findByIdAndUpdate(
      req.params.id,
      {
        fromUnits: parseInt(fromUnits),
        toUnits: parseInt(toUnits),
        ratePerKwh: parseFloat(ratePerKwh),
        description: description || '',
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!electricityRate) {
      return res.status(404).json({ message: 'Electricity rate not found' });
    }

    res.json(electricityRate);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This tier range already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Delete electricity rate (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const electricityRate = await ElectricityRate.findByIdAndUpdate(
      req.params.id, 
      { isActive: false },
      { new: true }
    );

    if (!electricityRate) {
      return res.status(404).json({ message: 'Electricity rate not found' });
    }

    res.json({ message: 'Electricity rate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Calculate bill for given units
router.post('/calculate-bill', async (req, res) => {
  try {
    const { units } = req.body;
    
    if (!units || units <= 0) {
      return res.status(400).json({ message: 'Valid units required' });
    }

    const rates = await ElectricityRate.find({ isActive: true }).sort({ fromUnits: 1 });
    
    let totalBill = 0;
    let remainingUnits = parseFloat(units);
    let billBreakdown = [];
    
    for (const rate of rates) {
      if (remainingUnits <= 0) break;
      
      const tierMax = rate.toUnits === 999999 ? remainingUnits : rate.toUnits;
      const tierUnits = Math.min(remainingUnits, tierMax - rate.fromUnits + 1);
      
      if (tierUnits > 0) {
        const tierCost = tierUnits * rate.ratePerKwh;
        totalBill += tierCost;
        billBreakdown.push({
          tier: `${rate.fromUnits}-${rate.toUnits === 999999 ? '∞' : rate.toUnits}`,
          units: tierUnits,
          rate: rate.ratePerKwh,
          cost: tierCost,
          description: rate.description
        });
        remainingUnits -= tierUnits;
      }
    }
    
    res.json({
      units: parseFloat(units),
      totalBill: totalBill.toFixed(2),
      averageRate: (totalBill / parseFloat(units)).toFixed(2),
      breakdown: billBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
