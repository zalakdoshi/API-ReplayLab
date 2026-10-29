const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllRequests,
  getRequest,
  createRequest,
  updateRequest,
  deleteRequest,
  importCurl,
  getStats
} = require('../controllers/requestController');

// Validation middleware
const validateRequest = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('method').isIn(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'])
    .withMessage('Invalid HTTP method'),
  body('url').trim().isURL().withMessage('Valid URL is required')
];

// Routes
router.get('/', getAllRequests);
router.get('/stats', getStats);
router.get('/:id', getRequest);
router.post('/', validateRequest, createRequest);
router.put('/:id', updateRequest);
router.delete('/:id', deleteRequest);
router.post('/import/curl', importCurl);

module.exports = router;
