const express = require('express');
const router = express.Router();
const {
  submitExam,
  getMyResults,
  getResultById,
  getExamResults,
  getAllResults
} = require('../controllers/resultController');
const { protect, adminOnly, studentOnly } = require('../middleware/auth');

router.use(protect);

// Student routes
router.post('/submit', studentOnly, submitExam);
router.get('/my-results', studentOnly, getMyResults);

// Admin routes
router.get('/all', adminOnly, getAllResults);
router.get('/exam/:examId', adminOnly, getExamResults);

// Common routes
router.get('/:id', getResultById);

module.exports = router;
