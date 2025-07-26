const mongoose = require('mongoose');

const modelCoefficientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    default: 'default'
  },
  beta0: {
    type: Number,
    required: true,
    default: 2.5
  },
  beta1: {
    type: Number,
    required: true,
    default: 0.8
  },
  beta2: {
    type: Number,
    required: true,
    default: -0.3
  },
  beta3: {
    type: Number,
    required: true,
    default: 0.6
  },
  beta4: {
    type: Number,
    required: true,
    default: 0.4
  },
  epsilon: {
    type: Number,
    required: true,
    default: 0.1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ModelCoefficient', modelCoefficientSchema);