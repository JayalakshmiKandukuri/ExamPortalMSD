const express = require('express');
const router = express.Router();
const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getSubjects
} = require('../controllers/questionController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.use(adminOnly);

router.route('/')
  .get(getAllQuestions)
  .post(createQuestion);

router.get('/subjects', getSubjects);

router.route('/:id')
  .get(getQuestionById)
  .put(updateQuestion)
  .delete(deleteQuestion);

module.exports = router;
