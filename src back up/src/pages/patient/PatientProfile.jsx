import React, { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import Navigation from './Navigation';


const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await apiService.get('/api/patient/patients/profile/');
        setPatient(response.data);
      } catch (error) {
        console.error('Failed to fetch patient profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, []);

  if (loading) return <p>Loading patient profile...</p>;
  if (!patient) return <p>Patient not found.</p>;

  return (
    <Navigation>
      <div className="p-4 max-w-lg mx-auto bg-white shadow rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Patient Profile</h2>
        <p><strong>Full Name:</strong> {patient.full_name}</p>
        <p><strong>Date of Birth:</strong> {patient.date_of_birth}</p>
        <p><strong>Email:</strong> {patient.email}</p>
        <p><strong>Phone Number:</strong> {patient.phone_no}</p>
        <p><strong>QR Code:</strong> {patient.qrcode}</p>
        <p><strong>Program:</strong> {patient.program?.name || "Not Assigned"}</p>
      </div>
    </Navigation>
  );
};


export default PatientProfile;