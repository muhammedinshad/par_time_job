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
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg px-8 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-[#e5e7eb]">
      <div className="text-2xl font-extrabold bg-gradient-to-r from-[#136040] to-[#1d8258] bg-clip-text text-transparent">Part-Time Jobs</div>
      <ul className="flex gap-8 list-none items-center">
        <li><Link to="/" className="text-[#111827] no-underline font-medium hover:text-[#136040] transition-colors">Home</Link></li>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            <Link to="/profile" className="flex items-center gap-3 cursor-pointer px-3 py-1.5 rounded-xl transition-all duration-300 bg-[#f5f7f6] border border-[#e5e7eb] no-underline hover:bg-gray-100 hover:-translate-y-0.5">
              <div className="w-[35px] h-[35px] bg-[#136040] rounded-full flex items-center justify-center font-bold text-white uppercase">
                {user?.name?.charAt(0) || user?.suggested_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <span className="text-[0.95rem] font-semibold text-[#111827]">
                {user?.name || user?.suggested_name || 'Profile'}
              </span>
            </Link>
            <li>
              <button onClick={handleLogout} className="bg-transparent text-red-500 border border-red-500 px-4 py-1.5 text-sm rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                Logout
              </button>
            </li>
          </div>
        ) : (
          <li><Link to="/verify" className="text-[#111827] no-underline font-medium hover:text-[#136040] transition-colors">Register/Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
