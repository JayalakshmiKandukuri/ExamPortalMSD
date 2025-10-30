import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExam();
  }, [examId]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && exam) {
      handleSubmit();
    }
  }, [timeRemaining]);

  const fetchExam = async () => {
    try {
      const response = await axios.get(`/api/exams/${examId}`);
      setExam(response.data);
      setAnswers(new Array(response.data.questions.length).fill(null));
      setTimeRemaining(response.data.duration * 60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch exam');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const unanswered = answers.filter(a => a === null).length;
    if (unanswered > 0) {
      if (!window.confirm(`You have ${unanswered} unanswered questions. Are you sure you want to submit?`)) {
        return;
      }
    }

    setSubmitting(true);

    try {
      const response = await axios.post('/api/results/submit', {
        examId: exam._id,
        answers: answers.map(a => a === null ? 0 : a)
      });
      navigate(`/student/result/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit exam');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="loading">Loading exam...</div>;
  if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;
  if (!exam) return <div className="container"><div className="alert alert-error">Exam not found</div></div>;

  const question = exam.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / exam.questions.length) * 100;
  const answeredCount = answers.filter(a => a !== null).length;

  return (
    <div className="container">
      {/* Exam Header */}
      <div className="card mb-3">
        <div style={styles.examHeader}>
          <div>
            <h1 style={styles.examTitle}>{exam.title}</h1>
            <p style={styles.examSubject}>{exam.subject}</p>
          </div>
          <div style={styles.timerContainer}>
            <Clock size={24} color={timeRemaining < 300 ? '#dc3545' : '#667eea'} />
            <span style={{
              ...styles.timer,
              color: timeRemaining < 300 ? '#dc3545' : '#667eea'
            }}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
        </div>
        <p style={styles.progressText}>
          Question {currentQuestion + 1} of {exam.questions.length} | 
          Answered: {answeredCount}/{exam.questions.length}
        </p>
      </div>

      {/* Question Card */}
      <div className="card">
        <div style={styles.questionHeader}>
          <h2 style={styles.questionNumber}>Question {currentQuestion + 1}</h2>
          {answers[currentQuestion] !== null && (
            <CheckCircle size={24} color="#28a745" />
          )}
        </div>
        
        <p style={styles.questionText}>{question.questionText}</p>

        <div style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <div
              key={index}
              style={{
                ...styles.option,
                ...(answers[currentQuestion] === index ? styles.selectedOption : {})
              }}
              onClick={() => handleAnswerSelect(index)}
            >
              <div style={styles.optionRadio}>
                {answers[currentQuestion] === index && <div style={styles.optionRadioSelected}></div>}
              </div>
              <span style={styles.optionText}>{option}</span>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div style={styles.navigationButtons}>
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          
          <div style={styles.rightButtons}>
            {currentQuestion < exam.questions.length - 1 ? (
              <button className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Exam'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question Navigator */}
      <div className="card mt-3">
        <h3 style={styles.navigatorTitle}>Question Navigator</h3>
        <div style={styles.questionGrid}>
          {exam.questions.map((_, index) => (
            <button
              key={index}
              style={{
                ...styles.questionButton,
                ...(currentQuestion === index ? styles.currentQuestionButton : {}),
                ...(answers[index] !== null ? styles.answeredQuestionButton : {})
              }}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  examHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  examTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '4px',
  },
  examSubject: {
    color: '#666',
    fontSize: '16px',
  },
  timerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#f8f9fa',
    padding: '12px 20px',
    borderRadius: '8px',
  },
  timer: {
    fontSize: '24px',
    fontWeight: '700',
  },
  progressContainer: {
    width: '100%',
    height: '8px',
    background: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    transition: 'width 0.3s ease',
  },
  progressText: {
    color: '#666',
    fontSize: '14px',
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  questionNumber: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#667eea',
  },
  questionText: {
    fontSize: '18px',
    color: '#333',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  selectedOption: {
    borderColor: '#667eea',
    background: '#f0f4ff',
  },
  optionRadio: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid #667eea',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionRadioSelected: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#667eea',
  },
  optionText: {
    fontSize: '16px',
    color: '#333',
  },
  navigationButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '20px',
    borderTop: '1px solid #e0e0e0',
  },
  rightButtons: {
    display: 'flex',
    gap: '12px',
  },
  navigatorTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '16px',
  },
  questionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
    gap: '8px',
  },
  questionButton: {
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  currentQuestionButton: {
    borderColor: '#667eea',
    background: '#667eea',
    color: 'white',
  },
  answeredQuestionButton: {
    background: '#d4edda',
    borderColor: '#28a745',
  },
};

export default TakeExam;
