const Request = require('../models/Request');
const { validationResult } = require('express-validator');

// @desc    Get all requests
// @route   GET /api/requests
// @access  Public
exports.getAllRequests = async (req, res) => {
  try {
    const { 
      category, 
      tags, 
      isActive, 
      search,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (tags) query.tags = { $in: tags.split(',') };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const requests = await Request.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Request.countDocuments(query);

    res.json({
      requests,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Public
exports.getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create new request
// @route   POST /api/requests
// @access  Public
exports.createRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const request = new Request(req.body);
    await request.save();

    res.status(201).json({
      message: 'Request created successfully',
      request
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update request
// @route   PUT /api/requests/:id
// @access  Public
exports.updateRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastModifiedBy: req.body.lastModifiedBy || 'system' },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({
      message: 'Request updated successfully',
      request
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Public
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Import cURL command
// @route   POST /api/requests/import/curl
// @access  Public
exports.importCurl = async (req, res) => {
  try {
    const { curlCommand } = req.body;

    if (!curlCommand) {
      return res.status(400).json({ error: 'cURL command is required' });
    }

    const parsed = parseCurl(curlCommand);
    
    const request = new Request({
      name: `Imported from cURL - ${new Date().toISOString()}`,
      ...parsed,
      createdBy: req.body.createdBy || 'curl-import'
    });

    await request.save();

    res.status(201).json({
      message: 'Request imported successfully',
      request
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Helper function to parse cURL command
function parseCurl(curlCommand) {
  const result = {
    method: 'GET',
    url: '',
    headers: new Map(),
    body: null
  };

  // Extract URL
  const urlMatch = curlCommand.match(/curl\s+['"]?([^\s'"]+)/);
  if (urlMatch) {
    result.url = urlMatch[1];
  }

  // Extract method
  const methodMatch = curlCommand.match(/-X\s+(\w+)/);
  if (methodMatch) {
    result.method = methodMatch[1].toUpperCase();
  }

  // Extract headers
  const headerMatches = curlCommand.matchAll(/-H\s+['"]([^'"]+)['"]/g);
  for (const match of headerMatches) {
    const [key, ...values] = match[1].split(':');
    result.headers.set(key.trim(), values.join(':').trim());
  }

  // Extract body
  const bodyMatch = curlCommand.match(/--data(?:-raw)?\s+['"](.+)['"]/s);
  if (bodyMatch) {
    try {
      result.body = JSON.parse(bodyMatch[1]);
    } catch {
      result.body = bodyMatch[1];
    }
  }

  return result;
}

// @desc    Get request statistics
// @route   GET /api/requests/stats
// @access  Public
exports.getStats = async (req, res) => {
  try {
    const total = await Request.countDocuments();
    const active = await Request.countDocuments({ isActive: true });
    const critical = await Request.countDocuments({ isCritical: true });
    
    const byCategory = await Request.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const byMethod = await Request.aggregate([
      { $group: { _id: '$method', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      total,
      active,
      critical,
      byCategory,
      byMethod
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
