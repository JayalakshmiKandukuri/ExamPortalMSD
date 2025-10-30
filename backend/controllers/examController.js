const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Result = require('../models/Result');

// Create exam (Admin only)
exports.createExam = async (req, res) => {
  try {
    const { title, description, subject, duration, totalMarks, passingMarks, questions, scheduledDate, endDate } = req.body;

    // Validate questions exist
    const validQuestions = await Question.find({ _id: { $in: questions } });
    if (validQuestions.length !== questions.length) {
      return res.status(400).json({ message: 'Some questions are invalid' });
    }

    const exam = await Exam.create({
      title,
      description,
      subject,
      duration,
      totalMarks,
      passingMarks,
      questions,
      scheduledDate,
      endDate,
      createdBy: req.user._id
    });

    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all exams
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate('createdBy', 'name email')
      .populate('questions')
      .sort('-createdAt');
    
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available exams for students
exports.getAvailableExams = async (req, res) => {
  try {
    const now = new Date();
    const exams = await Exam.find({
      isActive: true,
      scheduledDate: { $lte: now },
      endDate: { $gte: now }
    })
      .select('-questions')
      .sort('scheduledDate');

    // Check which exams the student has already attempted
    const studentResults = await Result.find({ student: req.user._id });
    const attemptedExamIds = studentResults.map(result => result.exam.toString());

    const examsWithStatus = exams.map(exam => ({
      ...exam.toObject(),
      attempted: attemptedExamIds.includes(exam._id.toString())
    }));

    res.json(examsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get exam by ID (with questions for students)
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('questions');
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if exam is available
    const now = new Date();
    if (req.user.role === 'student') {
      if (!exam.isActive || exam.scheduledDate > now || exam.endDate < now) {
        return res.status(403).json({ message: 'Exam is not available' });
      }

      // Check if student has already attempted
      const existingResult = await Result.findOne({
        student: req.user._id,
        exam: exam._id
      });

      if (existingResult) {
        return res.status(403).json({ message: 'You have already attempted this exam' });
      }

      // Remove correct answers from questions for students
      const questionsWithoutAnswers = exam.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        subject: q.subject,
        difficulty: q.difficulty
      }));

      return res.json({
        ...exam.toObject(),
        questions: questionsWithoutAnswers
      });
    }

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update exam (Admin only)
exports.updateExam = async (req, res) => {
  try {
    const { title, description, subject, duration, totalMarks, passingMarks, questions, scheduledDate, endDate, isActive } = req.body;

    if (questions) {
      const validQuestions = await Question.find({ _id: { $in: questions } });
      if (validQuestions.length !== questions.length) {
        return res.status(400).json({ message: 'Some questions are invalid' });
      }
    }

    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { title, description, subject, duration, totalMarks, passingMarks, questions, scheduledDate, endDate, isActive },
      { new: true, runValidators: true }
    ).populate('questions');

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete exam (Admin only)
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Also delete all results for this exam
    await Result.deleteMany({ exam: req.params.id });

    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
