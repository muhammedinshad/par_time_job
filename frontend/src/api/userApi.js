import axiosInstance from './axiosInstance';

export const fetchProfile = async () => {
  const response = await axiosInstance.get('/user/profile/');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axiosInstance.put('/user/profile/', data);
  return response.data;
};
