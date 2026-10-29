const mongoose = require('mongoose');

const replayRunSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: [true, 'Request ID is required']
  },
  targetUrl: {
    type: String,
    required: [true, 'Target URL is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed', 'timeout'],
    default: 'pending'
  },
  actualResponse: {
    statusCode: Number,
    body: mongoose.Schema.Types.Mixed,
    headers: {
      type: Map,
      of: String
    },
    responseTime: Number, // in milliseconds
    error: String
  },
  comparison: {
    statusMatch: Boolean,
    bodyMatch: Boolean,
    differences: [{
      path: String,
      type: {
        type: String,
        enum: ['added', 'removed', 'modified', 'type-changed']
      },
      expectedValue: mongoose.Schema.Types.Mixed,
      actualValue: mongoose.Schema.Types.Mixed
    }],
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  regression: {
    detected: {
      type: Boolean,
      default: false
    },
    severity: {
      type: String,
      enum: ['none', 'low', 'medium', 'high', 'critical'],
      default: 'none'
    },
    reasons: [String]
  },
  executionMetadata: {
    startTime: Date,
    endTime: Date,
    duration: Number, // in milliseconds
    attempts: {
      type: Number,
      default: 1
    },
    environment: {
      type: String,
      default: 'test'
    }
  },
  triggeredBy: {
    type: String,
    enum: ['manual', 'ci-cd', 'scheduled', 'api'],
    default: 'manual'
  },
  buildId: String,
  commitHash: String,
  branch: String,
  notes: String
}, {
  timestamps: true
});

// Indexes
replayRunSchema.index({ requestId: 1, createdAt: -1 });
replayRunSchema.index({ status: 1 });
replayRunSchema.index({ 'regression.detected': 1 });
replayRunSchema.index({ 'regression.severity': 1 });
replayRunSchema.index({ triggeredBy: 1 });
replayRunSchema.index({ buildId: 1 });
replayRunSchema.index({ createdAt: -1 });

// Virtual for pass/fail
replayRunSchema.virtual('passed').get(function() {
  return this.status === 'completed' && 
         !this.regression.detected &&
         this.comparison.statusMatch &&
         this.comparison.score >= 90;
});

// Method to calculate comparison score
replayRunSchema.methods.calculateScore = function() {
  let score = 100;
  
  // Status code mismatch
  if (!this.comparison.statusMatch) {
    score -= 30;
  }
  
  // Body differences
  const diffCount = this.comparison.differences.length;
  if (diffCount > 0) {
    score -= Math.min(diffCount * 5, 50);
  }
  
  // Response time degradation (if baseline exists)
  // This would be enhanced with baseline comparison
  
  this.comparison.score = Math.max(0, score);
  return this.comparison.score;
};

// Method to determine regression severity
replayRunSchema.methods.determineRegressionSeverity = function() {
  const reasons = [];
  let severity = 'none';
  
  // Check status code changes
  if (!this.comparison.statusMatch) {
    const expected = this.actualResponse.statusCode;
    if (expected >= 500) {
      severity = 'critical';
      reasons.push('Status code changed to 5xx error');
    } else if (expected >= 400) {
      severity = 'high';
      reasons.push('Status code changed to 4xx error');
    } else {
      severity = 'medium';
      reasons.push('Status code mismatch');
    }
  }
  
  // Check for removed fields
  const removedFields = this.comparison.differences.filter(d => d.type === 'removed');
  if (removedFields.length > 0) {
    if (severity === 'none') severity = 'medium';
    reasons.push(`${removedFields.length} field(s) removed from response`);
  }
  
  // Check for type changes
  const typeChanges = this.comparison.differences.filter(d => d.type === 'type-changed');
  if (typeChanges.length > 0) {
    if (severity === 'none') severity = 'medium';
    reasons.push(`${typeChanges.length} field(s) changed type`);
  }
  
  // Check critical field changes
  const criticalFields = ['total', 'price', 'amount', 'id', 'status', 'error'];
  const criticalChanges = this.comparison.differences.filter(d => 
    criticalFields.some(field => d.path.includes(field))
  );
  
  if (criticalChanges.length > 0) {
    severity = severity === 'critical' ? 'critical' : 'high';
    reasons.push('Critical business fields changed');
  }
  
  this.regression.detected = severity !== 'none';
  this.regression.severity = severity;
  this.regression.reasons = reasons;
  
  return { detected: this.regression.detected, severity, reasons };
};

module.exports = mongoose.model('ReplayRun', replayRunSchema);
