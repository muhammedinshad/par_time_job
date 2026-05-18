import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { logoutApi } from '../../api/authApi';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API fails, we should clear local state
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">Part-Time Jobs</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        
        {isAuthenticated ? (
          <div className="user-menu">
            <Link to="/profile" className="profile-link">
              <div className="profile-icon">
                {user?.name?.charAt(0) || user?.suggested_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <span className="profile-name">
                {user?.name || user?.suggested_name || 'Profile'}
              </span>
            </Link>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </div>
        ) : (
          <li><Link to="/verify">Register/Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
