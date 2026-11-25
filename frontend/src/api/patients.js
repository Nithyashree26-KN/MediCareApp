import axios from 'axios';

// Production: Railway backend | Development: localhost proxy
const API_HOST = import.meta.env.PROD
  ? 'https://medicareapp-production.up.railway.app'
  : '';
const BASE_URL = `${API_HOST}/api/patients`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getAllPatients = (filters = {}) => {
  const params = {};
  if (filters.ward)       params.ward       = filters.ward;
  if (filters.department) params.department = filters.department;
  if (filters.doctor)     params.doctor     = filters.doctor;
  if (filters.search)     params.search     = filters.search;
  return api.get('', { params });
};

export const getPatientById = (id)             => api.get(`/${id}`);
export const createPatient  = (patient)        => api.post('', patient);
export const updatePatient  = (id, patient)    => api.put(`/${id}`, patient);
export const deletePatient  = (id)             => api.delete(`/${id}`);
export const dischargePatient = (id)           => api.patch(`/${id}/discharge`);
