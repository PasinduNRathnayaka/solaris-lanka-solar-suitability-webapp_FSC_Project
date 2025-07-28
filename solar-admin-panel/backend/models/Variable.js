// models/Variable.js
const mongoose = require('mongoose');

const variableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  description: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Variable', variableSchema);
