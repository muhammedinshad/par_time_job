import axiosInstance from './axiosInstance';

// ─── Fetch Users (search + role filter) ────────
export const fetchAdminUsers = async (search = '', role = '') => {
  const params = {};
  if (search) params.search = search;
  if (role)   params.role   = role;

  const response = await axiosInstance.get('auth/admin/users/', { params });
  return response.data; // { users: [...], total: N }
};

// ─── Block a User ─────────────
export const blockUser = async (userId) => {
  const response = await axiosInstance.patch(`auth/admin/users/${userId}/`, {
    action: 'block',
  });
  return response.data;
};

// ─── Unblock a User ─────────────────
export const unblockUser = async (userId) => {
  const response = await axiosInstance.patch(`auth/admin/users/${userId}/`, {
    action: 'unblock',
  });
  return response.data;
};

// ─── Delete a User ─────────────
export const deleteUser = async (userId) => {
  const response = await axiosInstance.delete(`auth/admin/users/${userId}/`);
  return response.data;
};

// ─── View a Single User ───────────
export const fetchAdminUserDetail = async (userId) => {
  const response = await axiosInstance.get(`auth/admin/users/${userId}/`);
  return response.data;
};