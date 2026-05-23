import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutApi } from '../../api/authApi';
import { logout } from '../../store/authSlice';
import {
  BriefcaseIcon,
  DocumentTextIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { BriefcaseIcon as BriefcaseSolid } from '@heroicons/react/24/solid';

const SeekerSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navItems = [
    { to: '/jobseeker/dashboard/browse-jobs', label: 'Browse Jobs', icon: BriefcaseIcon, solidIcon: BriefcaseSolid },
    { to: '/jobseeker/dashboard/my-applications', label: 'My Applications', icon: DocumentTextIcon },
    { to: '/jobseeker/dashboard/profile', label: 'Profile', icon: UserIcon },
  ];

  const handleLogout = async () => {
    try {
      await logoutApi();
      dispatch(logout());
      navigate('/login');
    } catch {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <aside className="w-[260px] bg-white border-r border-[#f0f0f0] flex flex-col shrink-0 h-screen overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      <div className="flex items-center gap-3 px-8 mt-8 mb-10">
        <div className="w-8 h-8 relative shrink-0">
          <span className="absolute border-[3px] border-[#136040] rounded-full w-7 h-7 top-0 left-0"></span>
          <span className="absolute border-[3px] border-[#1d8258] rounded-full w-[18px] h-[18px] top-[5px] left-[5px]"></span>
          <span className="absolute bg-[#136040] rounded-full w-[10px] h-[10px] top-[9px] left-[9px]"></span>
        </div>
        <h2 className="text-[22px] font-bold text-[#111827] m-0">Donezo</h2>
      </div>

      <div className="mb-8">
        <h3 className="text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider px-8 mb-4">SEEKER MENU</h3>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/jobseeker/dashboard/browse-jobs'}
              className={({ isActive }) =>
                `flex items-center gap-4 px-8 py-2.5 relative transition-colors hover:bg-black/[0.04] ${
                  isActive ? 'text-[#111827] font-bold' : 'text-[#9ca3af] font-medium hover:text-[#4b5563]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[5px] h-8 bg-[#136040] rounded-r-md"></div>
                  )}
                  {isActive && item.solidIcon ? (
                    <item.solidIcon className="w-[22px] h-[22px] text-[#136040]" />
                  ) : (
                    <item.icon className={`w-[22px] h-[22px] ${isActive ? 'text-[#136040]' : 'text-[#9ca3af]'}`} />
                  )}
                  <span className="text-[15px]">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto mb-8 px-8">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 py-2.5 text-[#9ca3af] font-medium transition-colors hover:text-[#4b5563] w-full text-left bg-transparent border-none rounded-none shadow-none hover:translate-y-0"
        >
          <ArrowRightOnRectangleIcon className="w-[22px] h-[22px] rotate-180" />
          <span className="text-[15px]">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SeekerSidebar;
