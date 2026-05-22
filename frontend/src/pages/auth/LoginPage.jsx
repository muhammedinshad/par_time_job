import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login({ email, password });
      dispatch(setCredentials({
        user: { email: response.email },
        role: response.role,
      }));
      
      if (response.role === 'employer') {
        navigate('/employer/dashboard');
      } else if (response.role === 'job_seeker') {
        navigate('/jobseeker/dashboard');
      } else if (response.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-center text-[#111827] mt-8 text-3xl font-bold">Login</h1>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl flex flex-col gap-6 max-w-[450px] mx-auto my-8 shadow-sm border border-[#e5e7eb]">
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="flex items-center text-center my-2 text-[#6b7280] before:flex-1 before:border-b before:border-[#e5e7eb] after:flex-1 after:border-b after:border-[#e5e7eb] before:mr-4 after:ml-4">
          <span>OR</span>
        </div>

        <button 
          type="button" 
          className="bg-white text-[#111827] flex items-center justify-center gap-3 font-semibold border border-[#e5e7eb] hover:bg-gray-50 hover:-translate-y-0.5" 
          onClick={() => window.location.href = 'http://localhost:8000/api/auth/accounts/google/login/?process=login'}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Login with Google
        </button>

        <p className="text-center mt-4 text-[#6b7280]">
          Don't have an account? <span onClick={() => navigate('/verify')} className="text-[#136040] cursor-pointer underline">Register</span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
