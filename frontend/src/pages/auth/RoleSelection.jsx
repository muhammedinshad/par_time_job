import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Redirect to complete profile with the selected role
    navigate(`/complete-profile?role=${role}`);
  };

  return (
    <div className="role-selection-container">
      <div className="role-selection-card">
        <h1>Welcome! Please select your role</h1>
        <p>To provide you with the best experience, we need to know who you are.</p>
        
        <div className="role-options">
          <div 
            className={`role-option ${selectedRole === 'employer' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('employer')}
          >
            <div className="role-icon">🏢</div>
            <h2>Employer</h2>
            <p>I want to post jobs and hire talented people.</p>
          </div>

          <div 
            className={`role-option ${selectedRole === 'job_seeker' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('job_seeker')}
          >
            <div className="role-icon">👤</div>
            <h2>Job Seeker</h2>
            <p>I am looking for part-time job opportunities.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
