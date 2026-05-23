import { Outlet } from 'react-router-dom';
import SeekerSidebar from './SeekerSidebar';

const JobSeekerDashboard = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#f5f7f6] text-[#111827] font-sans flex z-[9999] overflow-hidden m-0 p-0">
      <SeekerSidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="px-10 pb-10 flex-1 max-w-[1400px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default JobSeekerDashboard;
