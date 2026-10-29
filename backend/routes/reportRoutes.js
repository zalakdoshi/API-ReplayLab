const express = require('express');
const router = express.Router();
const {
  generateReport,
  getAllReports,
  getReport,
  deleteReport,
  getReportStats,
  getReportByBuild
} = require('../controllers/reportController');

// Routes
router.post('/generate', generateReport);
router.get('/', getAllReports);
router.get('/stats/overview', getReportStats);
router.get('/build/:buildId', getReportByBuild);
router.get('/:id', getReport);
router.delete('/:id', deleteReport);

module.exports = router;
