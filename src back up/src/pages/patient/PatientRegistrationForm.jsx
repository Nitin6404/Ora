import React, { useState, useEffect } from "react";
import { fetchPrograms } from "../../services/programService";
import { createPatient } from "../../services/patientService";
import Navigation from "./Navigation";

export default function PatientRegistrationForm() {
  const [step, setStep] = useState(1);
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    email: "",
    phone_no: "",
    password: "",
    program: "",
    concent_given: false,
  });
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    const loadPrograms = async () => {
      const data = await fetchPrograms();
      setPrograms(data);
    };
    loadPrograms();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    const response = await createPatient(formData);
    setQrCode(response.qrcode);
  };

  return (
    <Navigation>
        <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Patient Registration</h2>

        {step === 1 && (
            <div className="space-y-4">
            <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
            />
            <input
                type="text"
                name="date_of_birth"
                placeholder="Date of Birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
            />
            <input
                type="text"
                name="phone_no"
                placeholder="Phone Number"
                value={formData.phone_no}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
            />
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => setStep(2)}
            >
                Continue
            </button>
            </div>
        )}

        {step === 2 && (
            <div className="space-y-4">
            <select
                name="program"
                value={formData.program}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
            >
                <option value="">Select a Program</option>
                {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => setStep(3)}
            >
                Continue
            </button>
            </div>
        )}

        {step === 3 && (
            <div className="space-y-4">
            <label className="flex items-center">
                <input
                type="checkbox"
                name="concent_given"
                checked={formData.concent_given}
                onChange={handleChange}
                className="mr-2"
                />
                I agree with the terms
            </label>
            <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                disabled={!formData.concent_given}
                onClick={handleSubmit}
            >
                Submit
            </button>
            </div>
        )}

        {qrCode && (
            <div className="mt-6 p-4 border rounded bg-green-50">
            <p className="font-bold">Registration Successful!</p>
            <p>Your QR Code: <span className="font-mono text-lg">{qrCode}</span></p>
            </div>
        )}
        </div>
    </Navigation>
  );
}
