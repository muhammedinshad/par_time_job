import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import OtpInput from '../../components/auth/OtpInput';
import { sendOTP, verifyOTP } from '../../api/authApi';

const VerificationPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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
    <div>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      
      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="bg-white p-8 rounded-2xl flex flex-col gap-6 max-w-[450px] mx-auto my-8 shadow-sm border border-[#e5e7eb]">
          <h2 className="text-2xl font-bold text-[#111827] text-center">Verify Your Email</h2>
          <p className="text-[#6b7280] text-center">
            We will send a 6-digit code to your email.
          </p>
          <div className="flex flex-col gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="job_seeker" className="bg-white">I am looking for a job</option>
              <option value="employer" className="bg-white">I want to hire people</option>
            </select>
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <p className="text-center mt-4 text-sm text-[#6b7280]">
              Already have an account? <Link to="/login" className="text-[#136040] font-bold">Login here</Link>
            </p>
          </div>
        </form>
      ) : (
        <div className="bg-white p-8 rounded-2xl max-w-[450px] mx-auto my-8 text-center shadow-sm border border-[#e5e7eb]">
          <h2 className="text-2xl font-bold text-[#111827] mb-2">Enter Verification Code</h2>
          <p className="text-[#6b7280] mb-8">
            A 6-digit code has been sent to <strong>{email}</strong>
          </p>
          <OtpInput length={6} onComplete={handleVerifyOtp} />
          <button 
            onClick={() => setStep(1)} 
            className="bg-transparent border-none text-[#136040] mt-6 cursor-pointer underline font-semibold"
          >
            Change Email
          </button>
        </div>
      )}
    </div>
  );
};

export default VerificationPage;
