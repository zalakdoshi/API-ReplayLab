const mongoose = require('mongoose');

const baselineSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: [true, 'Request ID is required']
  },
  version: {
    type: String,
    required: [true, 'Version is required'],
    trim: true
  },
  response: {
    statusCode: {
      type: Number,
      required: true
    },
    body: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    headers: {
      type: Map,
      of: String,
      default: {}
    },
    responseTime: Number
  },
  metadata: {
    capturedAt: {
      type: Date,
      default: Date.now
    },
    capturedBy: {
      type: String,
      default: 'system'
    },
    environment: {
      type: String,
      default: 'production'
    },
    commitHash: String,
    branch: String,
    buildId: String
  },
  validationRules: [{
    field: {
      type: String,
      required: true
    },
    rule: {
      type: String,
      enum: ['required', 'type', 'range', 'pattern', 'custom'],
      required: true
    },
    value: mongoose.Schema.Types.Mixed,
    message: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  notes: String
}, {
  timestamps: true
});

// Indexes
baselineSchema.index({ requestId: 1 });
baselineSchema.index({ version: 1 });
baselineSchema.index({ isActive: 1 });
baselineSchema.index({ 'metadata.capturedAt': -1 });

// Method to validate response against baseline
baselineSchema.methods.validateResponse = function(actualResponse) {
  const errors = [];
  
  this.validationRules.forEach(rule => {
    const actualValue = this.getNestedValue(actualResponse.body, rule.field);
    
    switch (rule.rule) {
      case 'required':
        if (actualValue === undefined || actualValue === null) {
          errors.push({
            field: rule.field,
            message: rule.message || `Field ${rule.field} is required`,
            rule: 'required'
          });
        }
        break;
        
      case 'type':
        if (actualValue !== undefined && typeof actualValue !== rule.value) {
          errors.push({
            field: rule.field,
            message: rule.message || `Field ${rule.field} should be of type ${rule.value}`,
            rule: 'type',
            expected: rule.value,
            actual: typeof actualValue
          });
        }
        break;
        
      case 'range':
        if (typeof actualValue === 'number') {
          const [min, max] = rule.value;
          if (actualValue < min || actualValue > max) {
            errors.push({
              field: rule.field,
              message: rule.message || `Field ${rule.field} should be between ${min} and ${max}`,
              rule: 'range',
              expected: rule.value,
              actual: actualValue
            });
          }
        }
        break;
        
      case 'pattern':
        if (typeof actualValue === 'string' && !new RegExp(rule.value).test(actualValue)) {
          errors.push({
            field: rule.field,
            message: rule.message || `Field ${rule.field} does not match expected pattern`,
            rule: 'pattern'
          });
        }
        break;
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Helper method to get nested values
baselineSchema.methods.getNestedValue = function(obj, path) {
  return path.split('.').reduce((current, prop) => 
    current && current[prop] !== undefined ? current[prop] : undefined, obj);
};

module.exports = mongoose.model('Baseline', baselineSchema);
