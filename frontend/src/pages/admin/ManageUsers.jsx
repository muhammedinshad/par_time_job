import { useState } from 'react';
import {
  blockUser as blockUserApi,
  unblockUser as unblockUserApi,
  deleteUser as deleteUserApi,
  fetchAdminUserDetail,
} from '../../api/adminApi';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  LockClosedIcon,
  LockOpenIcon,
  TrashIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const normalizeUser = (u) => ({
  id: u.id,
  name: u.name || u.email,
  email: u.email,
  role: u.role,
  status: u.status,
  joinedDate: u.created_at ? u.created_at.slice(0, 10) : '',
  phone: u.phone || '',
  location: u.location || '',
  businessName: u.business_name || '',
  businessType: u.business_type || '',
  description: u.description || '',
  dob: u.dob || '',
  gender: u.gender || '',
  avatar: (u.name || u.email)[0].toUpperCase(),
});

const ManageUsers = ({ users, onUsersUpdate, triggerNotification }) => {
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (user.location && user.location.toLowerCase().includes(userSearch.toLowerCase())) ||
      (user.businessName && user.businessName.toLowerCase().includes(userSearch.toLowerCase()));
    const matchesRole = userRoleFilter === 'all' ? true : user.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setUserDetailLoading(true);
    setUserDetail(null);
    try {
      const data = await fetchAdminUserDetail(user.id);
      setUserDetail(normalizeUser(data));
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      setUserDetail(user);
    } finally {
      setUserDetailLoading(false);
    }
  };

  const closeUserDetail = () => {
    setSelectedUser(null);
    setUserDetail(null);
  };

  const handleBlockToggle = async (userId, userName) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const wasBlocked = user.status === 'Blocked';
    try {
      if (wasBlocked) {
        await unblockUserApi(userId);
      } else {
        await blockUserApi(userId);
      }
      onUsersUpdate(prev => prev.map(u =>
        u.id === userId
          ? { ...u, status: wasBlocked ? 'Active' : 'Blocked' }
          : u
      ));
      triggerNotification(`Successfully ${wasBlocked ? 'unblocked' : 'blocked'} ${userName}.`, 'info');
    } catch {
      triggerNotification(`Failed to ${wasBlocked ? 'unblock' : 'block'} ${userName}.`, 'error');
    }
  };

  const handleDeleteClick = (id) => {
    setShowDeleteConfirm({ id });
  };

  const handleConfirmDelete = async () => {
    if (!showDeleteConfirm) return;
    const { id } = showDeleteConfirm;
    try {
      await deleteUserApi(id);
      onUsersUpdate(prev => {
        const updated = prev.filter(u => u.id !== id);
        return updated;
      });
      triggerNotification('User account deleted successfully.', 'error');
    } catch {
      triggerNotification('Failed to delete user account.', 'error');
    }
    setShowDeleteConfirm(null);
  };

  const detail = userDetail || selectedUser;

  return (
    <div className="bg-white rounded-[24px] p-6.5 border border-gray-100 shadow-sm">

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
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
                        onClick={() => handleViewUser(user)}
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
                        onClick={() => handleDeleteClick(user.id)}
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

      {/* VIEW DETAILS USER MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-[#111827]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-[28px] max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
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
                onClick={closeUserDetail}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all border border-white/10"
              >
                <XMarkIcon className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>
            </div>

            <div className="p-8 text-left max-h-[75vh] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              {userDetailLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              ) : detail ? (
                <div className="flex flex-col gap-6">

                  <div className="grid grid-cols-1 gap-4.5">
                    <div className="flex items-center gap-3.5 bg-gray-50 border border-gray-100/50 p-4.5 rounded-2xl">
                      <EnvelopeIcon className="w-5.5 h-5.5 text-indigo-600 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[11px] text-gray-400 font-bold uppercase">Email Address</span>
                        <span className="text-[14px] font-semibold text-[#111827] break-all">{detail.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 bg-gray-50 border border-gray-100/50 p-4.5 rounded-2xl">
                      <PhoneIcon className="w-5.5 h-5.5 text-indigo-600 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[11px] text-gray-400 font-bold uppercase">Phone Number</span>
                        <span className="text-[14px] font-semibold text-[#111827]">{detail.phone || 'Not Specified'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 bg-gray-50 border border-gray-100/50 p-4.5 rounded-2xl">
                      <MapPinIcon className="w-5.5 h-5.5 text-indigo-600 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[11px] text-gray-400 font-bold uppercase">Base Location</span>
                        <span className="text-[14px] font-semibold text-[#111827]">{detail.location || 'Not Specified'}</span>
                      </div>
                    </div>
                  </div>

                  {detail.role === 'employer' ? (
                    <div className="border-t border-gray-100 pt-5 flex flex-col gap-4.5">
                      <h4 className="text-[14px] font-extrabold text-[#111827] tracking-tight uppercase border-b border-gray-50 pb-2">
                        Company Particulars
                      </h4>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-400 font-bold uppercase">Business Entity</span>
                          <span className="text-[13.5px] font-bold text-gray-800 mt-1">{detail.businessName || 'Not Provided'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-400 font-bold uppercase">Sector / Type</span>
                          <span className="text-[13.5px] font-bold text-gray-800 mt-1">{detail.businessType || 'Not Provided'}</span>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[11px] text-gray-400 font-bold uppercase">Corporate Bio</span>
                        <p className="text-[13px] text-gray-500 font-medium mt-1 leading-relaxed bg-gray-50/50 border border-gray-100 p-3 rounded-xl">
                          {detail.description || 'No business details provided.'}
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
                          <span className="text-[13.5px] font-bold text-gray-800 mt-1">{detail.dob || 'Not Provided'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-400 font-bold uppercase">Gender Identity</span>
                          <span className="text-[13.5px] font-bold text-gray-800 mt-1">{detail.gender || 'Not Provided'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-5 flex items-center justify-between text-[12px] font-bold text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <span>Registered on {detail.joinedDate}</span>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase border ${
                      detail.status === 'Active'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      {detail.status} status
                    </span>
                  </div>

                </div>
              ) : null}
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
              Deleting this account will erase all profile details and purge any vacancies cascade-linked to this user. This action is permanent.
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

export default ManageUsers;
