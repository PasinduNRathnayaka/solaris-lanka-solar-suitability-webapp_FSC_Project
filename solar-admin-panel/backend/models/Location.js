const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  province: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  variables: [{
    variableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Variable',
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  }],
  calculatedPVOUT: {
    type: Number,
    default: 0
  },
  lastCalculated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create compound index for unique province-district-city combination
locationSchema.index({ province: 1, district: 1, city: 1 }, { unique: true });

module.exports = mongoose.model('Location', locationSchema);