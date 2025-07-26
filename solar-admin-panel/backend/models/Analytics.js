const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  totalCalculations: {
    type: Number,
    default: 0
  },
  monthlyCalculations: {
    type: Number,
    default: 0
  },
  activeLocations: {
    type: Number,
    default: 0
  },
  modelAccuracy: {
    type: Number,
    default: 94.2
  },
  rSquaredScore: {
    type: Number,
    default: 0.887
  },
  rmse: {
    type: Number,
    default: 0.234
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  modelVersion: {
    type: String,
    default: 'v2.1.3'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Analytics', analyticsSchema);