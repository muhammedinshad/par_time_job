import axiosInstance from './axiosInstance';

export const fetchActiveJobs = async (params) => {
  const response = await axiosInstance.get('jobs/jobs/', { params });
  return response.data;
};

export const fetchJobDetail = async (id) => {
  const response = await axiosInstance.get(`jobs/jobs/${id}/`);
  return response.data;
};

export const applyToJob = async (formData) => {
  const response = await axiosInstance.post('application/apply-job/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const fetchMyApplications = async () => {
  const response = await axiosInstance.get('application/mine/');
  return response.data;
};

export const fetchApplicationDetail = async (id) => {
  const response = await axiosInstance.get(`application/employer/applications/${id}/`);
  return response.data;
};

export const fetchEmployerApplications = async () => {
  const response = await axiosInstance.get('application/employer/applications/');
  return response.data;
};

export const updateApplicationStatus = async (id, data) => {
  const response = await axiosInstance.patch(`application/employer/applications/status/${id}/`, data);
  return response.data;
};

export const fetchEmployerJobDetail = async (id) => {
  const response = await axiosInstance.get(`jobs/${id}/`);
  return response.data;
};

export const updateEmployerJob = async (id, data) => {
  const response = await axiosInstance.patch(`jobs/${id}/`, data);
  return response.data;
};

export const fetchEmployerProfile = async () => {
  const response = await axiosInstance.get('auth/profile/');
  return response.data;
};

export const updateEmployerProfile = async (data) => {
  const response = await axiosInstance.patch('auth/profile/update/', data);
  return response.data;
};
