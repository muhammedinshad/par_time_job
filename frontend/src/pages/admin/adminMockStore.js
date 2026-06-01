// Client-side high-fidelity mock database for admin dashboard
const INITIAL_USERS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    email: 'sarah.j@gmail.com',
    role: 'job_seeker',
    status: 'Active',
    joinedDate: '2026-04-12',
    phone: '+1 (555) 234-5678',
    location: 'Downtown Seattle',
    dob: '2001-08-14',
    gender: 'Female',
    avatar: 'S'
  },
  {
    id: 2,
    name: 'Alice Johnson',
    email: 'alice@gourmetcafe.com',
    role: 'employer',
    status: 'Active',
    joinedDate: '2026-02-28',
    businessName: 'Gourmet Cafe & Bistro',
    businessType: 'Restaurant / Food Service',
    phone: '+1 (555) 987-6543',
    location: 'Pike Place Market, Seattle',
    description: 'A charming neighborhood cafe focusing on locally sourced organic ingredients, artisan coffee, and fine pastries.',
    avatar: 'A'
  },
  {
    id: 3,
    name: 'Bob Smith',
    email: 'bobsmith.design@gmail.com',
    role: 'job_seeker',
    status: 'Blocked',
    joinedDate: '2026-05-01',
    phone: '+1 (555) 876-5432',
    location: 'Capitol Hill, Seattle',
    dob: '1999-11-23',
    gender: 'Male',
    avatar: 'B'
  },
  {
    id: 4,
    name: 'Emma Watson',
    email: 'emma@creativeevents.com',
    role: 'employer',
    status: 'Active',
    joinedDate: '2026-03-15',
    businessName: 'Creative Events Inc.',
    businessType: 'Event Planning & Entertainment',
    phone: '+1 (555) 345-6789',
    location: 'Bellevue, WA',
    description: 'Bespoke event planning firm orchestrating premium corporate gatherings, weddings, and music festivals.',
    avatar: 'E'
  },
  {
    id: 5,
    name: 'Michael Chang',
    email: 'm.chang@logistics.pro',
    role: 'employer',
    status: 'Active',
    joinedDate: '2026-04-20',
    businessName: 'Logistics Pro Services',
    businessType: 'Delivery & Transport',
    phone: '+1 (555) 765-4321',
    location: 'Industrial District, Seattle',
    description: 'Fast, secure, and reliable local courier and package delivery network operating 24/7.',
    avatar: 'M'
  },
  {
    id: 6,
    name: 'David K.',
    email: 'david@brightfutures.edu',
    role: 'employer',
    status: 'Active',
    joinedDate: '2026-01-10',
    businessName: 'Bright Futures Tutoring',
    businessType: 'Education & Tutoring',
    phone: '+1 (555) 456-7890',
    location: 'University District, Seattle',
    description: 'Empowering K-12 students through personalized learning plans and elite tutors from top-tier academic backgrounds.',
    avatar: 'D'
  },
  {
    id: 7,
    name: 'Jessica Miller',
    email: 'jess.miller@yahoo.com',
    role: 'job_seeker',
    status: 'Active',
    joinedDate: '2026-05-18',
    phone: '+1 (555) 567-8901',
    location: 'Fremont, Seattle',
    dob: '2003-04-05',
    gender: 'Female',
    avatar: 'J'
  },
  {
    id: 8,
    name: 'Marcus Brody',
    email: 'marcus.brody@gmail.com',
    role: 'job_seeker',
    status: 'Active',
    joinedDate: '2026-05-24',
    phone: '+1 (555) 678-9012',
    location: 'Queen Anne, Seattle',
    dob: '1995-12-01',
    gender: 'Male',
    avatar: 'M'
  },
  {
    id: 9,
    name: 'Sophia Lopez',
    email: 'sophia@homecarehelpers.org',
    role: 'employer',
    status: 'Active',
    joinedDate: '2026-04-05',
    businessName: 'Home Care Helpers',
    businessType: 'Healthcare & Nursing',
    phone: '+1 (555) 789-0123',
    location: 'Ballard, Seattle',
    description: 'Compassionate, qualified caregivers delivering bespoke home care plans and emotional support for seniors.',
    avatar: 'S'
  },
  {
    id: 10,
    name: 'Liam Neeson',
    email: 'liam.n@outlook.com',
    role: 'job_seeker',
    status: 'Blocked',
    joinedDate: '2026-05-10',
    phone: '+1 (555) 890-1234',
    location: 'West Seattle',
    dob: '1988-06-07',
    gender: 'Male',
    avatar: 'L'
  }
];

const INITIAL_JOBS = [
  {
    id: 101,
    title: 'Part-Time Specialty Barista',
    employerId: 2,
    employerName: 'Gourmet Cafe & Bistro',
    category: 'restaurant',
    categoryLabel: 'Restaurant & Food',
    salaryRange: '$16 - $19 / hr',
    jobType: 'part_time',
    jobTypeLabel: 'Part Time',
    location: 'Pike Place Market, Seattle',
    timing: 'Weekend Morning Shifts (6:00 AM - 1:00 PM)',
    slots: 3,
    isActive: true,
    createdAt: '2026-05-02',
    description: 'We are seeking an energetic and experienced barista to craft exceptional specialty coffee, manage retail transactions, and deliver warm, friendly customer service.'
  },
  {
    id: 102,
    title: 'Event Crew Assistant',
    employerId: 4,
    employerName: 'Creative Events Inc.',
    category: 'events',
    categoryLabel: 'Events & Entertainment',
    salaryRange: '$22 / hr',
    jobType: 'contract',
    jobTypeLabel: 'Contract',
    location: 'Bellevue Exhibition Center',
    timing: 'Friday & Saturday Evenings (5:00 PM - Midnight)',
    slots: 8,
    isActive: true,
    createdAt: '2026-05-10',
    description: 'Assist in setting up premium concert events, organizing seating layouts, checking in guests, and ensuring smooth stage logistics during operations.'
  },
  {
    id: 103,
    title: 'Local Courier & Delivery Driver',
    employerId: 5,
    employerName: 'Logistics Pro Services',
    category: 'delivery',
    categoryLabel: 'Delivery',
    salaryRange: '$18 - $24 / hr',
    jobType: 'part_time',
    jobTypeLabel: 'Part Time',
    location: 'Greater Seattle Area',
    timing: 'Flexible hours, customizable blocks (15-20 hours/week)',
    slots: 5,
    isActive: true,
    createdAt: '2026-05-12',
    description: 'Deliver retail packages and gourmet food orders across the city. Requires a valid driver license, clean driving record, and friendly communication style.'
  },
  {
    id: 104,
    title: 'Middle School Math Tutor',
    employerId: 6,
    employerName: 'Bright Futures Tutoring',
    category: 'education',
    categoryLabel: 'Education & Tutoring',
    salaryRange: '$25 - $30 / hr',
    jobType: 'part_time',
    jobTypeLabel: 'Part Time',
    location: 'University District / Remote option',
    timing: 'Tuesdays & Thursdays (3:30 PM - 7:00 PM)',
    slots: 2,
    isActive: true,
    createdAt: '2026-05-05',
    description: 'Provide personalized homework guidance and foundational math instruction to students aged 11-14. Curriculum materials are fully provided.'
  },
  {
    id: 105,
    title: 'Weekend Catering Buffet Server',
    employerId: 2,
    employerName: 'Gourmet Cafe & Bistro',
    category: 'restaurant',
    categoryLabel: 'Restaurant & Food',
    salaryRange: '$15 / hr + tips',
    jobType: 'part_time',
    jobTypeLabel: 'Part Time',
    location: 'Downtown Banquet Hall',
    timing: 'Saturdays (2:00 PM - 10:00 PM)',
    slots: 4,
    isActive: true,
    createdAt: '2026-05-14',
    description: 'Join our premium catering service team! Assist with buffet setup, serve gourmet meals, clear tables, and maintain exemplary hospitality standards.'
  },
  {
    id: 106,
    title: 'Part-Time Elderly Care Assistant',
    employerId: 9,
    employerName: 'Home Care Helpers',
    category: 'health_care',
    categoryLabel: 'Health & Care',
    salaryRange: '$20 / hr',
    jobType: 'part_time',
    jobTypeLabel: 'Part Time',
    location: 'Ballard Senior Residence',
    timing: 'Mondays, Wednesdays, Fridays (9:00 AM - 1:00 PM)',
    slots: 2,
    isActive: true,
    createdAt: '2026-05-08',
    description: 'Assist high-functioning seniors with morning routines, meal prep, light housework, and engaging companionship. Certified training is a major asset.'
  },
  {
    id: 107,
    title: 'Concert Stage & Light Technician',
    employerId: 4,
    employerName: 'Creative Events Inc.',
    category: 'events',
    categoryLabel: 'Events & Entertainment',
    salaryRange: '$26 / hr',
    jobType: 'contract',
    jobTypeLabel: 'Contract',
    location: 'Gas Works Park Amphitheater',
    timing: 'Seasonal / Weekend Concert Schedules',
    slots: 2,
    isActive: true,
    createdAt: '2026-05-15',
    description: 'Manage audio mixers and lighting rigs during weekend outdoor concert sessions. Requires prior live sound engineering experience.'
  }
];

export const initMockStore = () => {
  if (!localStorage.getItem('admin_users')) {
    localStorage.setItem('admin_users', JSON.stringify(INITIAL_USERS));
  }
  // Note: Jobs are now fetched from the real backend API
  // and are no longer stored in localStorage
};

export const getAllUsers = () => {
  initMockStore();
  const users = JSON.parse(localStorage.getItem('admin_users')) || [];
  // Never display Admin users in the user list
  return users.filter(u => u.role !== 'admin');
};

export const getAllJobs = () => {
  initMockStore();
  return JSON.parse(localStorage.getItem('admin_jobs')) || [];
};

export const blockUnblockUser = (userId) => {
  const users = getAllUsers();
  const rawUsers = JSON.parse(localStorage.getItem('admin_users')) || [];
  
  const updatedRaw = rawUsers.map(user => {
    if (user.id === userId) {
      const nextStatus = user.status === 'Active' ? 'Blocked' : 'Active';
      return { ...user, status: nextStatus };
    }
    return user;
  });
  
  localStorage.setItem('admin_users', JSON.stringify(updatedRaw));
  return updatedRaw.filter(u => u.role !== 'admin');
};

export const deleteUser = (userId) => {
  const rawUsers = JSON.parse(localStorage.getItem('admin_users')) || [];
  const updatedRaw = rawUsers.filter(user => user.id !== userId);
  localStorage.setItem('admin_users', JSON.stringify(updatedRaw));

  // If this user was an employer, also cascade delete their posted jobs!
  const jobs = getAllJobs();
  const updatedJobs = jobs.filter(job => job.employerId !== userId);
  localStorage.setItem('admin_jobs', JSON.stringify(updatedJobs));

  return updatedRaw.filter(u => u.role !== 'admin');
};

export const deleteJob = (jobId) => {
  const jobs = getAllJobs();
  const updatedJobs = jobs.filter(job => job.id !== jobId);
  localStorage.setItem('admin_jobs', JSON.stringify(updatedJobs));
  return updatedJobs;
};

export const getAdminStats = () => {
  const users = getAllUsers();
  // Note: totalJobsCount is computed from the real backend API in AdminDashboard
  const totalEmployerUsers  = users.filter(u => u.role === 'employer').length;
  const totalJobSeekerUsers = users.filter(u => u.role === 'job_seeker').length;

  return {
    totalJobsCount:      0, // Will be overridden by the real API count in the dashboard
    totalEmployerUsers,
    totalJobSeekerUsers,
  };
};
