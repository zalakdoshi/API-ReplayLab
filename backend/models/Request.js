const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Request name is required'],
    trim: true,
    maxlength: [200, 'Request name cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  method: {
    type: String,
    required: [true, 'HTTP method is required'],
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    uppercase: true
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true
  },
  headers: {
    type: Map,
    of: String,
    default: {}
  },
  body: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  queryParams: {
    type: Map,
    of: String,
    default: {}
  },
  expectedResponse: {
    statusCode: {
      type: Number,
      default: 200
    },
    body: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    headers: {
      type: Map,
      of: String,
      default: {}
    }
  },
  sanitizationRules: [{
    field: String,
    action: {
      type: String,
      enum: ['remove', 'mask', 'replace'],
      default: 'mask'
    },
    replacement: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    trim: true,
    default: 'Uncategorized'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isCritical: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: String,
    default: 'system'
  },
  lastModifiedBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: true
});

// Indexes
requestSchema.index({ name: 1 });
requestSchema.index({ category: 1 });
requestSchema.index({ tags: 1 });
requestSchema.index({ isActive: 1 });
requestSchema.index({ createdAt: -1 });

// Virtual for full URL with query params
requestSchema.virtual('fullUrl').get(function() {
  let fullUrl = this.url;
  if (this.queryParams && this.queryParams.size > 0) {
    const params = new URLSearchParams();
    for (const [key, value] of this.queryParams.entries()) {
      params.append(key, value);
    }
    fullUrl += `?${params.toString()}`;
  }
  return fullUrl;
});

// Method to sanitize sensitive data
requestSchema.methods.sanitize = function() {
  const sanitized = this.toObject();
  
  this.sanitizationRules.forEach(rule => {
    const fields = rule.field.split('.');
    let target = sanitized;
    
    for (let i = 0; i < fields.length - 1; i++) {
      if (target[fields[i]]) {
        target = target[fields[i]];
      }
    }
    
    const lastField = fields[fields.length - 1];
    if (target[lastField]) {
      switch (rule.action) {
        case 'remove':
          delete target[lastField];
          break;
        case 'mask':
          target[lastField] = '***MASKED***';
          break;
        case 'replace':
          target[lastField] = rule.replacement || '***REPLACED***';
          break;
      }
    }
  });
  
  return sanitized;
};

module.exports = mongoose.model('Request', requestSchema);
