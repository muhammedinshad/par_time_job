import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    try {
      const params = new URLSearchParams(window.location.search);
      const email = params.get('email');
      const role = params.get('role');
      const profile_complete = params.get('profile_complete') === 'true';
      const suggested_name = params.get('suggested_name');

      console.log('Google callback params:', { email, role, profile_complete });

      if (!email) throw new Error('No email in callback');

      dispatch(setCredentials({
        user: { email, suggested_name },
        role: role || null,
      }));

      if (!role) {
        // First time login - No role selected yet
        navigate('/complete-profile');
      } else if (!profile_complete) {
        // Role selected but profile details missing
        navigate(`/complete-profile?role=${role}`);
      } else {
        // Returning user with complete profile - Go to dashboard
        if (role === 'employer') navigate('/employer/dashboard');
        else if (role === 'job_seeker') navigate('/jobseeker/dashboard');
        else navigate('/');
      }
    } catch (error) {
      console.error('Google callback error:', error);
      navigate('/login?error=google_auth_failed');
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600">Completing Google login...</p>
    </div>
  );
};

export default GoogleCallback;