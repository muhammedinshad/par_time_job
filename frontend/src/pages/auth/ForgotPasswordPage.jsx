import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../../api/authApi';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Step 1: Submit Email to get OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await forgotPassword(email);
      setSuccess(response.message || 'OTP code sent successfully to your email!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'No account found with this email, or failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP + New Passwords together to /reset-password/
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (otp.length < 6) {
      setError('Please enter the 6-digit OTP received in email.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await resetPassword({
        email,
        otp_code: otp,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      setSuccess('Password reset successfully! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      // Properly extract form errors from backend response (e.g. otp_code error)
      const errData = err.response?.data;
      if (errData) {
        if (typeof errData === 'object') {
          const firstError = Object.values(errData)[0];
          setError(Array.isArray(firstError) ? firstError[0] : (typeof firstError === 'string' ? firstError : 'Failed to reset password.'));
        } else {
          setError(errData.error || errData.message || 'Failed to reset password.');
        }
      } else {
        setError('Failed to reset password. Please check your OTP code and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center items-center py-10 px-4 bg-[#f5f7f6]">
      {/* Title Header */}
      <h1 className="text-center text-[#111827] mb-2 text-3xl font-extrabold tracking-tight animate-fadeIn">
        Reset Password
      </h1>
      <p className="text-[#6b7280] text-center text-[15px] mb-8 font-medium max-w-[450px] animate-fadeIn">
        Follow the simple 2-step process to recover your account.
      </p>

      {/* Card container */}
      <div className="w-full max-w-[480px] bg-white p-8 rounded-3xl shadow-sm border border-[#e5e7eb] flex flex-col transition-all duration-300">
        
        {/* Simplified Progress Steps Indicator */}
        <div className="flex justify-between items-center mb-8 max-w-[280px] mx-auto w-full">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all duration-300 ${
              step >= 1 ? 'bg-[#136040] text-white border-[#136040] shadow-sm' : 'bg-white text-gray-400 border-gray-200'
            }`}>
              1
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= 1 ? 'text-[#136040]' : 'text-gray-400'}`}>Request OTP</span>
          </div>
          <div className={`h-0.5 flex-1 mb-4 transition-all duration-500 ${step >= 2 ? 'bg-[#136040]' : 'bg-gray-200'}`}></div>
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all duration-300 ${
              step >= 2 ? 'bg-[#136040] text-white border-[#136040] shadow-sm' : 'bg-white text-gray-400 border-gray-200'
            }`}>
              2
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= 2 ? 'text-[#136040]' : 'text-gray-400'}`}>Set Password</span>
          </div>
        </div>

        {/* Success / Error Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm flex items-start gap-2.5 animate-fadeIn">
            <svg className="w-5 h-5 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium leading-normal">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 mb-6 text-sm flex items-start gap-2.5 animate-fadeIn">
            <svg className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium leading-normal">{success}</span>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="flex flex-col gap-5 animate-fadeIn">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#4b5563] uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full text-base bg-white"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#136040] hover:bg-[#0f4f34] text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Requesting OTP...</span>
                </>
              ) : (
                'Request OTP'
              )}
            </button>
            
            <p className="text-center mt-2 text-sm text-[#6b7280]">
              Remember your password? <Link to="/login" className="text-[#136040] font-bold hover:underline">Log in</Link>
            </p>
          </form>
        )}

        {/* STEP 2: Enter OTP + New Password (Unified Form) */}
        {step === 2 && (
          <form onSubmit={handleResetSubmit} className="flex flex-col gap-5 animate-fadeIn">
            <div>
              <p className="text-[#4b5563] text-sm leading-relaxed mb-4 text-center">
                OTP sent to <strong className="text-[#111827]">{email}</strong>. <br />
                Please enter the OTP and your new password.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#4b5563] uppercase tracking-wider">OTP Code</label>
              <input 
                type="text" 
                maxLength="6"
                placeholder="Enter 6-digit OTP" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                required 
                className="w-full text-base bg-white text-center font-bold tracking-widest text-lg"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#4b5563] uppercase tracking-wider">New Password</label>
              <input 
                type="password" 
                placeholder="Minimum 8 characters" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                className="w-full text-base bg-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#4b5563] uppercase tracking-wider">Confirm New Password</label>
              <input 
                type="password" 
                placeholder="Re-enter new password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="w-full text-base bg-white"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#136040] hover:bg-[#0f4f34] text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Resetting Password...</span>
                </>
              ) : (
                'Reset Password'
              )}
            </button>

            <div className="flex justify-between items-center mt-2 pt-4 border-t border-[#f3f4f6]">
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="bg-transparent border-none text-[#6b7280] font-medium text-xs hover:text-[#111827] cursor-pointer shadow-none hover:translate-y-0 transition-colors"
              >
                Back to Email
              </button>

              <button 
                type="button" 
                onClick={handleRequestOtp}
                disabled={loading}
                className="bg-transparent border-none text-[#136040] font-bold text-xs hover:text-[#0f4f34] cursor-pointer shadow-none hover:translate-y-0 transition-colors"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
