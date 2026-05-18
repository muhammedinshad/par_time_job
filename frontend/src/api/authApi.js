import axiosInstance from './axiosInstance';

export const sendOTP = async (data) => {
  const response = await axiosInstance.post('auth/send-otp/', data);
  return response.data;
};

export const verifyOTP = async (data) => {
  const response = await axiosInstance.post('auth/verify-otp/', data);
  return response.data;
};

export const login = async (credentials) => {
  const response = await axiosInstance.post('auth/login/', credentials);
  return response.data;
};

export const registerEmployer = async (userData) => {
  const response = await axiosInstance.post('auth/register/employer/', userData);
  return response.data;
};

export const registerJobSeeker = async (userData) => {
  const response = await axiosInstance.post('auth/register/jobseeker/', userData);
  return response.data;
};

export const logoutApi = async () => {
  const response = await axiosInstance.post('auth/logout/');
  return response.data;
};

export const googleCallback = async () => {
  const response = await axiosInstance.get('auth/google/callback/');
  return response.data;
};

export const completeProfile = async (data) => {
  const response = await axiosInstance.post('auth/google/complete-profile/', data);
  return response.data;
};

export const getProfile = async () => {
  const response = await axiosInstance.get('auth/profile/');
  return response.data;
};
