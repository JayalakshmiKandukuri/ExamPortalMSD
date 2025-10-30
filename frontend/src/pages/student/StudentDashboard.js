import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Clock, Calendar, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [examsRes, resultsRes] = await Promise.all([
        axios.get('/api/exams/available'),
        axios.get('/api/results/my-results')
      ]);
      setExams(examsRes.data);
      setResults(resultsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h1 style={styles.pageTitle}>Student Dashboard</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Stats Cards */}
      <div className="grid grid-3 mb-3">
        <div className="card" style={styles.statCard}>
          <div style={styles.statIcon}>
            <BookOpen size={32} color="#667eea" />
          </div>
          <h3 style={styles.statValue}>{exams.length}</h3>
          <p style={styles.statLabel}>Available Exams</p>
        </div>
        <div className="card" style={styles.statCard}>
          <div style={styles.statIcon}>
            <CheckCircle size={32} color="#28a745" />
          </div>
          <h3 style={styles.statValue}>{results.length}</h3>
          <p style={styles.statLabel}>Completed Exams</p>
        </div>
        <div className="card" style={styles.statCard}>
          <div style={styles.statIcon}>
            <TrendingUp size={32} color="#ffc107" />
          </div>
          <h3 style={styles.statValue}>
            {results.length > 0 
              ? `${(results.reduce((acc, r) => acc + r.percentage, 0) / results.length).toFixed(1)}%`
              : 'N/A'}
          </h3>
          <p style={styles.statLabel}>Average Score</p>
        </div>
      </div>

      {/* Available Exams */}
      <div className="card">
        <h2 style={styles.sectionTitle}>Available Exams</h2>
        {exams.length === 0 ? (
          <p style={styles.emptyState}>No exams available at the moment.</p>
        ) : (
          <div className="grid grid-2">
            {exams.map((exam) => (
              <div key={exam._id} style={styles.examCard}>
                <h3 style={styles.examTitle}>{exam.title}</h3>
                <p style={styles.examDescription}>{exam.description}</p>
                <div style={styles.examDetails}>
                  <div style={styles.examDetail}>
                    <Calendar size={16} />
                    <span>{formatDate(exam.scheduledDate)}</span>
                  </div>
                  <div style={styles.examDetail}>
                    <Clock size={16} />
                    <span>{exam.duration} minutes</span>
                  </div>
                  <div style={styles.examDetail}>
                    <BookOpen size={16} />
                    <span>{exam.subject}</span>
                  </div>
                </div>
                <div style={styles.examFooter}>
                  <span style={styles.marks}>{exam.totalMarks} Marks</span>
                  {exam.attempted ? (
                    <span className="badge badge-success">Completed</span>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/student/exam/${exam._id}`)}
                    >
                      Start Exam
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Results */}
      <div className="card mt-3">
        <h2 style={styles.sectionTitle}>Recent Results</h2>
        {results.length === 0 ? (
          <p style={styles.emptyState}>No results yet. Take an exam to see your results here.</p>
        ) : (
          <div style={styles.resultsContainer}>
            {results.slice(0, 5).map((result) => (
              <div key={result._id} style={styles.resultCard}>
                <div style={styles.resultHeader}>
                  <div>
                    <h4 style={styles.resultTitle}>{result.exam.title}</h4>
                    <p style={styles.resultSubject}>{result.exam.subject}</p>
                  </div>
                  {result.passed ? (
                    <CheckCircle size={32} color="#28a745" />
                  ) : (
                    <XCircle size={32} color="#dc3545" />
                  )}
                </div>
                <div style={styles.resultStats}>
                  <div style={styles.resultStat}>
                    <span style={styles.resultLabel}>Score</span>
                    <span style={styles.resultValue}>{result.score}/{result.exam.totalMarks}</span>
                  </div>
                  <div style={styles.resultStat}>
                    <span style={styles.resultLabel}>Percentage</span>
                    <span style={styles.resultValue}>{result.percentage}%</span>
                  </div>
                  <div style={styles.resultStat}>
                    <span style={styles.resultLabel}>Correct</span>
                    <span style={styles.resultValue}>{result.correctAnswers}/{result.totalQuestions}</span>
                  </div>
                </div>
                <button
                  className="btn btn-outline"
                  style={{ width: '100%', marginTop: '12px' }}
                  onClick={() => navigate(`/student/result/${result._id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '30px',
  },
  statCard: {
    textAlign: 'center',
  },
  statIcon: {
    marginBottom: '12px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '4px',
  },
  statLabel: {
    color: '#666',
    fontSize: '14px',
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
  examCard: {
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '20px',
    transition: 'all 0.3s ease',
  },
  examTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  examDescription: {
    color: '#666',
    marginBottom: '16px',
    fontSize: '14px',
  },
  examDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },
  examDetail: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#666',
    fontSize: '14px',
  },
  examFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #e0e0e0',
  },
  marks: {
    fontWeight: '600',
    color: '#667eea',
  },
  resultsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  resultCard: {
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '20px',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  resultTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '4px',
  },
  resultSubject: {
    color: '#666',
    fontSize: '14px',
  },
  resultStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid #e0e0e0',
  },
  resultStat: {
    textAlign: 'center',
  },
  resultLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#666',
    marginBottom: '4px',
  },
  resultValue: {
    display: 'block',
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
  },
};

export default StudentDashboard;
