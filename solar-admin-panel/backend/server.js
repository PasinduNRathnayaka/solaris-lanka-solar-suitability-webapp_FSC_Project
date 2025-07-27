const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://test1:solar12345@cluster0.fp8iwqo.mongodb.net/solar_admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Schemas
const modelCoefficientSchema = new mongoose.Schema({
  beta0: { type: Number, default: 2.5 },
  beta1: { type: Number, default: 0.8 },
  beta2: { type: Number, default: -0.3 },
  beta3: { type: Number, default: 0.6 },
  beta4: { type: Number, default: 0.4 },
  epsilon: { type: Number, default: 0.1 },
  updatedAt: { type: Date, default: Date.now }
});

const variableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const locationVariableSchema = new mongoose.Schema({
  province: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  variables: [{
    variableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Variable' },
    value: { type: Number, required: true }
  }],
  updatedAt: { type: Date, default: Date.now }
});

const solarPanelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  wattage: { type: Number, required: true },
  efficiency: { type: Number, required: true }, // Percentage of PVOUT that can be absorbed
  area: { type: Number, required: true }, // Panel area in m²
  cost: { type: Number, required: true },
  manufacturer: { type: String },
  warranty: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const electricityPriceSchema = new mongoose.Schema({
  pricePerUnit: { type: Number, required: true }, // Price per kWh
  currency: { type: String, default: 'LKR' },
  updatedAt: { type: Date, default: Date.now }
});

const calculationRecordSchema = new mongoose.Schema({
  location: {
    province: String,
    district: String,
    city: String
  },
  modelCoefficients: modelCoefficientSchema,
  variables: [variableSchema],
  locationVariables: Object,
  solarPanel: {
    panelId: { type: mongoose.Schema.Types.ObjectId, ref: 'SolarPanel' },
    panelDetails: Object
  },
  calculatedPVOUT: Number,
  absorbedEnergy: Number, // Energy absorbed by solar panel per day
  monthlyEarnings: Number,
  electricityPrice: Number,
  timestamp: { type: Date, default: Date.now }
});

// Models
const ModelCoefficient = mongoose.model('ModelCoefficient', modelCoefficientSchema);
const Variable = mongoose.model('Variable', variableSchema);
const LocationVariable = mongoose.model('LocationVariable', locationVariableSchema);
const SolarPanel = mongoose.model('SolarPanel', solarPanelSchema);
const ElectricityPrice = mongoose.model('ElectricityPrice', electricityPriceSchema);
const CalculationRecord = mongoose.model('CalculationRecord', calculationRecordSchema);

// Routes

// Model Coefficients
app.get('/api/model-coefficients', async (req, res) => {
  try {
    let coefficients = await ModelCoefficient.findOne().sort({ updatedAt: -1 });
    if (!coefficients) {
      coefficients = new ModelCoefficient();
      await coefficients.save();
    }
    res.json(coefficients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/model-coefficients', async (req, res) => {
  try {
    const coefficients = new ModelCoefficient(req.body);
    await coefficients.save();
    res.json(coefficients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Variables
app.get('/api/variables', async (req, res) => {
  try {
    const variables = await Variable.find().sort({ createdAt: -1 });
    res.json(variables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/variables', async (req, res) => {
  try {
    const variable = new Variable(req.body);
    await variable.save();
    res.status(201).json(variable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/variables/:id', async (req, res) => {
  try {
    const variable = await Variable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(variable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/variables/:id', async (req, res) => {
  try {
    await Variable.findByIdAndDelete(req.params.id);
    res.json({ message: 'Variable deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Location Variables
app.get('/api/location-variables', async (req, res) => {
  try {
    const { province, district, city } = req.query;
    const locationVariables = await LocationVariable.findOne({
      province,
      district,
      city
    }).populate('variables.variableId');
    res.json(locationVariables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/location-variables', async (req, res) => {
  try {
    const { province, district, city, variables } = req.body;
    
    let locationVariables = await LocationVariable.findOne({
      province,
      district,
      city
    });

    if (locationVariables) {
      locationVariables.variables = variables;
      locationVariables.updatedAt = new Date();
    } else {
      locationVariables = new LocationVariable({
        province,
        district,
        city,
        variables
      });
    }

    await locationVariables.save();
    res.json(locationVariables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Solar Panels
app.get('/api/solar-panels', async (req, res) => {
  try {
    const panels = await SolarPanel.find().sort({ createdAt: -1 });
    res.json(panels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/solar-panels', async (req, res) => {
  try {
    const panel = new SolarPanel(req.body);
    await panel.save();
    res.status(201).json(panel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/solar-panels/:id', async (req, res) => {
  try {
    const panel = await SolarPanel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(panel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/solar-panels/:id', async (req, res) => {
  try {
    await SolarPanel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Solar panel deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Electricity Price
app.get('/api/electricity-price', async (req, res) => {
  try {
    let price = await ElectricityPrice.findOne().sort({ updatedAt: -1 });
    if (!price) {
      price = new ElectricityPrice({ pricePerUnit: 25 }); // Default price
      await price.save();
    }
    res.json(price);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/electricity-price', async (req, res) => {
  try {
    const price = new ElectricityPrice(req.body);
    await price.save();
    res.json(price);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate PVOUT
app.post('/api/calculate-pvout', async (req, res) => {
  try {
    const { province, district, city, panelId } = req.body;

    // Get model coefficients
    const coefficients = await ModelCoefficient.findOne().sort({ updatedAt: -1 });
    
    // Get location variables
    const locationVars = await LocationVariable.findOne({
      province,
      district,
      city
    }).populate('variables.variableId');

    // Get solar panel details
    const solarPanel = await SolarPanel.findById(panelId);

    // Get electricity price
    const electricityPrice = await ElectricityPrice.findOne().sort({ updatedAt: -1 });

    if (!coefficients || !locationVars || !solarPanel || !electricityPrice) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    // Calculate PVOUT using the model
    const { beta0, beta1, beta2, beta3, beta4, epsilon } = coefficients;
    let pvout = beta0 + epsilon;

    // Add variable contributions
    locationVars.variables.forEach((variable, index) => {
      const betaKey = `beta${index + 1}`;
      if (coefficients[betaKey] !== undefined) {
        pvout += coefficients[betaKey] * variable.value;
      }
    });

    // Calculate absorbed energy considering panel efficiency and area
    const absorbedEnergy = (pvout * solarPanel.efficiency / 100) * solarPanel.area;

    // Calculate monthly earnings
    const monthlyEarnings = absorbedEnergy * electricityPrice.pricePerUnit * 30;

    // Save calculation record
    const record = new CalculationRecord({
      location: { province, district, city },
      modelCoefficients: coefficients.toObject(),
      variables: await Variable.find(),
      locationVariables: locationVars.variables,
      solarPanel: {
        panelId: solarPanel._id,
        panelDetails: solarPanel.toObject()
      },
      calculatedPVOUT: pvout,
      absorbedEnergy,
      monthlyEarnings,
      electricityPrice: electricityPrice.pricePerUnit
    });

    await record.save();

    res.json({
      pvout: pvout.toFixed(3),
      absorbedEnergy: absorbedEnergy.toFixed(3),
      monthlyEarnings: monthlyEarnings.toFixed(2),
      solarPanel: solarPanel,
      electricityPrice: electricityPrice.pricePerUnit,
      recordId: record._id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculation Records
app.get('/api/calculation-records', async (req, res) => {
  try {
    const records = await CalculationRecord.find()
      .populate('solarPanel.panelId')
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/calculation-records/:id', async (req, res) => {
  try {
    await CalculationRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const totalCalculations = await CalculationRecord.countDocuments();
    const totalVariables = await Variable.countDocuments();
    const totalPanels = await SolarPanel.countDocuments();
    const totalLocations = await LocationVariable.countDocuments();

    // Get recent calculations for trends
    const recentCalculations = await CalculationRecord.find()
      .sort({ timestamp: -1 })
      .limit(10);

    const avgPVOUT = recentCalculations.length > 0 
      ? recentCalculations.reduce((sum, calc) => sum + calc.calculatedPVOUT, 0) / recentCalculations.length
      : 0;

    const avgMonthlyEarnings = recentCalculations.length > 0
      ? recentCalculations.reduce((sum, calc) => sum + calc.monthlyEarnings, 0) / recentCalculations.length
      : 0;

    res.json({
      totalCalculations,
      totalVariables,
      totalPanels,
      totalLocations,
      avgPVOUT: avgPVOUT.toFixed(3),
      avgMonthlyEarnings: avgMonthlyEarnings.toFixed(2),
      recentCalculations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize default data
app.post('/api/initialize', async (req, res) => {
  try {
    // Create default variables if they don't exist
    const variableCount = await Variable.countDocuments();
    if (variableCount === 0) {
      const defaultVariables = [
        { name: 'Solar Irradiance', unit: 'kWh/m²/day', description: 'Average daily solar irradiance' },
        { name: 'Temperature', unit: '°C', description: 'Average ambient temperature' },
        { name: 'Humidity', unit: '%', description: 'Relative humidity percentage' },
        { name: 'Cloud Cover', unit: '%', description: 'Average cloud cover percentage' }
      ];
      
      await Variable.insertMany(defaultVariables);
    }

    // Create default model coefficients
    const coefficientCount = await ModelCoefficient.countDocuments();
    if (coefficientCount === 0) {
      const defaultCoefficients = new ModelCoefficient();
      await defaultCoefficients.save();
    }

    // Create default electricity price
    const priceCount = await ElectricityPrice.countDocuments();
    if (priceCount === 0) {
      const defaultPrice = new ElectricityPrice({ pricePerUnit: 25 });
      await defaultPrice.save();
    }

    res.json({ message: 'Default data initialized successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});