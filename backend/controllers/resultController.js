const Result = require('../models/Result');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

// Submit exam and calculate result (Student only)
exports.submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;

    // Check if exam exists
    const exam = await Exam.findById(examId).populate('questions');
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if exam is available
    const now = new Date();
    if (!exam.isActive || exam.scheduledDate > now || exam.endDate < now) {
      return res.status(403).json({ message: 'Exam is not available' });
    }

    // Check if student has already submitted
    const existingResult = await Result.findOne({
      student: req.user._id,
      exam: examId
    });

    if (existingResult) {
      return res.status(403).json({ message: 'You have already submitted this exam' });
    }

    // Calculate score
    let correctAnswers = 0;
    const processedAnswers = [];

    for (let i = 0; i < exam.questions.length; i++) {
      const question = exam.questions[i];
      const studentAnswer = answers[i];
      const isCorrect = studentAnswer === question.correctAnswer;

      if (isCorrect) {
        correctAnswers++;
      }

      processedAnswers.push({
        questionId: question._id,
        selectedAnswer: studentAnswer,
        isCorrect
      });
    }

    const totalQuestions = exam.questions.length;
    const score = (correctAnswers / totalQuestions) * exam.totalMarks;
    const percentage = (correctAnswers / totalQuestions) * 100;
    const passed = score >= exam.passingMarks;

    // Create result
    const result = await Result.create({
      student: req.user._id,
      exam: examId,
      answers: processedAnswers,
      score: Math.round(score * 100) / 100,
      totalQuestions,
      correctAnswers,
      percentage: Math.round(percentage * 100) / 100,
      passed
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student's results
exports.getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id })
      .populate('exam', 'title subject totalMarks passingMarks')
      .sort('-submittedAt');
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get result by ID
exports.getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('student', 'name email')
      .populate('exam', 'title subject totalMarks passingMarks')
      .populate('answers.questionId');

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Students can only view their own results
    if (req.user.role === 'student' && result.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all results for an exam (Admin only)
exports.getExamResults = async (req, res) => {
  try {
    const results = await Result.find({ exam: req.params.examId })
      .populate('student', 'name email')
      .populate('exam', 'title subject totalMarks passingMarks')
      .sort('-submittedAt');
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all results (Admin only)
exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate('student', 'name email')
      .populate('exam', 'title subject totalMarks passingMarks')
      .sort('-submittedAt');
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
