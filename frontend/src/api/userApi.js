import axiosInstance from './axiosInstance';

export const fetchProfile = async () => {
  const response = await axiosInstance.get('auth/profile/');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axiosInstance.patch('auth/profile/update/', data);
  return response.data;
};
