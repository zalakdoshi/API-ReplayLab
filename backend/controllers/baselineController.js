const Baseline = require('../models/Baseline');
const Request = require('../models/Request');

// @desc    Create or update baseline
// @route   POST /api/baselines
// @access  Public
exports.createBaseline = async (req, res) => {
  try {
    const { requestId, version, response, metadata, validationRules } = req.body;

    // Check if request exists
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check if baseline already exists for this request
    let baseline = await Baseline.findOne({ requestId });

    if (baseline) {
      // Update existing baseline
      baseline.version = version || baseline.version;
      baseline.response = response;
      baseline.metadata = { ...baseline.metadata, ...metadata };
      baseline.validationRules = validationRules || baseline.validationRules;
      baseline.isActive = true;
      
      await baseline.save();

      return res.json({
        message: 'Baseline updated successfully',
        baseline
      });
    }

    // Create new baseline
    baseline = new Baseline({
      requestId,
      version,
      response,
      metadata,
      validationRules: validationRules || []
    });

    await baseline.save();

    res.status(201).json({
      message: 'Baseline created successfully',
      baseline
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get baseline by request ID
// @route   GET /api/baselines/request/:requestId
// @access  Public
exports.getBaselineByRequest = async (req, res) => {
  try {
    const baseline = await Baseline.findOne({ 
      requestId: req.params.requestId,
      isActive: true 
    }).populate('requestId', 'name method url');

    if (!baseline) {
      return res.status(404).json({ error: 'Baseline not found' });
    }

    res.json(baseline);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all baselines
// @route   GET /api/baselines
// @access  Public
exports.getAllBaselines = async (req, res) => {
  try {
    const { isActive, page = 1, limit = 20 } = req.query;

    const query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const baselines = await Baseline.find(query)
      .populate('requestId', 'name method url category')
      .sort({ 'metadata.capturedAt': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Baseline.countDocuments(query);

    res.json({
      baselines,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete baseline
// @route   DELETE /api/baselines/:id
// @access  Public
exports.deleteBaseline = async (req, res) => {
  try {
    const baseline = await Baseline.findByIdAndDelete(req.params.id);

    if (!baseline) {
      return res.status(404).json({ error: 'Baseline not found' });
    }

    res.json({ message: 'Baseline deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Deactivate baseline
// @route   PATCH /api/baselines/:id/deactivate
// @access  Public
exports.deactivateBaseline = async (req, res) => {
  try {
    const baseline = await Baseline.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!baseline) {
      return res.status(404).json({ error: 'Baseline not found' });
    }

    res.json({
      message: 'Baseline deactivated successfully',
      baseline
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
