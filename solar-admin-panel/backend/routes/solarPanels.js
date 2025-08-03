// routes/solarPanels.js
const express = require('express');
const router = express.Router();
const SolarPanel = require('../models/SolarPanel');

// Get all active solar panels with calculated fields
router.get('/', async (req, res) => {
  try {
    const solarPanels = await SolarPanel.find({ isActive: true });
    
    // Transform data to include calculated fields
    const panelsWithCalculatedFields = solarPanels.map(panel => ({
      ...panel.toObject(),
      area: panel.area,
      pricePerSqm: panel.pricePerSqm
    }));
    
    res.json(panelsWithCalculatedFields);
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
    
    res.json({
      ...solarPanel.toObject(),
      area: solarPanel.area,
      pricePerSqm: solarPanel.pricePerSqm
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new solar panel
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      efficiency, 
      pricePerWatt = 150,
      warrantyYears = 25,
      manufacturer = '',
      technology = 'Monocrystalline',
      maxPowerOutput = 400,
      dimensions = { length: 2, width: 1, thickness: 0.04 },
      weight = 20,
      temperatureCoefficient = -0.4
    } = req.body;
    
    // Validate required fields
    if (!name || !efficiency) {
      return res.status(400).json({ 
        message: 'Panel name and efficiency are required' 
      });
    }

    // Validate efficiency range
    if (efficiency < 0 || efficiency > 100) {
      return res.status(400).json({ 
        message: 'Efficiency must be between 0 and 100' 
      });
    }

    const solarPanel = new SolarPanel({
      name: name.trim(),
      efficiency: parseFloat(efficiency),
      pricePerWatt: parseFloat(pricePerWatt),
      warrantyYears: parseInt(warrantyYears),
      manufacturer: manufacturer.trim(),
      technology,
      maxPowerOutput: parseFloat(maxPowerOutput),
      dimensions: {
        length: parseFloat(dimensions.length || 2),
        width: parseFloat(dimensions.width || 1),
        thickness: parseFloat(dimensions.thickness || 0.04)
      },
      weight: parseFloat(weight),
      temperatureCoefficient: parseFloat(temperatureCoefficient)
    });
    
    await solarPanel.save();
    
    res.status(201).json({
      ...solarPanel.toObject(),
      area: solarPanel.area,
      pricePerSqm: solarPanel.pricePerSqm
    });
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
    const { 
      name, 
      efficiency, 
      pricePerWatt,
      warrantyYears,
      manufacturer,
      technology,
      maxPowerOutput,
      dimensions,
      weight,
      temperatureCoefficient
    } = req.body;
    
    // Validate required fields
    if (!name || !efficiency) {
      return res.status(400).json({ 
        message: 'Panel name and efficiency are required' 
      });
    }

    // Validate efficiency range
    if (efficiency < 0 || efficiency > 100) {
      return res.status(400).json({ 
        message: 'Efficiency must be between 0 and 100' 
      });
    }

    const updateData = {
      name: name.trim(),
      efficiency: parseFloat(efficiency),
      updatedAt: new Date()
    };

    // Add optional fields if provided
    if (pricePerWatt !== undefined) updateData.pricePerWatt = parseFloat(pricePerWatt);
    if (warrantyYears !== undefined) updateData.warrantyYears = parseInt(warrantyYears);
    if (manufacturer !== undefined) updateData.manufacturer = manufacturer.trim();
    if (technology !== undefined) updateData.technology = technology;
    if (maxPowerOutput !== undefined) updateData.maxPowerOutput = parseFloat(maxPowerOutput);
    if (weight !== undefined) updateData.weight = parseFloat(weight);
    if (temperatureCoefficient !== undefined) updateData.temperatureCoefficient = parseFloat(temperatureCoefficient);
    
    if (dimensions) {
      updateData.dimensions = {
        length: parseFloat(dimensions.length || 2),
        width: parseFloat(dimensions.width || 1),
        thickness: parseFloat(dimensions.thickness || 0.04)
      };
    }

    const solarPanel = await SolarPanel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!solarPanel) {
      return res.status(404).json({ message: 'Solar panel not found' });
    }

    res.json({
      ...solarPanel.toObject(),
      area: solarPanel.area,
      pricePerSqm: solarPanel.pricePerSqm
    });
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

// Get installation cost estimation
router.post('/cost-estimation', async (req, res) => {
  try {
    const { solarPanelId, area } = req.body;
    
    if (!solarPanelId || !area) {
      return res.status(400).json({ 
        message: 'Solar panel ID and area are required' 
      });
    }

    const solarPanel = await SolarPanel.findById(solarPanelId);
    if (!solarPanel) {
      return res.status(404).json({ message: 'Solar panel not found' });
    }

    const panelArea = solarPanel.area; // Area per panel
    const numberOfPanels = Math.ceil(parseFloat(area) / panelArea);
    const totalPowerOutput = numberOfPanels * solarPanel.maxPowerOutput;
    const equipmentCost = totalPowerOutput * solarPanel.pricePerWatt;
    
    // Additional costs (approximate percentages)
    const installationCost = equipmentCost * 0.15; // 15% of equipment cost
    const permitsAndInspection = equipmentCost * 0.05; // 5% of equipment cost
    const miscellaneous = equipmentCost * 0.10; // 10% of equipment cost
    
    const totalCost = equipmentCost + installationCost + permitsAndInspection + miscellaneous;

    res.json({
      solarPanel: {
        ...solarPanel.toObject(),
        area: solarPanel.area,
        pricePerSqm: solarPanel.pricePerSqm
      },
      estimation: {
        numberOfPanels,
        totalPowerOutput,
        totalArea: numberOfPanels * panelArea,
        costs: {
          equipment: equipmentCost,
          installation: installationCost,
          permits: permitsAndInspection,
          miscellaneous,
          total: totalCost
        },
        costPerSqm: totalCost / parseFloat(area),
        costPerWatt: totalCost / totalPowerOutput
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;