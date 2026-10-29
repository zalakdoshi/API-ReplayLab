const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Report title is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['regression', 'summary', 'performance', 'comparison'],
    default: 'regression'
  },
  runIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReplayRun'
  }],
  summary: {
    totalTests: {
      type: Number,
      default: 0
    },
    passed: {
      type: Number,
      default: 0
    },
    failed: {
      type: Number,
      default: 0
    },
    regressionsDetected: {
      type: Number,
      default: 0
    },
    criticalRegressions: {
      type: Number,
      default: 0
    },
    averageResponseTime: Number,
    totalDuration: Number
  },
  regressionDetails: [{
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request'
    },
    requestName: String,
    severity: String,
    reasons: [String],
    differences: mongoose.Schema.Types.Mixed
  }],
  performanceMetrics: {
    slowestEndpoint: String,
    fastestEndpoint: String,
    averageTime: Number,
    p95ResponseTime: Number,
    p99ResponseTime: Number
  },
  metadata: {
    generatedAt: {
      type: Date,
      default: Date.now
    },
    generatedBy: {
      type: String,
      default: 'system'
    },
    environment: String,
    buildId: String,
    commitHash: String,
    branch: String,
    cicdTrigger: Boolean
  },
  status: {
    type: String,
    enum: ['pass', 'fail', 'warning'],
    default: 'pass'
  },
  conclusion: String,
  recommendations: [String]
}, {
  timestamps: true
});

// Indexes
reportSchema.index({ type: 1, createdAt: -1 });
reportSchema.index({ status: 1 });
reportSchema.index({ 'metadata.buildId': 1 });
reportSchema.index({ 'metadata.branch': 1 });
reportSchema.index({ createdAt: -1 });

// Method to generate report summary
reportSchema.methods.generateSummary = async function() {
  const ReplayRun = mongoose.model('ReplayRun');
  
  const runs = await ReplayRun.find({ _id: { $in: this.runIds } })
    .populate('requestId');
  
  this.summary.totalTests = runs.length;
  this.summary.passed = runs.filter(r => r.passed).length;
  this.summary.failed = runs.filter(r => !r.passed).length;
  this.summary.regressionsDetected = runs.filter(r => r.regression.detected).length;
  this.summary.criticalRegressions = runs.filter(r => 
    r.regression.severity === 'critical' || r.regression.severity === 'high'
  ).length;
  
  // Calculate average response time
  const responseTimes = runs
    .filter(r => r.actualResponse.responseTime)
    .map(r => r.actualResponse.responseTime);
  
  if (responseTimes.length > 0) {
    this.summary.averageResponseTime = 
      responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  }
  
  // Collect regression details
  this.regressionDetails = runs
    .filter(r => r.regression.detected)
    .map(r => ({
      requestId: r.requestId._id,
      requestName: r.requestId.name,
      severity: r.regression.severity,
      reasons: r.regression.reasons,
      differences: r.comparison.differences
    }));
  
  // Determine overall status
  if (this.summary.criticalRegressions > 0) {
    this.status = 'fail';
    this.conclusion = `Critical regressions detected. ${this.summary.criticalRegressions} critical issue(s) found.`;
  } else if (this.summary.regressionsDetected > 0) {
    this.status = 'warning';
    this.conclusion = `Non-critical regressions detected. ${this.summary.regressionsDetected} issue(s) need review.`;
  } else {
    this.status = 'pass';
    this.conclusion = 'All tests passed. No regressions detected.';
  }
  
  return this;
};

module.exports = mongoose.model('Report', reportSchema);
