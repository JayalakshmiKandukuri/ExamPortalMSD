const Question = require('../models/Question');

// Create question (Admin only)
exports.createQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswer, subject, difficulty } = req.body;

    // Validate options length
    if (!options || options.length !== 4) {
      return res.status(400).json({ message: 'Question must have exactly 4 options' });
    }

    const question = await Question.create({
      questionText,
      options,
      correctAnswer,
      subject,
      difficulty,
      createdBy: req.user._id
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all questions (Admin only)
exports.getAllQuestions = async (req, res) => {
  try {
    const { subject, difficulty } = req.query;
    const filter = {};
    
    if (subject) filter.subject = subject;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter)
      .populate('createdBy', 'name email')
      .sort('-createdAt');
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get question by ID (Admin only)
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update question (Admin only)
exports.updateQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswer, subject, difficulty } = req.body;

    if (options && options.length !== 4) {
      return res.status(400).json({ message: 'Question must have exactly 4 options' });
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { questionText, options, correctAnswer, subject, difficulty },
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete question (Admin only)
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unique subjects
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Question.distinct('subject');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
