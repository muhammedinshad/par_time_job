import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { logoutApi } from '../../api/authApi';
import { fetchActiveJobs } from '../../api/jobApi';
import {
  Squares2X2Icon,
  UsersIcon,
  BriefcaseIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  LockClosedIcon,
  LockOpenIcon,
  TrashIcon,
  ArrowPathIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  BuildingOffice2Icon,
  UserCircleIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import {
  getAllUsers,
  blockUnblockUser,
  deleteUser,
  getAdminStats
} from './adminMockStore';

// ── Normalize a raw job from the backend API into the shape the UI expects ──
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

const AdminDashboard = () => {
  const { role, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Protect Admin Dashboard from non-admin roles
  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // Tabs: 'overview', 'users', 'jobs'
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data State
  const [users, setUsers]           = useState([]);
  const [jobs, setJobs]             = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError]   = useState(null);
  const [stats, setStats] = useState({
    totalJobsCount: 0,
    totalEmployerUsers: 0,
    totalJobSeekerUsers: 0
  });

  // Filters and Search
  const [userSearch, setUserSearch]           = useState('');
  const [userRoleFilter, setUserRoleFilter]   = useState('all');
  const [jobCategoryFilter, setJobCategoryFilter] = useState('all');
  const [jobSearch, setJobSearch]             = useState('');

  // Modals and Alerts
  const [selectedUser, setSelectedUser]         = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [notification, setNotification]         = useState(null);

  // ── Load jobs from the real backend API ──────────────────────────────────
  const loadJobsFromAPI = useCallback(async () => {
    setJobsLoading(true);
    setJobsError(null);
    try {
      const data = await fetchActiveJobs();
      // The API may return an array directly or a paginated { results: [] }
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

  // ── Load users from mock store (no backend list-users endpoint exists) ──
  const loadUsersFromMock = useCallback(() => {
    const fetchedUsers = getAllUsers();
    setUsers(fetchedUsers);
    return fetchedUsers;
  }, []);

  // ── Combined load + sync stats ─────────────────────────────────────────
  const loadData = useCallback(async () => {
    const [normalizedJobs, fetchedUsers] = await Promise.all([
      loadJobsFromAPI(),
      Promise.resolve(loadUsersFromMock()),
    ]);

    // Compute stats from real job count + mock user counts
    const mockUserStats = getAdminStats(); // uses localStorage user counts
    setStats({
      totalJobsCount:      normalizedJobs.length,
      totalEmployerUsers:  mockUserStats.totalEmployerUsers,
      totalJobSeekerUsers: mockUserStats.totalJobSeekerUsers,
    });
  }, [loadJobsFromAPI, loadUsersFromMock]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleBlockToggle = (userId, userName) => {
    const updatedUsers = blockUnblockUser(userId);
    setUsers(updatedUsers);
    
    // Only recalculate user-related stats — preserve the real job count from the API
    const mockUserStats = getAdminStats();
    setStats(prev => ({
      ...prev, // Keep totalJobsCount from the real API
      totalEmployerUsers:  mockUserStats.totalEmployerUsers,
      totalJobSeekerUsers: mockUserStats.totalJobSeekerUsers,
    }));
    
    const user = updatedUsers.find(u => u.id === userId);
    triggerNotification(`Successfully ${user.status === 'Blocked' ? 'blocked' : 'unblocked'} ${userName}.`, 'info');
  };

  const handleDeleteClick = (type, id) => {
    setShowDeleteConfirm({ type, id });
  };

  const handleConfirmDelete = async () => {
    if (!showDeleteConfirm) return;
    
    const { type, id } = showDeleteConfirm;
    if (type === 'user') {
      const updated = deleteUser(id);
      setUsers(updated);
      triggerNotification('User account deleted successfully.', 'error');
      // Reload stats after user delete
      const mockUserStats = getAdminStats();
      setStats(prev => ({
        ...prev,
        totalEmployerUsers:  mockUserStats.totalEmployerUsers,
        totalJobSeekerUsers: mockUserStats.totalJobSeekerUsers,
      }));
    } else if (type === 'job') {
      // Jobs come from real API — just remove from local state optimistically
      setJobs(prev => {
        const updated = prev.filter(j => j.id !== id);
        setStats(s => ({ ...s, totalJobsCount: updated.length }));
        return updated;
      });
      triggerNotification('Job removed from view. Note: deletion requires a backend admin endpoint.', 'info');
    }
    
    setShowDeleteConfirm(null);
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

  // Grouped Jobs count per category
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'restaurant', label: 'Restaurant & Food' },
    { value: 'events', label: 'Events & Entertainment' },
    { value: 'health_care', label: 'Health & Care' },
    { value: 'education', label: 'Education & Tutoring' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'other', label: 'Other' }
  ];

  // Filtering Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                          user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          (user.location && user.location.toLowerCase().includes(userSearch.toLowerCase())) ||
                          (user.businessName && user.businessName.toLowerCase().includes(userSearch.toLowerCase()));
    const matchesRole = userRoleFilter === 'all' ? true : user.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredJobs = jobs.filter(job => {
    const search = jobSearch.toLowerCase();
    const matchesSearch = job.title.toLowerCase().includes(search) ||
                          (job.employerName || '').toLowerCase().includes(search) ||
                          (job.location || '').toLowerCase().includes(search);
    const matchesCategory = jobCategoryFilter === 'all' ? true : job.category === jobCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f5f7f6] text-[#111827] font-sans antialiased pb-12">
      {/* Dynamic Toast Notification */}
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

      {/* Voltax-Inspired Pill Top Navbar */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-8 py-3.5 flex justify-between items-center transition-all">
        {/* Brand Logo */}
        <div className="flex items-center gap-3.5 cursor-pointer">
          <div className="w-9 h-9 bg-gradient-to-br from-[#6c5ce7] to-[#4f46e5] rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-100 hover:scale-105 transition-transform duration-300">
            <Squares2X2Icon className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-[#111827] tracking-tight leading-none">PrimeJob</h1>
            <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Control Panel</span>
          </div>
        </div>

        {/* Center Pill Navigation */}
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

        {/* Right Section */}
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

      {/* Main Container */}
      <main className="max-w-[1400px] mx-auto px-8 mt-10">
        
        {/* Page Header Section */}
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
            {/* Dynamic Statistics Cards Grid (Direct Voltax Mock style) */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Card 1 - Vibrant Purple/Indigo Gradient for Total Jobs */}
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

              {/* Card 2 - Total Employer Users in Sleek Curved White Card */}
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

              {/* Card 3 - Total Job Seeker Users in Sleek Curved White Card */}
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
              {/* Left side: Recent users signup list */}
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

            {/* Right side: Voltax-like Half Doughnut & Platform health */}
            <div className="flex flex-col gap-6">
              {/* Health Gauge Card */}
              <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <div className="w-full flex justify-between items-center mb-6 text-left">
                  <h3 className="text-[17px] font-bold text-[#111827]">Platform Security</h3>
                  <span className="text-[11px] font-bold uppercase bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100">
                    Live Status
                  </span>
                </div>

                {/* Semicircle Gauge Drawing (Voltax-like half doughnut) */}
                <div className="relative w-44 h-24 mb-4 mt-2 overflow-hidden flex justify-center items-end">
                  {/* Gauge Arc */}
                  <svg className="w-44 h-44 absolute top-0" viewBox="0 0 100 100">
                    {/* Background Arc */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    {/* Active Filled Arc (simulating 88%) */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="url(#gradientGauge)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray="126"
                      strokeDashoffset="15"
                    />
                    {/* Gradient Definitions */}
                    <defs>
                      <linearGradient id="gradientGauge" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#81ecec" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Value display */}
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

              {/* Platform Category Distribution Mock Panel */}
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
          <div className="bg-white rounded-[24px] p-6.5 border border-gray-100 shadow-sm">
            
            {/* Table Control Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
              {/* Search Bar */}
              <div className="w-full md:w-96 relative">
                <input
                  type="text"
                  placeholder="Search by name, email or location..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-[14px] transition-all"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>

              {/* Filters Dropdown */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-[13px] font-bold text-gray-400 shrink-0">Filter Role:</span>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-4 py-2 rounded-full border border-gray-200 outline-none text-[13px] font-bold bg-white text-gray-700 focus:border-indigo-600 cursor-pointer w-full md:w-44"
                >
                  <option value="all">All Roles</option>
                  <option value="employer">Employers</option>
                  <option value="job_seeker">Job Seekers</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-150">
                    <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider pl-2">User Details</th>
                    <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center font-extrabold text-indigo-700 uppercase text-[15px]">
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
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[12px] font-bold ${
                            user.role === 'employer'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            {user.role === 'employer' ? 'Employer' : 'Job Seeker'}
                          </span>
                        </td>
                        <td className="py-4 text-[13px] text-gray-500 font-semibold">
                          {user.location || user.businessType || 'Not Provided'}
                        </td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            user.status === 'Active'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-red-50 border-red-200 text-red-700'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              title="View Detailed Profile"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 border border-gray-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all hover:scale-105 active:scale-95 shadow-sm text-[12px] font-bold"
                            >
                              <EyeIcon className="w-3.5 h-3.5 stroke-[2]" />
                              View
                            </button>
                            <button
                              onClick={() => handleBlockToggle(user.id, user.name)}
                              title={user.status === 'Active' ? 'Block User' : 'Unblock User'}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 shadow-sm text-[12px] font-bold ${
                                user.status === 'Active'
                                  ? 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                              }`}
                            >
                              {user.status === 'Active' ? (
                                <><LockClosedIcon className="w-3.5 h-3.5 stroke-[2]" /> Block</>
                              ) : (
                                <><LockOpenIcon className="w-3.5 h-3.5 stroke-[2]" /> Unblock</>
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteClick('user', user.id)}
                              title="Delete User"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 border border-gray-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all hover:scale-105 active:scale-95 shadow-sm text-[12px] font-bold"
                            >
                              <TrashIcon className="w-3.5 h-3.5 stroke-[2]" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-[14px] text-gray-400 font-medium">
                        No user match found. Try a different search keyword.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: JOB MANAGEMENT */}
        {activeTab === 'jobs' && (
          <div className="flex flex-col gap-6">
            
            {/* Category Filter Pills (Grouping) */}
            <div className="bg-white p-4.5 rounded-[24px] border border-gray-100 shadow-sm flex flex-wrap gap-2.5 items-center justify-start">
              <span className="text-[13px] font-bold text-gray-400 mr-2.5 pl-2">Filter Category:</span>
              {categories.map((cat) => {
                const count = cat.value === 'all' 
                  ? jobs.length 
                  : jobs.filter(j => j.category === cat.value).length;

                return (
                  <button
                    key={cat.value}
                    onClick={() => setJobCategoryFilter(cat.value)}
                    className={`px-4.5 py-1.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-2 ${
                      jobCategoryFilter === cat.value
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-100'
                    }`}
                  >
                    {cat.label}
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      jobCategoryFilter === cat.value ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Main Job List Body */}
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
              {/* Header with real-data badge */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-[18px] font-bold text-[#111827] pl-1">
                    Active Vacancies ({filteredJobs.length})
                  </h3>
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Live from Backend API
                  </span>
                </div>
                
                {/* Job Specific Search */}
                <div className="w-80 relative">
                  <input
                    type="text"
                    placeholder="Search jobs, companies or locations..."
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none text-[13px] transition-all"
                  />
                  <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Loading State */}
              {jobsLoading && (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="text-[14px] text-gray-400 font-semibold">Fetching jobs from backend...</p>
                </div>
              )}

              {/* Error State */}
              {!jobsLoading && jobsError && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                    <ExclamationCircleIcon className="w-7 h-7 text-red-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-[15px] font-bold text-gray-800 mb-1">Failed to Load Jobs</p>
                    <p className="text-[13px] text-gray-400">{jobsError}</p>
                  </div>
                  <button
                    onClick={loadJobsFromAPI}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-full text-[13px] font-bold hover:bg-indigo-700 transition-colors"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    Retry
                  </button>
                </div>
              )}

              {/* Jobs Table */}
              {!jobsLoading && !jobsError && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-150">
                      <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider pl-2">Job Specs</th>
                      <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Company</th>
                      <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Category</th>
                      <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Type / Salary</th>
                      <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Slots</th>
                      <th className="pb-3.5 text-[12px] font-bold text-gray-400 uppercase tracking-wider text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredJobs.length > 0 ? (
                      filteredJobs.map((job) => (
                        <tr key={job.id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 pl-2 max-w-[260px]">
                            <div className="flex flex-col">
                              <span className="text-[14px] font-bold text-[#111827] group-hover:text-indigo-600 transition-colors leading-tight">
                                {job.title}
                              </span>
                              <span className="text-[12px] text-gray-400 font-semibold mt-1 flex items-center gap-1">
                                <MapPinIcon className="w-3.5 h-3.5" />
                                {job.location}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 text-[14px] font-bold text-[#111827]">
                            {job.employerName}
                          </td>
                          <td className="py-4">
                            <span className="text-[13px] text-gray-500 font-bold bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                              {job.categoryLabel}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-col">
                              <span className="text-[13px] text-[#111827] font-bold">
                                {job.salaryRange}
                              </span>
                              <span className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">
                                {job.jobTypeLabel}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 text-[13px] text-gray-600 font-extrabold pl-2">
                            {job.slots || 'Unlimited'}
                          </td>
                          <td className="py-4 text-right pr-4">
                            <button
                              onClick={() => handleDeleteClick('job', job.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 border border-gray-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all hover:scale-105 active:scale-95 ml-auto shadow-sm text-[12px] font-bold"
                            >
                              <TrashIcon className="w-3.5 h-3.5 stroke-[2]" />
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-12 text-[14px] text-gray-400 font-medium">
                          No matching active job postings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* VIEW DETAILS USER MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-[#111827]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-[28px] max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header Decoration */}
            <div className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] px-8 py-7 text-white flex justify-between items-center relative">
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 bg-white/15 rounded-2xl flex items-center justify-center font-black uppercase text-[20px] text-white backdrop-blur-md">
                  {selectedUser.avatar}
                </div>
                <div className="text-left">
                  <span className="text-[11px] font-black uppercase bg-white/25 px-2 py-0.5 rounded tracking-wide">
                    {selectedUser.role === 'employer' ? 'Employer Profile' : 'Job Seeker Profile'}
                  </span>
                  <h3 className="text-[20px] font-black mt-1 leading-none tracking-tight">{selectedUser.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all border border-white/10"
              >
                <XMarkIcon className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 text-left max-h-[75vh] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              <div className="flex flex-col gap-6">
                
                {/* Email, Phone & Location Block */}
                <div className="grid grid-cols-1 gap-4.5">
                  <div className="flex items-center gap-3.5 bg-gray-50 border border-gray-100/50 p-4.5 rounded-2xl">
                    <EnvelopeIcon className="w-5.5 h-5.5 text-indigo-600 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-400 font-bold uppercase">Email Address</span>
                      <span className="text-[14px] font-semibold text-[#111827]">{selectedUser.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 bg-gray-50 border border-gray-100/50 p-4.5 rounded-2xl">
                    <PhoneIcon className="w-5.5 h-5.5 text-indigo-600 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-400 font-bold uppercase">Phone Number</span>
                      <span className="text-[14px] font-semibold text-[#111827]">{selectedUser.phone || 'Not Specified'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 bg-gray-50 border border-gray-100/50 p-4.5 rounded-2xl">
                    <MapPinIcon className="w-5.5 h-5.5 text-indigo-600 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-400 font-bold uppercase">Base Location</span>
                      <span className="text-[14px] font-semibold text-[#111827]">{selectedUser.location || 'Not Specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Role Specific Section */}
                {selectedUser.role === 'employer' ? (
                  <div className="border-t border-gray-100 pt-5 flex flex-col gap-4.5">
                    <h4 className="text-[14px] font-extrabold text-[#111827] tracking-tight uppercase border-b border-gray-50 pb-2">
                      Company Particulars
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-gray-400 font-bold uppercase">Business Entity</span>
                        <span className="text-[13.5px] font-bold text-gray-800 mt-1">{selectedUser.businessName}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] text-gray-400 font-bold uppercase">Sector / Type</span>
                        <span className="text-[13.5px] font-bold text-gray-800 mt-1">{selectedUser.businessType}</span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-400 font-bold uppercase">Corporate Bio</span>
                      <p className="text-[13px] text-gray-500 font-medium mt-1 leading-relaxed bg-gray-50/50 border border-gray-100 p-3 rounded-xl">
                        {selectedUser.description || 'No business details provided.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-gray-100 pt-5 flex flex-col gap-4.5">
                    <h4 className="text-[14px] font-extrabold text-[#111827] tracking-tight uppercase border-b border-gray-50 pb-2">
                      Personal Attributes
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-gray-400 font-bold uppercase">Date of Birth</span>
                        <span className="text-[13.5px] font-bold text-gray-800 mt-1">{selectedUser.dob || 'Not Provided'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] text-gray-400 font-bold uppercase">Gender Identity</span>
                        <span className="text-[13.5px] font-bold text-gray-800 mt-1">{selectedUser.gender || 'Not Provided'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status & Registration Date Footer */}
                <div className="border-t border-gray-100 pt-5 flex items-center justify-between text-[12px] font-bold text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span>Registered on {selectedUser.joinedDate}</span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase border ${
                    selectedUser.status === 'Active' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    {selectedUser.status} status
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-[#111827]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-6.5 shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto mb-4">
              <TrashIcon className="w-6 h-6 stroke-2" />
            </div>
            
            <h3 className="text-[17px] font-bold text-[#111827] mb-2">
              Are you absolutely sure?
            </h3>
            
            <p className="text-[13.5px] text-gray-500 leading-relaxed mb-6">
              {showDeleteConfirm.type === 'user' 
                ? 'Deleting this account will erase all profile details and purge any vacancies cascade-linked to this user. This action is permanent.' 
                : 'Deleting this job vacancy will remove the active listing from browse-board permanently.'}
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-[13px] transition-colors"
              >
                No, Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-[13px] transition-colors shadow-md shadow-red-150"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
