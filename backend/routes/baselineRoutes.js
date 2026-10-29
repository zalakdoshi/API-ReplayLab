const express = require('express');
const router = express.Router();
const {
  createBaseline,
  getBaselineByRequest,
  getAllBaselines,
  deleteBaseline,
  deactivateBaseline
} = require('../controllers/baselineController');

// Routes
router.post('/', createBaseline);
router.get('/', getAllBaselines);
router.get('/request/:requestId', getBaselineByRequest);
router.delete('/:id', deleteBaseline);
router.patch('/:id/deactivate', deactivateBaseline);

module.exports = router;
