import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';

// Set cookie from JS (not httponly, but needed for cross-port Google flow)
function setCookie(name, value, minutes) {
  const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    try {
      const params = new URLSearchParams(window.location.search);
      const email          = params.get('email');
      const role           = params.get('role');
      const profile_complete = params.get('profile_complete') === 'true';
      const suggested_name = params.get('suggested_name');
      const access_token   = params.get('access_token');
      const refresh_token  = params.get('refresh_token');

      if (!email) throw new Error('No email in callback');

      // ✅ Store tokens as cookies
      if (access_token)  setCookie('access_token',  access_token,  5);
      if (refresh_token) setCookie('refresh_token', refresh_token, 60 * 24 * 7);

      // ✅ Clean URL — remove tokens from browser history
      window.history.replaceState({}, '', '/google/callback');

      dispatch(setCredentials({
        user: { email, suggested_name },
        role: role || null,
      }));

      if (!role) {
        navigate('/complete-profile');
      } else if (!profile_complete) {
        navigate(`/complete-profile?role=${role}`);
      } else {
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