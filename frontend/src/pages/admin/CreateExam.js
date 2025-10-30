import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, X } from 'lucide-react';

const CreateExam = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    duration: 30,
    totalMarks: 100,
    passingMarks: 40,
    scheduledDate: '',
    endDate: '',
    isActive: true
  });
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({ subject: '', difficulty: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
    fetchSubjects();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      setQuestions(response.data);
    } catch (err) {
      setError('Failed to fetch questions');
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const toggleQuestionSelection = (questionId) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedQuestions.length === 0) {
      setError('Please select at least one question');
      return;
    }

    if (new Date(formData.scheduledDate) >= new Date(formData.endDate)) {
      setError('End date must be after scheduled date');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/exams', {
        ...formData,
        questions: selectedQuestions
      });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (filters.subject && q.subject !== filters.subject) return false;
    if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
    return true;
  });

  return (
    <div className="container">
      <div style={styles.header}>
        <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
        <h1 style={styles.pageTitle}>Create New Exam</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card mb-3">
          <h2 style={styles.sectionTitle}>Exam Details</h2>
          
          <div className="grid grid-2">
            <div className="form-group">
              <label>Exam Title *</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Mathematics Final Exam"
              />
            </div>

            <div className="form-group">
              <label>Subject *</label>
              <input
                type="text"
                name="subject"
                className="form-control"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="e.g., Mathematics"
                list="subjects-list"
              />
              <datalist id="subjects-list">
                {subjects.map(subject => (
                  <option key={subject} value={subject} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Brief description of the exam"
            />
          </div>

          <div className="grid grid-3">
            <div className="form-group">
              <label>Duration (minutes) *</label>
              <input
                type="number"
                name="duration"
                className="form-control"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Total Marks *</label>
              <input
                type="number"
                name="totalMarks"
                className="form-control"
                value={formData.totalMarks}
                onChange={handleChange}
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Passing Marks *</label>
              <input
                type="number"
                name="passingMarks"
                className="form-control"
                value={formData.passingMarks}
                onChange={handleChange}
                required
                min="0"
                max={formData.totalMarks}
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Scheduled Date *</label>
              <input
                type="datetime-local"
                name="scheduledDate"
                className="form-control"
                value={formData.scheduledDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date *</label>
              <input
                type="datetime-local"
                name="endDate"
                className="form-control"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active (students can take this exam)
            </label>
          </div>
        </div>

        <div className="card mb-3">
          <h2 style={styles.sectionTitle}>
            Select Questions ({selectedQuestions.length} selected)
          </h2>

          {/* Filters */}
          <div className="grid grid-2 mb-3">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Filter by Subject</label>
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
              <label>Filter by Difficulty</label>
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

          {filteredQuestions.length === 0 ? (
            <p style={styles.emptyState}>No questions available. Please create questions first.</p>
          ) : (
            <div style={styles.questionsList}>
              {filteredQuestions.map((question, index) => (
                <div
                  key={question._id}
                  style={{
                    ...styles.questionCard,
                    ...(selectedQuestions.includes(question._id) ? styles.selectedCard : {})
                  }}
                  onClick={() => toggleQuestionSelection(question._id)}
                >
                  <div style={styles.questionHeader}>
                    <div style={styles.checkboxContainer}>
                      <input
                        type="checkbox"
                        checked={selectedQuestions.includes(question._id)}
                        onChange={() => {}}
                        style={styles.checkbox}
                      />
                      <span style={styles.questionNumber}>Q{index + 1}</span>
                    </div>
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
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div style={styles.submitContainer}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/admin')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading || selectedQuestions.length === 0}
            >
              {loading ? 'Creating...' : 'Create Exam'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
  },
  pageTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: 'white',
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
    display: 'grid',
    gap: '12px',
    maxHeight: '500px',
    overflowY: 'auto',
    padding: '4px',
  },
  questionCard: {
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  selectedCard: {
    borderColor: '#667eea',
    background: '#f0f4ff',
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  questionNumber: {
    fontWeight: '600',
    color: '#667eea',
  },
  badges: {
    display: 'flex',
    gap: '8px',
  },
  questionText: {
    fontSize: '15px',
    color: '#333',
    marginBottom: 0,
    lineHeight: '1.5',
  },
  submitContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
  },
};

export default CreateExam;
