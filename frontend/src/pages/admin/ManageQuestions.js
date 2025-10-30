import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Trash2, ArrowLeft, Search } from 'lucide-react';

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({ subject: '', difficulty: '', search: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    subject: '',
    difficulty: 'medium'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
    fetchSubjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [questions, filters]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      setQuestions(response.data);
      setFilteredQuestions(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/api/questions/subjects');
      setSubjects(response.data);
    } catch (err) {
      console.error('Failed to fetch subjects');
    }
  };

  const applyFilters = () => {
    let filtered = [...questions];

    if (filters.subject) {
      filtered = filtered.filter(q => q.subject === filters.subject);
    }

    if (filters.difficulty) {
      filtered = filtered.filter(q => q.difficulty === filters.difficulty);
    }

    if (filters.search) {
      filtered = filtered.filter(q =>
        q.questionText.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredQuestions(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.options.some(opt => !opt.trim())) {
      setError('All options must be filled');
      return;
    }

    try {
      if (editingQuestion) {
        await axios.put(`/api/questions/${editingQuestion._id}`, formData);
      } else {
        await axios.post('/api/questions', formData);
      }
      
      setShowForm(false);
      setEditingQuestion(null);
      resetForm();
      fetchQuestions();
      fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save question');
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      questionText: question.questionText,
      options: question.options,
      correctAnswer: question.correctAnswer,
      subject: question.subject,
      difficulty: question.difficulty
    });
    setShowForm(true);
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await axios.delete(`/api/questions/${questionId}`);
      fetchQuestions();
      fetchSubjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete question');
    }
  };

  const resetForm = () => {
    setFormData({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      subject: '',
      difficulty: 'medium'
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingQuestion(null);
    resetForm();
    setError('');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <div style={styles.header}>
        <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
        <h1 style={styles.pageTitle}>Manage Questions</h1>
        <button className="btn btn-success" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          Add Question
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Question Form */}
      {showForm && (
        <div className="card mb-3">
          <h2 style={styles.formTitle}>
            {editingQuestion ? 'Edit Question' : 'Add New Question'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Question Text *</label>
              <textarea
                name="questionText"
                className="form-control"
                value={formData.questionText}
                onChange={handleFormChange}
                required
                rows="3"
                placeholder="Enter the question"
              />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  className="form-control"
                  value={formData.subject}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g., Mathematics, Science"
                  list="subjects-list"
                />
                <datalist id="subjects-list">
                  {subjects.map(subject => (
                    <option key={subject} value={subject} />
                  ))}
                </datalist>
              </div>

              <div className="form-group">
                <label>Difficulty *</label>
                <select
                  name="difficulty"
                  className="form-control"
                  value={formData.difficulty}
                  onChange={handleFormChange}
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Options *</label>
              {formData.options.map((option, index) => (
                <div key={index} style={styles.optionInput}>
                  <span style={styles.optionLabel}>Option {index + 1}:</span>
                  <input
                    type="text"
                    className="form-control"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                    placeholder={`Enter option ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="form-group">
              <label>Correct Answer *</label>
              <select
                name="correctAnswer"
                className="form-control"
                value={formData.correctAnswer}
                onChange={handleFormChange}
                required
              >
                {formData.options.map((option, index) => (
                  <option key={index} value={index}>
                    Option {index + 1}: {option || '(empty)'}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formButtons}>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                {editingQuestion ? 'Update Question' : 'Add Question'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-3">
        <div className="grid grid-3">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Search</label>
            <div style={styles.searchContainer}>
              <Search size={18} style={styles.searchIcon} />
              <input
                type="text"
                name="search"
                className="form-control"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search questions..."
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Subject</label>
            <select
              name="subject"
              className="form-control"
              value={filters.subject}
              onChange={handleFilterChange}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Difficulty</label>
            <select
              name="difficulty"
              className="form-control"
              value={filters.difficulty}
              onChange={handleFilterChange}
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="card">
        <h2 style={styles.sectionTitle}>
          Questions ({filteredQuestions.length})
        </h2>

        {filteredQuestions.length === 0 ? (
          <p style={styles.emptyState}>No questions found.</p>
        ) : (
          <div style={styles.questionsList}>
            {filteredQuestions.map((question, index) => (
              <div key={question._id} style={styles.questionCard}>
                <div style={styles.questionHeader}>
                  <h3 style={styles.questionNumber}>Question {index + 1}</h3>
                  <div style={styles.badges}>
                    <span className="badge badge-info">{question.subject}</span>
                    <span className={`badge badge-${
                      question.difficulty === 'easy' ? 'success' :
                      question.difficulty === 'medium' ? 'warning' : 'danger'
                    }`}>
                      {question.difficulty}
                    </span>
                  </div>
                </div>

                <p style={styles.questionText}>{question.questionText}</p>

                <div style={styles.optionsList}>
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      style={{
                        ...styles.option,
                        ...(optIndex === question.correctAnswer ? styles.correctOption : {})
                      }}
                    >
                      <span>{optIndex + 1}. {option}</span>
                      {optIndex === question.correctAnswer && (
                        <span style={styles.correctBadge}>✓ Correct</span>
                      )}
                    </div>
                  ))}
                </div>

                <div style={styles.questionActions}>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(question)}
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(question._id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  pageTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: 'white',
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  optionInput: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  optionLabel: {
    minWidth: '80px',
    fontWeight: '600',
    color: '#666',
  },
  formButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  searchContainer: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  emptyState: {
    textAlign: 'center',
    color: '#666',
    padding: '40px',
    fontSize: '16px',
  },
  questionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  questionCard: {
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '20px',
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  questionNumber: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#667eea',
  },
  badges: {
    display: 'flex',
    gap: '8px',
  },
  questionText: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '16px',
    lineHeight: '1.6',
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },
  option: {
    padding: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  correctOption: {
    background: '#d4edda',
    borderColor: '#28a745',
  },
  correctBadge: {
    color: '#28a745',
    fontWeight: '600',
    fontSize: '14px',
  },
  questionActions: {
    display: 'flex',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid #e0e0e0',
  },
};

export default ManageQuestions;
