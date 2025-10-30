import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div className="container" style={styles.navContent}>
        <Link to="/" style={styles.logo}>
          <BookOpen size={28} />
          <span>Online Exam System</span>
        </Link>
        
        {user && (
          <div style={styles.navRight}>
            <div style={styles.userInfo}>
              <User size={20} />
              <span>{user.name}</span>
              <span style={styles.badge}>{user.role}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary" style={styles.logoutBtn}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '24px',
    fontWeight: '700',
    color: '#667eea',
    textDecoration: 'none',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#333',
    fontWeight: '500',
  },
  badge: {
    background: '#667eea',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    textTransform: 'uppercase',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
};

export default Navbar;
