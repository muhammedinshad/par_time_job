import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';

// Pages
import VerificationPage from './pages/auth/VerificationPage';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import EmployerRegister from './pages/auth/EmployerRegister';
import JobSeekerRegister from './pages/auth/JobSeekerRegister';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import MyJobs from './pages/employer/MyJobs';
import EmployerJobDetail from './pages/employer/EmployerJobDetail';
import PostJob from './pages/employer/PostJob';
import Applicants from './pages/employer/Applicants';
import ApplicationDetail from './pages/employer/ApplicationDetail';
import SelectedJobSeekers from './pages/employer/SelectedJobSeekers';
import EmployerProfile from './pages/employer/EmployerProfile';
import JobSeekerDashboard from './pages/jobseeker/JobSeekerDashboard';
import BrowseJobs from './pages/jobseeker/BrowseJobs';
import JobDetail from './pages/jobseeker/JobDetail';
import SeekerMyApplications from './pages/jobseeker/MyApplications';
import SeekerApplicationDetail from './pages/jobseeker/ApplicationDetail';
import SeekerProfile from './pages/jobseeker/Profile';
import ProfileEdit from './pages/jobseeker/ProfileEdit';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProfilePage from './pages/auth/ProfilePage';
import GoogleCallback from './pages/auth/GoogleCallback';
import RoleSelection from './pages/auth/RoleSelection';
import CompleteProfile from './pages/auth/CompleteProfile';

const isDashboardRoute = (pathname) =>
  pathname.startsWith('/employer') || pathname.startsWith('/jobseeker');

function AppContent() {
  const location = useLocation();
  const hideNavbar = isDashboardRoute(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {hideNavbar ? (
        <Routes>
          {/* Employer Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<RoleRoute allowedRoles={['employer']} />}>
              <Route path="/employer/dashboard" element={<EmployerDashboard />} />
              <Route path="/employer/my-jobs" element={<MyJobs />} />
              <Route path="/employer/my-jobs/:id" element={<EmployerJobDetail />} />
              <Route path="/employer/post-job" element={<PostJob />} />
              <Route path="/employer/applications" element={<Applicants />} />
              <Route path="/employer/applications/:id" element={<ApplicationDetail />} />
              <Route path="/employer/selected-job-seekers" element={<SelectedJobSeekers />} />
              <Route path="/employer/profile" element={<EmployerProfile />} />
            </Route>
          </Route>

          {/* Job Seeker Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<RoleRoute allowedRoles={['job_seeker']} />}>
              <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard />}>
                <Route index element={<BrowseJobs />} />
                <Route path="browse-jobs" element={<BrowseJobs />} />
                <Route path="jobs/:id" element={<JobDetail />} />
                <Route path="my-applications" element={<SeekerMyApplications />} />
                <Route path="my-applications/:id" element={<SeekerApplicationDetail />} />
                <Route path="profile" element={<SeekerProfile />} />
                <Route path="profile/edit" element={<ProfileEdit />} />
              </Route>
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      ) : (
        <div className="p-8 max-w-[1200px] mx-auto">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify" element={<VerificationPage />} />
            <Route path="/register/employer" element={<EmployerRegister />} />
            <Route path="/register/jobseeker" element={<JobSeekerRegister />} />
            <Route path="/google/callback" element={<GoogleCallback />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
            </Route>

            <Route path="/" element={<h1 className="text-3xl font-bold text-center text-[#111827] mt-8">Welcome to Part-Time Jobs</h1>} />
          </Routes>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
