import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';

// Pages
import VerificationPage from './pages/auth/VerificationPage';
import LoginPage from './pages/auth/LoginPage';
import EmployerRegister from './pages/auth/EmployerRegister';
import JobSeekerRegister from './pages/auth/JobSeekerRegister';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import JobSeekerDashboard from './pages/jobseeker/JobSeekerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProfilePage from './pages/auth/ProfilePage';
import GoogleCallback from './pages/auth/GoogleCallback';
import RoleSelection from './pages/auth/RoleSelection';
import CompleteProfile from './pages/auth/CompleteProfile';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/register/employer" element={<EmployerRegister />} />
          <Route path="/register/jobseeker" element={<JobSeekerRegister />} />
          {/* <Route path="/google-callback" element={<GoogleCallback />} /> */}
          <Route path="/google/callback" element={<GoogleCallback />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            
            {/* Employer Routes */}
            <Route element={<RoleRoute allowedRoles={['employer']} />}>
              <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            </Route>

            {/* Job Seeker Routes */}
            <Route element={<RoleRoute allowedRoles={['job_seeker']} />}>
              <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>

          <Route path="/" element={<h1>Welcome to Part-Time Jobs</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
