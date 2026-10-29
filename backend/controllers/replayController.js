const ReplayRun = require('../models/ReplayRun');
const Request = require('../models/Request');
const Baseline = require('../models/Baseline');
const axios = require('axios');
const deepDiff = require('deep-diff');

// @desc    Execute replay for a single request
// @route   POST /api/replay/execute/:requestId
// @access  Public
exports.executeReplay = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { 
      targetUrl, 
      environment = 'test',
      triggeredBy = 'manual',
      buildId,
      commitHash,
      branch 
    } = req.body;

    // Find the request
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Create replay run
    const replayRun = new ReplayRun({
      requestId,
      targetUrl: targetUrl || request.url,
      triggeredBy,
      buildId,
      commitHash,
      branch,
      executionMetadata: {
        startTime: new Date(),
        environment
      }
    });

    await replayRun.save();

    // Execute in background
    executeReplayAsync(replayRun._id, request, targetUrl || request.url)
      .catch(error => console.error('Replay execution error:', error));

    res.status(202).json({
      message: 'Replay execution started',
      runId: replayRun._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Background execution function
async function executeReplayAsync(runId, request, targetUrl) {
  const replayRun = await ReplayRun.findById(runId);
  
  try {
    replayRun.status = 'running';
    await replayRun.save();

    const startTime = Date.now();

    // Build request config
    const config = {
      method: request.method,
      url: targetUrl,
      headers: Object.fromEntries(request.headers || new Map()),
      timeout: parseInt(process.env.MAX_REPLAY_TIMEOUT) || 30000,
      validateStatus: () => true // Accept any status code
    };

    if (request.body) {
      config.data = request.body;
    }

    if (request.queryParams && request.queryParams.size > 0) {
      config.params = Object.fromEntries(request.queryParams);
    }

    // Execute request
    const response = await axios(config);
    const endTime = Date.now();

    // Store actual response
    replayRun.actualResponse = {
      statusCode: response.status,
      body: response.data,
      headers: new Map(Object.entries(response.headers)),
      responseTime: endTime - startTime
    };

    // Find baseline for comparison
    const baseline = await Baseline.findOne({ 
      requestId: request._id,
      isActive: true 
    });

    if (baseline) {
      // Compare with baseline
      await compareWithBaseline(replayRun, baseline);
    } else {
      // Compare with expected response in request
      await compareWithExpected(replayRun, request.expectedResponse);
    }

    replayRun.status = 'completed';
    replayRun.executionMetadata.endTime = new Date();
    replayRun.executionMetadata.duration = endTime - startTime;

    await replayRun.save();

  } catch (error) {
    replayRun.status = error.code === 'ECONNABORTED' ? 'timeout' : 'failed';
    replayRun.actualResponse.error = error.message;
    replayRun.executionMetadata.endTime = new Date();
    
    await replayRun.save();
  }
}

// Compare with baseline
async function compareWithBaseline(replayRun, baseline) {
  const actual = replayRun.actualResponse;
  const expected = baseline.response;

  // Status code comparison
  replayRun.comparison.statusMatch = actual.statusCode === expected.statusCode;

  // Body comparison using deep-diff
  const differences = deepDiff(expected.body, actual.body) || [];
  
  replayRun.comparison.differences = differences.map(diff => ({
    path: diff.path ? diff.path.join('.') : 'root',
    type: getDiffType(diff.kind),
    expectedValue: diff.lhs,
    actualValue: diff.rhs
  }));

  replayRun.comparison.bodyMatch = differences.length === 0;

  // Calculate score
  replayRun.calculateScore();

  // Determine regression
  replayRun.determineRegressionSeverity();
}

// Compare with expected response
async function compareWithExpected(replayRun, expectedResponse) {
  const actual = replayRun.actualResponse;

  // Status code comparison
  replayRun.comparison.statusMatch = 
    actual.statusCode === expectedResponse.statusCode;

  // Body comparison
  const differences = deepDiff(expectedResponse.body, actual.body) || [];
  
  replayRun.comparison.differences = differences.map(diff => ({
    path: diff.path ? diff.path.join('.') : 'root',
    type: getDiffType(diff.kind),
    expectedValue: diff.lhs,
    actualValue: diff.rhs
  }));

  replayRun.comparison.bodyMatch = differences.length === 0;

  // Calculate score
  replayRun.calculateScore();

  // Determine regression
  replayRun.determineRegressionSeverity();
}

// Helper to map deep-diff kinds to our types
function getDiffType(kind) {
  const typeMap = {
    'N': 'added',
    'D': 'removed',
    'E': 'modified',
    'A': 'modified'
  };
  return typeMap[kind] || 'modified';
}

// @desc    Get replay run status
// @route   GET /api/replay/status/:runId
// @access  Public
exports.getReplayStatus = async (req, res) => {
  try {
    const replayRun = await ReplayRun.findById(req.params.runId)
      .populate('requestId', 'name method url');

    if (!replayRun) {
      return res.status(404).json({ error: 'Replay run not found' });
    }

    res.json(replayRun);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all replay runs
// @route   GET /api/replay/runs
// @access  Public
exports.getAllReplays = async (req, res) => {
  try {
    const { 
      status, 
      requestId,
      triggeredBy,
      regression,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (requestId) query.requestId = requestId;
    if (triggeredBy) query.triggeredBy = triggeredBy;
    if (regression === 'true') query['regression.detected'] = true;

    const runs = await ReplayRun.find(query)
      .populate('requestId', 'name method url category')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await ReplayRun.countDocuments(query);

    res.json({
      runs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Execute batch replay
// @route   POST /api/replay/batch
// @access  Public
exports.executeBatchReplay = async (req, res) => {
  try {
    const { 
      requestIds, 
      targetBaseUrl,
      environment = 'test',
      triggeredBy = 'manual',
      buildId,
      commitHash,
      branch
    } = req.body;

    if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
      return res.status(400).json({ error: 'Request IDs array is required' });
    }

    const requests = await Request.find({ 
      _id: { $in: requestIds },
      isActive: true 
    });

    const runIds = [];

    for (const request of requests) {
      const targetUrl = targetBaseUrl 
        ? `${targetBaseUrl}${new URL(request.url).pathname}`
        : request.url;

      const replayRun = new ReplayRun({
        requestId: request._id,
        targetUrl,
        triggeredBy,
        buildId,
        commitHash,
        branch,
        executionMetadata: {
          startTime: new Date(),
          environment
        }
      });

      await replayRun.save();
      runIds.push(replayRun._id);

      // Execute in background
      executeReplayAsync(replayRun._id, request, targetUrl)
        .catch(error => console.error('Batch replay error:', error));
    }

    res.status(202).json({
      message: 'Batch replay execution started',
      runIds,
      total: runIds.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get replay statistics
// @route   GET /api/replay/stats
// @access  Public
exports.getReplayStats = async (req, res) => {
  try {
    const total = await ReplayRun.countDocuments();
    const completed = await ReplayRun.countDocuments({ status: 'completed' });
    const failed = await ReplayRun.countDocuments({ status: 'failed' });
    const regressionsDetected = await ReplayRun.countDocuments({ 
      'regression.detected': true 
    });

    const byStatus = await ReplayRun.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const bySeverity = await ReplayRun.aggregate([
      { $match: { 'regression.detected': true } },
      { $group: { _id: '$regression.severity', count: { $sum: 1 } } }
    ]);

    res.json({
      total,
      completed,
      failed,
      regressionsDetected,
      byStatus,
      bySeverity
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
