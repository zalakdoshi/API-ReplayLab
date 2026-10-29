const Report = require('../models/Report');
const ReplayRun = require('../models/ReplayRun');

// @desc    Generate report
// @route   POST /api/reports/generate
// @access  Public
exports.generateReport = async (req, res) => {
  try {
    const { 
      title,
      type = 'regression',
      runIds,
      buildId,
      commitHash,
      branch,
      cicdTrigger = false
    } = req.body;

    if (!runIds || !Array.isArray(runIds) || runIds.length === 0) {
      return res.status(400).json({ error: 'Run IDs array is required' });
    }

    // Verify all runs exist
    const runs = await ReplayRun.find({ _id: { $in: runIds } });
    if (runs.length !== runIds.length) {
      return res.status(404).json({ error: 'Some replay runs not found' });
    }

    // Create report
    const report = new Report({
      title: title || `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date().toISOString()}`,
      type,
      runIds,
      metadata: {
        buildId,
        commitHash,
        branch,
        cicdTrigger,
        generatedBy: req.body.generatedBy || 'system',
        environment: req.body.environment || 'test'
      }
    });

    // Generate summary and determine status
    await report.generateSummary();
    await report.save();

    res.status(201).json({
      message: 'Report generated successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public
exports.getAllReports = async (req, res) => {
  try {
    const { 
      type, 
      status,
      buildId,
      branch,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (buildId) query['metadata.buildId'] = buildId;
    if (branch) query['metadata.branch'] = branch;

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Report.countDocuments(query);

    res.json({
      reports,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Public
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate({
        path: 'runIds',
        populate: {
          path: 'requestId',
          select: 'name method url category'
        }
      });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Public
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get report statistics
// @route   GET /api/reports/stats/overview
// @access  Public
exports.getReportStats = async (req, res) => {
  try {
    const total = await Report.countDocuments();
    const passed = await Report.countDocuments({ status: 'pass' });
    const failed = await Report.countDocuments({ status: 'fail' });
    const warnings = await Report.countDocuments({ status: 'warning' });

    const recentReports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title type status createdAt metadata.buildId');

    const byType = await Report.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const regressionTrend = await Report.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          totalRegressions: { $sum: '$summary.regressionsDetected' },
          criticalRegressions: { $sum: '$summary.criticalRegressions' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      total,
      passed,
      failed,
      warnings,
      recentReports,
      byType,
      regressionTrend
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get latest report for build
// @route   GET /api/reports/build/:buildId
// @access  Public
exports.getReportByBuild = async (req, res) => {
  try {
    const report = await Report.findOne({ 
      'metadata.buildId': req.params.buildId 
    })
      .sort({ createdAt: -1 })
      .populate({
        path: 'runIds',
        populate: {
          path: 'requestId',
          select: 'name method url'
        }
      });

    if (!report) {
      return res.status(404).json({ error: 'Report not found for this build' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
