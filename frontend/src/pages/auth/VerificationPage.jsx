import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import OtpInput from '../../components/auth/OtpInput';
import { sendOTP, verifyOTP } from '../../api/authApi';

const VerificationPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('job_seeker');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await sendOTP({ email, role });
      setStep(2);
    } catch (err) {
      console.log("error is",err.response.data.email.email)
      setError(err.response?.data.email.email || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    setLoading(true);
    setError('');
    try {
      const response = await verifyOTP({ email, otp_code: otp });
      if (response.otp_verified) {
        // Redirect to registration page with email and role in state
        const targetPath = role === 'employer' ? '/register/employer' : '/register/jobseeker';
        navigate(targetPath, { state: { email, role } });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-container">
      {error && <div className="error-message" style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
      
      {step === 1 ? (
        <form onSubmit={handleSendOtp}>
          <h2>Verify Your Email</h2>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1rem' }}>
            We will send a 6-digit code to your email.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: '0.8rem' }}>
              <option value="job_seeker">I am looking for a job</option>
              <option value="employer">I want to hire people</option>
            </select>
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Login here</Link>
            </p>
          </div>
        </form>
      ) : (
        <div className="otp-section" style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem', maxWidth: '450px', margin: '2rem auto', textAlign: 'center' }}>
          <h2>Enter Verification Code</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            A 6-digit code has been sent to <strong>{email}</strong>
          </p>
          <OtpInput length={6} onComplete={handleVerifyOtp} />
          <button 
            onClick={() => setStep(1)} 
            style={{ background: 'transparent', border: 'none', color: 'var(--primary)', marginTop: '1.5rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Change Email
          </button>
        </div>
      )}
    </div>
  );
};

export default VerificationPage;
