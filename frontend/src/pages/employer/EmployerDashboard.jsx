import React from 'react';
import {
  PlusIcon,
  ArrowUpRightIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import Sidebar from '../../components/common/Sidebar';
import EmployerNavbar from './EmployerNavbar';

const EmployerDashboard = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#f5f7f6] text-[#111827] font-sans flex z-[9999] overflow-hidden m-0 p-0">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <EmployerNavbar />

        {/* Dashboard Content */}
        <div className="px-10 pb-10 flex-1 max-w-[1400px]">
          {/* Page Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">Dashboard</h1>
              <p className="text-[15px] text-[#9ca3af] font-medium">Plan, prioritize, and accomplish your tasks with ease.</p>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-[#176646] text-white px-6 py-3 rounded-full text-[15px] font-semibold hover:bg-[#0f4f34] transition-colors shadow-sm">
                <PlusIcon className="w-5 h-5 stroke-2" /> Add Job
              </button>
              <button className="bg-transparent text-[#1f2937] px-6 py-3 rounded-full text-[15px] font-semibold border border-[#d1d5db] hover:bg-black/5 transition-colors">
                Import Data
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {/* Card 1 — Total Jobs Count (colored) */}
            <div className="bg-gradient-to-br from-[#12583d] to-[#1d8258] text-white rounded-[24px] p-6 flex flex-col shadow-sm min-h-[190px]">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-[16px] font-semibold">Total Jobs Count</h3>
                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-[#111827] hover:scale-105 transition-transform">
                  <ArrowUpRightIcon className="w-4 h-4 stroke-2" />
                </button>
              </div>
              <div className="text-[48px] font-bold tracking-tight mb-auto leading-none mt-2">24</div>
              <div className="mt-4">
                <span className="flex items-center gap-2 text-[13px] font-medium text-[#79d89a]">
                  <span className="bg-[#1b734f] rounded-md px-1 py-0.5"><ArrowTrendingUpIcon className="w-3.5 h-3.5 text-[#79d89a]" /></span> Increased from last month
                </span>
              </div>
            </div>

            {/* Card 2 — Total Applications */}
            <div className="bg-white text-[#111827] rounded-[24px] p-6 flex flex-col shadow-sm min-h-[190px]">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-[16px] font-semibold">Total Applications</h3>
                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-[#e5e7eb] text-[#111827] hover:scale-105 transition-transform hover:bg-gray-50">
                  <ArrowUpRightIcon className="w-4 h-4 stroke-2" />
                </button>
              </div>
              <div className="text-[48px] font-bold tracking-tight mb-auto leading-none mt-2">10</div>
              <div className="mt-4">
                <span className="flex items-center gap-2 text-[13px] font-medium text-[#1d8258]">
                  <span className="border border-[#e5e7eb] rounded-md px-1 py-0.5"><ArrowTrendingUpIcon className="w-3.5 h-3.5 text-[#1d8258]" /></span> Increased from last month
                </span>
              </div>
            </div>

            {/* Card 3 — Active Jobs Count */}
            <div className="bg-white text-[#111827] rounded-[24px] p-6 flex flex-col shadow-sm min-h-[190px]">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-[16px] font-semibold">Active Jobs Count</h3>
                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-[#e5e7eb] text-[#111827] hover:scale-105 transition-transform hover:bg-gray-50">
                  <ArrowUpRightIcon className="w-4 h-4 stroke-2" />
                </button>
              </div>
              <div className="text-[48px] font-bold tracking-tight mb-auto leading-none mt-2">12</div>
              <div className="mt-4">
                <span className="flex items-center gap-2 text-[13px] font-medium text-[#1d8258]">
                  <span className="border border-[#e5e7eb] rounded-md px-1 py-0.5"><ArrowTrendingUpIcon className="w-3.5 h-3.5 text-[#1d8258]" /></span> Increased from last month
                </span>
              </div>
            </div>

            {/* Card 4 — Total Selected */}
            <div className="bg-white text-[#111827] rounded-[24px] p-6 flex flex-col shadow-sm min-h-[190px]">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-[16px] font-semibold">Total Selected</h3>
                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-[#e5e7eb] text-[#111827] hover:scale-105 transition-transform hover:bg-gray-50">
                  <ArrowUpRightIcon className="w-4 h-4 stroke-2" />
                </button>
              </div>
              <div className="text-[48px] font-bold tracking-tight mb-auto leading-none mt-2">2</div>
              <div className="mt-4">
                <span className="text-[13px] font-medium text-[#9ca3af]">
                  On Discuss
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-6">
            {/* Recent Job Postings */}
            <div className="bg-white rounded-[24px] p-6 min-h-[320px] shadow-sm">
              <h3 className="text-[18px] font-bold text-[#111827] mb-6">Recent Job Postings</h3>
              <div className="flex items-center justify-center h-[200px] text-[#9ca3af] bg-gray-50 rounded-[16px] border border-dashed border-gray-200">
                <p className="text-[14px]">No recent job postings available.</p>
              </div>
            </div>

            {/* Latest Applications */}
            <div className="bg-white rounded-[24px] p-6 min-h-[320px] shadow-sm flex flex-col">
              <h3 className="text-[18px] font-bold text-[#111827] mb-6">Latest Applications</h3>
              <div className="mt-auto">
                <button className="w-full bg-[#136040] text-white rounded-[14px] py-4 font-semibold text-[15px] flex items-center justify-center gap-2 shadow-sm hover:bg-[#0f4f34]">
                  Start Meeting
                </button>
              </div>
            </div>

            {/* Additional Card */}
            <div className="bg-white rounded-[24px] p-6 min-h-[320px] shadow-sm">
              <h3 className="text-[18px] font-bold text-[#111827] mb-6">Upcoming Interviews</h3>
              <div className="flex items-center justify-center h-[200px] text-[#9ca3af] bg-gray-50 rounded-[16px] border border-dashed border-gray-200">
                <p className="text-[14px]">No upcoming interviews.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerDashboard;
