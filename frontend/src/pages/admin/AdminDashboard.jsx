import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { logoutApi } from '../../api/authApi';
import { fetchActiveJobs } from '../../api/jobApi';
import {
  fetchAdminUsers,
} from '../../api/adminApi';
import {
  Squares2X2Icon,
  UsersIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ArrowPathIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import ManageUsers from './ManageUsers';
import ManageJobs from './ManageJobs';

const CATEGORY_LABELS = {
  restaurant:  'Restaurant & Food',
  events:      'Events & Entertainment',
  health_care: 'Health & Care',
  education:   'Education & Tutoring',
  delivery:    'Delivery',
  other:       'Other',
};

const JOB_TYPE_LABELS = {
  full_time:  'Full Time',
  part_time:  'Part Time',
  contract:   'Contract',
  internship: 'Internship',
};

const normalizeJob = (job) => ({
  id:            job.id,
  title:         job.title,
  employerName:  job.employer_name  || 'Unknown Company',
  category:      job.category       || 'other',
  categoryLabel: CATEGORY_LABELS[job.category] || 'Other',
  salaryRange:   job.salary_range   || 'Not specified',
  jobType:       job.job_type       || '',
  jobTypeLabel:  JOB_TYPE_LABELS[job.job_type] || job.job_type || '',
  location:      job.location       || 'Not specified',
  timing:        job.timing         || '',
  slots:         job.slots          || null,
  isActive:      job.is_active,
  createdAt:     job.created_at     || '',
  description:   job.description    || '',
  employerId:    job.employer       || null,
});

const normalizeUser = (u) => ({
  id:            u.id,
  name:          u.name || u.email,
  email:         u.email,
  role:          u.role,
  status:        u.status,
  joinedDate:    u.created_at ? u.created_at.slice(0, 10) : '',
  phone:         u.phone || '',
  location:      u.location || '',
  businessName:  u.business_name || '',
  businessType:  u.business_type || '',
  description:   u.description || '',
  dob:           u.dob || '',
  gender:        u.gender || '',
  avatar:        (u.name || u.email)[0].toUpperCase(),
});

const AdminDashboard = () => {
  const { role, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');

  const [users, setUsers]           = useState([]);
  const [jobs, setJobs]             = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError]   = useState(null);

  const [notification, setNotification] = useState(null);

  const stats = useMemo(() => ({
    totalJobsCount:      jobs.length,
    totalEmployerUsers:  users.filter(u => u.role === 'employer').length,
    totalJobSeekerUsers: users.filter(u => u.role === 'job_seeker').length,
  }), [users, jobs]);

  const loadJobsFromAPI = useCallback(async () => {
    setJobsLoading(true);
    setJobsError(null);
    try {
      const data = await fetchActiveJobs();
      const rawJobs = Array.isArray(data) ? data : (data.results || []);
      const normalized = rawJobs.map(normalizeJob);
      setJobs(normalized);
      return normalized;
    } catch (err) {
      console.error('Failed to fetch jobs from API:', err);
      setJobsError('Unable to load jobs from the server. Please check your connection.');
      return [];
    } finally {
      setJobsLoading(false);
    }
  }, []);

  const loadUsersFromApi = useCallback(async () => {
    try {
      const data = await fetchAdminUsers();
      const fetched = (data.users || []).map(normalizeUser);
      setUsers(fetched);
      return fetched;
    } catch (err) {
      console.error('Failed to fetch users from API:', err);
      return [];
    }
  }, []);

  const loadData = useCallback(async () => {
    await Promise.all([
      loadJobsFromAPI(),
      loadUsersFromApi(),
    ]);
  }, [loadJobsFromAPI, loadUsersFromApi]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(logout());
      navigate('/login');
    }
  };

  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] text-[#111827] font-sans antialiased pb-12">
      {notification && (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border transition-all duration-300 transform translate-y-0 ${
          notification.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-800'
            : notification.type === 'info'
            ? 'bg-blue-50 border-blue-200 text-blue-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div className={`w-2.5 h-2.5 rounded-full ${
            notification.type === 'error' ? 'bg-red-500' : notification.type === 'info' ? 'bg-blue-500' : 'bg-emerald-500'
          }`} />
          <span className="text-[14px] font-semibold">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-4 text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-8 py-3.5 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3.5 cursor-pointer">
          <div className="w-9 h-9 bg-gradient-to-br from-[#6c5ce7] to-[#4f46e5] rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-100 hover:scale-105 transition-transform duration-300">
            <Squares2X2Icon className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-[#111827] tracking-tight leading-none">PrimeJob</h1>
            <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Control Panel</span>
          </div>
        </div>

        <nav className="bg-gray-100/80 p-1.5 rounded-full flex gap-1 shadow-inner border border-gray-50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 rounded-full text-[14px] font-bold transition-all duration-300 ${
              activeTab === 'overview'
                ? 'bg-[#111827] text-white shadow-md scale-105'
                : 'text-gray-500 hover:text-gray-900 bg-transparent hover:bg-gray-200/50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-full text-[14px] font-bold transition-all duration-300 ${
              activeTab === 'users'
                ? 'bg-[#111827] text-white shadow-md scale-105'
                : 'text-gray-500 hover:text-gray-900 bg-transparent hover:bg-gray-200/50'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-2 rounded-full text-[14px] font-bold transition-all duration-300 ${
              activeTab === 'jobs'
                ? 'bg-[#111827] text-white shadow-md scale-105'
                : 'text-gray-500 hover:text-gray-900 bg-transparent hover:bg-gray-200/50'
            }`}
          >
            Jobs
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
            <BellIcon className="w-5 h-5" />
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleLogout}
            title="Logout System"
            className="w-9 h-9 rounded-full flex items-center justify-center text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 hover:scale-105 active:scale-95 duration-200 transition-all"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 stroke-[2]" />
          </button>
          <div className="h-6 w-px bg-gray-200 mx-1" />
          <div className="flex items-center gap-3 bg-gray-50 p-1.5 pr-4 rounded-full border border-gray-100">
            <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-[12px] font-black text-white">
              AD
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[12px] font-bold leading-none">System Admin</span>
              <span className="text-[9px] text-gray-400 font-semibold mt-0.5">admin@primejob.com</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 mt-10">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-[32px] font-extrabold text-[#111827] tracking-tight leading-tight">
              {activeTab === 'overview' && 'System Overview'}
              {activeTab === 'users' && 'User Management Operations'}
              {activeTab === 'jobs' && 'Job Listings & Categories'}
            </h2>
            <p className="text-[15px] text-[#9ca3af] font-medium mt-1">
              {activeTab === 'overview' && 'Real-time overview of users, active jobs, and matching ecosystem health.'}
              {activeTab === 'users' && 'Search, filter, inspect full profiles, block users, or manage active database entities.'}
              {activeTab === 'jobs' && 'Monitor all submitted job posts, filter by categories, and purge violating vacancies.'}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadData}
              className="flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-full text-[14px] font-bold border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm hover:scale-105 active:scale-95 duration-200"
            >
              <ArrowPathIcon className="w-4 h-4 stroke-2" /> Sync Data
            </button>
            <button className="bg-[#111827] text-white px-6 py-2.5 rounded-full text-[14px] font-bold hover:bg-gray-800 transition-colors shadow-md hover:scale-105 active:scale-95 duration-200">
              Export Sheet
            </button>
          </div>
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white rounded-[24px] p-6.5 flex flex-col shadow-lg shadow-indigo-100 min-h-[190px] group transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[15px] font-bold tracking-wide uppercase text-indigo-100">Total Active Jobs</h3>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 text-white backdrop-blur-md group-hover:scale-110 transition-transform">
                    <BriefcaseIcon className="w-5 h-5 stroke-[2]" />
                  </div>
                </div>
                <div className="text-[52px] font-black tracking-tight leading-none mt-2 select-none">{stats.totalJobsCount}</div>
                <div className="mt-4 flex items-center gap-2 text-[13px] font-medium text-emerald-300 bg-white/10 px-3 py-1.5 rounded-full w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Healthy Matching Active
                </div>
              </div>

              <div className="bg-white text-[#111827] rounded-[24px] p-6.5 flex flex-col shadow-sm border border-gray-100 min-h-[190px] transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[15px] font-bold tracking-wide uppercase text-gray-400">Total Employer Accounts</h3>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 text-gray-500">
                    <BuildingOffice2Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                </div>
                <div className="text-[52px] font-black tracking-tight leading-none mt-2 select-none text-[#111827]">{stats.totalEmployerUsers}</div>
                <div className="mt-4 flex items-center gap-2 text-[13px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">
                  <span>+12.4%</span>
                  <span className="text-[12px] text-gray-400 font-medium">Growth rate</span>
                </div>
              </div>

              <div className="bg-white text-[#111827] rounded-[24px] p-6.5 flex flex-col shadow-sm border border-gray-100 min-h-[190px] transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[15px] font-bold tracking-wide uppercase text-gray-400">Total Job Seeker Accounts</h3>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 text-gray-500">
                    <UsersIcon className="w-5 h-5 stroke-[2]" />
                  </div>
                </div>
                <div className="text-[52px] font-black tracking-tight leading-none mt-2 select-none text-[#111827]">{stats.totalJobSeekerUsers}</div>
                <div className="mt-4 flex items-center gap-2 text-[13px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">
                  <span>+8.2%</span>
                  <span className="text-[12px] text-gray-400 font-medium">Growth rate</span>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-[18px] font-bold text-[#111827]">Recent User Signups</h3>
                    <p className="text-[13px] text-gray-400 mt-0.5">The latest users registered to your platform</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="text-[13px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    View All Users
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">User Details</th>
                        <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Role</th>
                        <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.slice(0, 5).map((user) => (
                        <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="py-4.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 uppercase text-[14px]">
                                {user.avatar}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[14px] font-bold text-[#111827] group-hover:text-indigo-600 transition-colors">
                                  {user.name}
                                </span>
                                <span className="text-[12px] text-gray-400 font-medium">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4.5 text-[14px]">
                            <span className={`px-2.5 py-1 rounded-full text-[12px] font-bold ${
                              user.role === 'employer'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-blue-50 text-blue-700 border border-blue-100'
                            }`}>
                              {user.role === 'employer' ? 'Employer' : 'Job Seeker'}
                            </span>
                          </td>
                          <td className="py-4.5 text-[14px]">
                            <span className={`flex items-center gap-1.5 text-[13px] font-bold ${
                              user.status === 'Active' ? 'text-emerald-600' : 'text-red-500'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              {user.status}
                            </span>
                          </td>
                          <td className="py-4.5 text-[13px] text-gray-400 font-semibold">
                            {user.joinedDate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  <div className="w-full flex justify-between items-center mb-6 text-left">
                    <h3 className="text-[17px] font-bold text-[#111827]">Platform Security</h3>
                    <span className="text-[11px] font-bold uppercase bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100">
                      Live Status
                    </span>
                  </div>

                  <div className="relative w-44 h-24 mb-4 mt-2 overflow-hidden flex justify-center items-end">
                    <svg className="w-44 h-44 absolute top-0" viewBox="0 0 100 100">
                      <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="url(#gradientGauge)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="126"
                        strokeDashoffset="15"
                      />
                      <defs>
                        <linearGradient id="gradientGauge" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#4f46e5" />
                          <stop offset="100%" stopColor="#81ecec" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="relative z-10 flex flex-col items-center">
                      <span className="text-[28px] font-black leading-none text-[#111827]">92.8%</span>
                      <span className="text-[11px] font-bold text-gray-400 uppercase mt-0.5 tracking-wider">Health Index</span>
                    </div>
                  </div>

                  <p className="text-[13px] text-gray-400 max-w-[220px] mb-4">
                    Matching platform is running cleanly. 0 flagged vulnerabilities.
                  </p>

                  <div className="w-full grid grid-cols-2 gap-3.5 border-t border-gray-100 pt-4.5">
                    <div className="flex flex-col text-left">
                      <span className="text-[12px] font-bold text-gray-400">Total Users</span>
                      <span className="text-[16px] font-black text-[#111827] mt-0.5">
                        {stats.totalEmployerUsers + stats.totalJobSeekerUsers}
                      </span>
                    </div>
                    <div className="flex flex-col text-left border-l border-gray-100 pl-4">
                      <span className="text-[12px] font-bold text-gray-400">Active Jobs</span>
                      <span className="text-[16px] font-black text-[#111827] mt-0.5">{stats.totalJobsCount}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex-1">
                  <h3 className="text-[17px] font-bold text-[#111827] mb-5">Matching Categories</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="flex justify-between items-center text-[13px] font-bold mb-1">
                        <span className="text-gray-600">Restaurant & Food</span>
                        <span className="text-[#111827]">35%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: '35%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[13px] font-bold mb-1">
                        <span className="text-gray-600">Events & Entertainment</span>
                        <span className="text-[#111827]">28%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '28%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[13px] font-bold mb-1">
                        <span className="text-gray-600">Delivery Services</span>
                        <span className="text-[#111827]">15%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '15%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <ManageUsers
            users={users}
            onUsersUpdate={setUsers}
            triggerNotification={triggerNotification}
          />
        )}

        {/* Tab 3: JOB MANAGEMENT */}
        {activeTab === 'jobs' && (
          <ManageJobs
            jobs={jobs}
            onJobsUpdate={setJobs}
            triggerNotification={triggerNotification}
            jobsLoading={jobsLoading}
            jobsError={jobsError}
            loadJobsFromAPI={loadJobsFromAPI}
          />
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
