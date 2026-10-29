const express = require('express');
const router = express.Router();
const {
  executeReplay,
  getReplayStatus,
  getAllReplays,
  executeBatchReplay,
  getReplayStats
} = require('../controllers/replayController');

// Routes
router.post('/execute/:requestId', executeReplay);
router.post('/batch', executeBatchReplay);
router.get('/runs', getAllReplays);
router.get('/status/:runId', getReplayStatus);
router.get('/stats', getReplayStats);

module.exports = router;
