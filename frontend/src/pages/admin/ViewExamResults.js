import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, TrendingUp, Users, Award, Download } from 'lucide-react';

const ViewExamResults = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    passRate: 0,
    highestScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [examId]);

  const fetchData = async () => {
    try {
      const [examRes, resultsRes] = await Promise.all([
        axios.get(`/api/exams/${examId}`),
        axios.get(`/api/results/exam/${examId}`)
      ]);

      setExam(examRes.data);
      setResults(resultsRes.data);

      if (resultsRes.data.length > 0) {
        const avgScore = resultsRes.data.reduce((acc, r) => acc + r.percentage, 0) / resultsRes.data.length;
        const passCount = resultsRes.data.filter(r => r.passed).length;
        const highestScore = Math.max(...resultsRes.data.map(r => r.score));

        setStats({
          totalAttempts: resultsRes.data.length,
          averageScore: avgScore.toFixed(1),
          passRate: ((passCount / resultsRes.data.length) * 100).toFixed(1),
          highestScore: highestScore
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;
  if (!exam) return <div className="container"><div className="alert alert-error">Exam not found</div></div>;

  return (
    <div className="container">
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/admin')}>
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* Exam Info */}
      <div className="card mb-3">
        <h1 style={styles.examTitle}>{exam.title}</h1>
        <p style={styles.examSubject}>{exam.subject}</p>
        <div style={styles.examInfo}>
          <span>Duration: {exam.duration} minutes</span>
          <span>Total Marks: {exam.totalMarks}</span>
          <span>Passing Marks: {exam.passingMarks}</span>
          <span>Questions: {exam.questions.length}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-3 mb-3">
        <div className="card" style={styles.statCard}>
          <div style={styles.statIcon}>
            <Users size={32} color="#667eea" />
          </div>
          <h3 style={styles.statValue}>{stats.totalAttempts}</h3>
          <p style={styles.statLabel}>Total Attempts</p>
        </div>

        <div className="card" style={styles.statCard}>
          <div style={styles.statIcon}>
            <TrendingUp size={32} color="#ffc107" />
          </div>
          <h3 style={styles.statValue}>{stats.averageScore}%</h3>
          <p style={styles.statLabel}>Average Score</p>
        </div>

        <div className="card" style={styles.statCard}>
          <div style={styles.statIcon}>
            <Award size={32} color="#28a745" />
          </div>
          <h3 style={styles.statValue}>{stats.passRate}%</h3>
          <p style={styles.statLabel}>Pass Rate</p>
        </div>
      </div>

      {/* Results Table */}
      <div className="card">
        <h2 style={styles.sectionTitle}>Student Results</h2>

        {results.length === 0 ? (
          <p style={styles.emptyState}>No students have attempted this exam yet.</p>
        ) : (
          <div style={styles.tableContainer}>
            <table className="table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Correct Answers</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result._id}>
                    <td style={styles.studentName}>{result.student.name}</td>
                    <td>{result.student.email}</td>
                    <td style={styles.score}>{result.score}/{exam.totalMarks}</td>
                    <td>
                      <span style={{
                        ...styles.percentage,
                        color: result.percentage >= 75 ? '#28a745' :
                               result.percentage >= 50 ? '#ffc107' : '#dc3545'
                      }}>
                        {result.percentage}%
                      </span>
                    </td>
                    <td>{result.correctAnswers}/{result.totalQuestions}</td>
                    <td>
                      <span className={`badge ${result.passed ? 'badge-success' : 'badge-danger'}`}>
                        {result.passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td>{formatDate(result.submittedAt)}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        style={styles.viewBtn}
                        onClick={() => navigate(`/admin/result/${result._id}`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  examTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '4px',
  },
  examSubject: {
    color: '#666',
    fontSize: '16px',
    marginBottom: '12px',
  },
  examInfo: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    color: '#666',
    fontSize: '14px',
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
  tableContainer: {
    overflowX: 'auto',
  },
  studentName: {
    fontWeight: '600',
    color: '#333',
  },
  score: {
    fontWeight: '600',
    color: '#667eea',
  },
  percentage: {
    fontWeight: '600',
    fontSize: '16px',
  },
  viewBtn: {
    padding: '6px 12px',
    fontSize: '14px',
  },
};

export default ViewExamResults;
