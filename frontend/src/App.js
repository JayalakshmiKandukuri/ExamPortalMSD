import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import TakeExam from './pages/student/TakeExam';
import ViewResult from './pages/student/ViewResult';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageQuestions from './pages/admin/ManageQuestions';
import CreateExam from './pages/admin/CreateExam';
import ViewExamResults from './pages/admin/ViewExamResults';

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin' : '/student'} />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === 'admin' ? '/admin' : '/student'} />} />
        
        {/* Student Routes */}
        <Route path="/student" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
        <Route path="/student/exam/:examId" element={<PrivateRoute role="student"><TakeExam /></PrivateRoute>} />
        <Route path="/student/result/:resultId" element={<PrivateRoute role="student"><ViewResult /></PrivateRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/questions" element={<PrivateRoute role="admin"><ManageQuestions /></PrivateRoute>} />
        <Route path="/admin/create-exam" element={<PrivateRoute role="admin"><CreateExam /></PrivateRoute>} />
        <Route path="/admin/results/:examId" element={<PrivateRoute role="admin"><ViewExamResults /></PrivateRoute>} />
        <Route path="/admin/result/:resultId" element={<PrivateRoute role="admin"><ViewResult /></PrivateRoute>} />
        
        {/* Default Route */}
        <Route path="/" element={
          user ? (
            <Navigate to={user.role === 'admin' ? '/admin' : '/student'} />
          ) : (
            <Navigate to="/login" />
          )
        } />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
