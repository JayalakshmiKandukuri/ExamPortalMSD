const express = require('express');
const router = express.Router();
const {
  createExam,
  getAllExams,
  getAvailableExams,
  getExamById,
  updateExam,
  deleteExam
} = require('../controllers/examController');
const { protect, adminOnly, studentOnly } = require('../middleware/auth');

router.use(protect);

// Student routes
router.get('/available', studentOnly, getAvailableExams);

// Admin routes
router.route('/')
  .get(getAllExams)
  .post(adminOnly, createExam);

router.route('/:id')
  .get(getExamById)
  .put(adminOnly, updateExam)
  .delete(adminOnly, deleteExam);

module.exports = router;
