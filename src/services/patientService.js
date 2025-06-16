import api from './apiService';

export const createPatient = async (patientData) => {
  const payload = { ...patientData, program_id: patientData.program };
  delete payload.program;

  const response = await api.post('/api/patient/patients/', payload);
  return response.data;
};

export const fetchPatients = async () => {
  const response = await api.get('/api/patient/patients/');
  return response.data;
};

export const updatePatient = async (id, data) => {
  const payload = { ...data, program_id: data.program };

  // Remove password if empty
  if (!payload.password) {
    delete payload.password;
  }

  delete payload.program; // Remove if exists to avoid confusion

  // Ensure program is a number
  //payload.program = Number(payload.program);

  const response = await api.put(`/api/patient/patients/${id}/`, payload);
  return response.data;
};

export const deletePatient = async (id) => {
  const response = await api.delete(`/api/patient/patients/${id}/`);
  return response.data;
};

export const refreshQRCode = async (id) => {
  const response = await api.post(`/api/patient/patients/${id}/refresh_qrcode/`);
  return response.data;
};

