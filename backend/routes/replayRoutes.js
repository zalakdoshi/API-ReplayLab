const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  executeReplay,
  getReplayStatus,
  getAllReplays,
  executeBatchReplay,
  getReplayStats
} = require('../controllers/replayController');

// All replay routes require authentication
router.post('/execute/:requestId', protect, executeReplay);
router.post('/batch', protect, executeBatchReplay);
router.get('/runs', protect, getAllReplays);
router.get('/status/:runId', protect, getReplayStatus);
router.get('/stats', protect, getReplayStats);

module.exports = router;
