import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Award, TrendingUp, ArrowLeft } from 'lucide-react';

const ViewResult = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    try {
      const response = await axios.get(`/api/results/${resultId}`);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch result');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading result...</div>;
  if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;
  if (!result) return <div className="container"><div className="alert alert-error">Result not found</div></div>;

  return (
    <div className="container">
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/student')}>
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* Result Header */}
      <div className="card mb-3">
        <div style={styles.resultHeader}>
          <div>
            <h1 style={styles.examTitle}>{result.exam.title}</h1>
            <p style={styles.examSubject}>{result.exam.subject}</p>
            <p style={styles.submittedDate}>
              Submitted: {new Date(result.submittedAt).toLocaleString()}
            </p>
          </div>
          <div style={styles.statusIcon}>
            {result.passed ? (
              <CheckCircle size={64} color="#28a745" />
            ) : (
              <XCircle size={64} color="#dc3545" />
            )}
          </div>
        </div>
        
        <div style={styles.statusBanner} className={result.passed ? 'alert-success' : 'alert-error'}>
          <h2 style={styles.statusText}>
            {result.passed ? '🎉 Congratulations! You Passed!' : '😔 You Did Not Pass'}
          </h2>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-3 mb-3">
        <div className="card" style={styles.scoreCard}>
          <div style={styles.scoreIcon}>
            <Award size={32} color="#667eea" />
          </div>
          <h3 style={styles.scoreValue}>{result.score}/{result.exam.totalMarks}</h3>
          <p style={styles.scoreLabel}>Total Score</p>
        </div>
        
        <div className="card" style={styles.scoreCard}>
          <div style={styles.scoreIcon}>
            <TrendingUp size={32} color="#ffc107" />
          </div>
          <h3 style={styles.scoreValue}>{result.percentage}%</h3>
          <p style={styles.scoreLabel}>Percentage</p>
        </div>
        
        <div className="card" style={styles.scoreCard}>
          <div style={styles.scoreIcon}>
            <CheckCircle size={32} color="#28a745" />
          </div>
          <h3 style={styles.scoreValue}>{result.correctAnswers}/{result.totalQuestions}</h3>
          <p style={styles.scoreLabel}>Correct Answers</p>
        </div>
      </div>

      {/* Detailed Answers */}
      <div className="card">
        <h2 style={styles.sectionTitle}>Detailed Review</h2>
        <div style={styles.answersContainer}>
          {result.answers.map((answer, index) => (
            <div key={answer._id} style={styles.answerCard}>
              <div style={styles.answerHeader}>
                <h3 style={styles.questionNumber}>Question {index + 1}</h3>
                {answer.isCorrect ? (
                  <CheckCircle size={24} color="#28a745" />
                ) : (
                  <XCircle size={24} color="#dc3545" />
                )}
              </div>
              
              <p style={styles.questionText}>{answer.questionId.questionText}</p>
              
              <div style={styles.optionsReview}>
                {answer.questionId.options.map((option, optIndex) => {
                  const isCorrect = optIndex === answer.questionId.correctAnswer;
                  const isSelected = optIndex === answer.selectedAnswer;
                  
                  return (
                    <div
                      key={optIndex}
                      style={{
                        ...styles.optionReview,
                        ...(isCorrect ? styles.correctOption : {}),
                        ...(isSelected && !isCorrect ? styles.wrongOption : {}),
                      }}
                    >
                      <span style={styles.optionText}>{option}</span>
                      {isCorrect && <CheckCircle size={18} color="#28a745" />}
                      {isSelected && !isCorrect && <XCircle size={18} color="#dc3545" />}
                    </div>
                  );
                })}
              </div>
              
              <div style={styles.answerFeedback}>
                {answer.isCorrect ? (
                  <span style={styles.correctFeedback}>✓ Correct Answer</span>
                ) : (
                  <span style={styles.wrongFeedback}>✗ Wrong Answer</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  resultHeader: {
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
    marginBottom: '8px',
  },
  submittedDate: {
    color: '#999',
    fontSize: '14px',
  },
  statusIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBanner: {
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  statusText: {
    fontSize: '24px',
    fontWeight: '600',
    margin: 0,
  },
  scoreCard: {
    textAlign: 'center',
  },
  scoreIcon: {
    marginBottom: '12px',
  },
  scoreValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '4px',
  },
  scoreLabel: {
    color: '#666',
    fontSize: '14px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  answersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  answerCard: {
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '20px',
  },
  answerHeader: {
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
  questionText: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '16px',
    lineHeight: '1.6',
  },
  optionsReview: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px',
  },
  optionReview: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
  },
  correctOption: {
    background: '#d4edda',
    borderColor: '#28a745',
  },
  wrongOption: {
    background: '#f8d7da',
    borderColor: '#dc3545',
  },
  optionText: {
    fontSize: '15px',
    color: '#333',
  },
  answerFeedback: {
    paddingTop: '12px',
    borderTop: '1px solid #e0e0e0',
  },
  correctFeedback: {
    color: '#28a745',
    fontWeight: '600',
  },
  wrongFeedback: {
    color: '#dc3545',
    fontWeight: '600',
  },
};

export default ViewResult;
