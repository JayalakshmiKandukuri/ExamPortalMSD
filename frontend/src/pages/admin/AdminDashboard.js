import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, FileQuestion, Users, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalExams: 0,
    totalQuestions: 0,
    totalResults: 0,
    averageScore: 0
  });
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [examsRes, questionsRes, resultsRes] = await Promise.all([
        axios.get('/api/exams'),
        axios.get('/api/questions'),
        axios.get('/api/results/all')
      ]);

      setExams(examsRes.data);
      
      const avgScore = resultsRes.data.length > 0
        ? resultsRes.data.reduce((acc, r) => acc + r.percentage, 0) / resultsRes.data.length
        : 0;

      setStats({
        totalExams: examsRes.data.length,
        totalQuestions: questionsRes.data.length,
        totalResults: resultsRes.data.length,
        averageScore: avgScore.toFixed(1)
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam? This will also delete all associated results.')) {
      return;
    }

    try {
      await axios.delete(`/api/exams/${examId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete exam');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Admin Dashboard</h1>
        <div style={styles.headerButtons}>
          <button className="btn btn-primary" onClick={() => navigate('/admin/questions')}>
            <FileQuestion size={18} />
            Manage Questions
          </button>
          <button className="btn btn-success" onClick={() => navigate('/admin/create-exam')}>
            <Plus size={18} />
            Create Exam
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Stats Cards */}
      <div className="grid grid-3 mb-3">
        <div className="card" style={styles.statCard}>
          <div style={styles.statIcon}>
            <BookOpen size={32} color="#667eea" />
          </div>
          <h3 style={styles.statValue}>{stats.totalExams}</h3>
          <p style={styles.statLabel}>Total Exams</p>
        </div>
        
        <div className="card" style={styles.statCard}>
          <div style={styles.statIcon}>
            <FileQuestion size={32} color="#28a745" />
          </div>
          <h3 style={styles.statValue}>{stats.totalQuestions}</h3>
          <p style={styles.statLabel}>Total Questions</p>
        </div>
        
        <div className="card" style={styles.statCard}>
          <div style={styles.statIcon}>
            <Users size={32} color="#ffc107" />
          </div>
          <h3 style={styles.statValue}>{stats.totalResults}</h3>
          <p style={styles.statLabel}>Total Submissions</p>
        </div>
      </div>

      {/* Exams List */}
      <div className="card">
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>All Exams</h2>
        </div>

        {exams.length === 0 ? (
          <p style={styles.emptyState}>No exams created yet. Create your first exam!</p>
        ) : (
          <div style={styles.tableContainer}>
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Questions</th>
                  <th>Duration</th>
                  <th>Marks</th>
                  <th>Scheduled Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam._id}>
                    <td style={styles.examTitle}>{exam.title}</td>
                    <td>{exam.subject}</td>
                    <td>{exam.questions.length}</td>
                    <td>{exam.duration} min</td>
                    <td>{exam.totalMarks}</td>
                    <td>{formatDate(exam.scheduledDate)}</td>
                    <td>
                      <span className={`badge ${exam.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {exam.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={styles.actionButtons}>
                        <button
                          className="btn btn-primary"
                          style={styles.actionBtn}
                          onClick={() => navigate(`/admin/exam/${exam._id}`)}
                          title="View Details"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={styles.actionBtn}
                          onClick={() => navigate(`/admin/results/${exam._id}`)}
                          title="View Results"
                        >
                          <TrendingUp size={16} />
                        </button>
                        <button
                          className="btn btn-danger"
                          style={styles.actionBtn}
                          onClick={() => handleDeleteExam(exam._id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
  headerButtons: {
    display: 'flex',
    gap: '12px',
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
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
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
  examTitle: {
    fontWeight: '600',
    color: '#333',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    padding: '8px 12px',
    minWidth: 'auto',
  },
};

export default AdminDashboard;
