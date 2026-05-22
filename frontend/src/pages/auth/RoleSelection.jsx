import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    navigate(`/complete-profile?role=${role}`);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-5 bg-[#f5f7f6]">
      <div className="bg-white rounded-[20px] p-10 max-w-[800px] w-full text-center shadow-sm border border-[#e5e7eb]">
        <h1 className="text-4xl mb-2.5 bg-gradient-to-r from-[#136040] to-[#1d8258] bg-clip-text text-transparent">Welcome! Please select your role</h1>
        <p className="text-[#6b7280] mb-10">To provide you with the best experience, we need to know who you are.</p>
        
        <div className="grid grid-cols-2 gap-8 max-sm:grid-cols-1">
          <div 
            className={`bg-[#f5f7f6] border-2 border-[#e5e7eb] rounded-[15px] p-8 cursor-pointer transition-all duration-300 flex flex-col items-center hover:bg-gray-100 hover:border-[#136040] hover:-translate-y-1.5 ${selectedRole === 'employer' ? 'border-[#136040] bg-[#136040]/5' : ''}`}
            onClick={() => handleRoleSelect('employer')}
          >
            <div className="text-5xl mb-5">🏢</div>
            <h2 className="text-2xl mb-2.5 text-[#111827]">Employer</h2>
            <p className="text-sm mb-0 text-[#6b7280]">I want to post jobs and hire talented people.</p>
          </div>

          <div 
            className={`bg-[#f5f7f6] border-2 border-[#e5e7eb] rounded-[15px] p-8 cursor-pointer transition-all duration-300 flex flex-col items-center hover:bg-gray-100 hover:border-[#136040] hover:-translate-y-1.5 ${selectedRole === 'job_seeker' ? 'border-[#136040] bg-[#136040]/5' : ''}`}
            onClick={() => handleRoleSelect('job_seeker')}
          >
            <div className="text-5xl mb-5">👤</div>
            <h2 className="text-2xl mb-2.5 text-[#111827]">Job Seeker</h2>
            <p className="text-sm mb-0 text-[#6b7280]">I am looking for part-time job opportunities.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
