import React, { useState } from "react";
import axios from "axios";
import { Eye, Trash2, Upload } from "lucide-react";
import Navigation from "../pages/admin/Navigation";
import TopBar from "../pages/admin/dashboard/components/TopBar";
const API_URL = "https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/dev/api/patient/patients/";

export default function AddPatient() {
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    email: "",
    phone_no: "",
    password: "",
    is_active: true,
    concent_given: true,
    program_id: 1,
  });

  const [uploadedScripts, setUploadedScripts] = useState([]);
  const [vmaScript, setVmaScript] = useState(null);
  const [vmsScript, setVmsScript] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleScriptUpload = (type, file) => {
    const newScript = {
      id: Date.now(),
      type,
      file,
    };
    setUploadedScripts((prev) => [...prev, newScript]);
    if (type === "VMA") setVmaScript(file);
    if (type === "VMS") setVmsScript(file);
  };

  const handleScriptDelete = (id) => {
    setUploadedScripts((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ Patient created!");
      console.log(res.data);
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      alert("Failed to add patient.");
    } finally {
      setLoading(false);
    }
  };

  return (

     <Navigation>
          <div className="flex flex-col min-h-screen font-inter">
            <div className="sticky top-0 z-[999] p-4 md:px-6 md:py-3 backdrop-blur-sm md:ml-4">
              <TopBar />
    <div className="p-8 flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Add New Patient</h2>

      <div className="flex flex-wrap gap-8">
        {/* Left side form */}
        <div className="flex flex-col gap-4 w-full max-w-3xl">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Full Name"
              className="border rounded px-3 py-2"
            />
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              placeholder="Phone Number"
              className="border rounded px-3 py-2"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="border rounded px-3 py-2"
            />
            <select
              name="program_id"
              value={formData.program_id}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            >
              <option value={1}>Program 1</option>
              <option value={2}>Program 2</option>
            </select>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Active
            </label>
            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="concent_given"
                checked={formData.concent_given}
                onChange={handleChange}
              />
              Consent Given
            </label>
          </div>

          {/* Upload buttons */}
          {/* <div className="flex flex-col gap-3 mt-4">
            <label className="flex items-center gap-4">
              <span>VMA Script:</span>
              <input
                type="file"
                accept=".txt,.pdf"
                onChange={(e) => handleScriptUpload("VMA", e.target.files[0])}
              />
              <Upload size={18} />
            </label>
            <label className="flex items-center gap-4">
              <span>VMS Script:</span>
              <input
                type="file"
                accept=".txt,.pdf"
                onChange={(e) => handleScriptUpload("VMS", e.target.files[0])}
              />
              <Upload size={18} />
            </label>
          </div> */}
        </div>

        {/* Right panel - Uploaded scripts */}
        {/* <div className="bg-gray-50 p-4 rounded shadow w-64">
          <div className="font-medium mb-2">Uploaded Scripts</div>
          {uploadedScripts.map((s, index) => (
            <div key={s.id} className="flex justify-between items-center px-2 py-1 border mb-1 rounded">
              <span>{s.type} {index + 1}</span>
              <div className="flex gap-2">
                <Eye size={16} className="text-gray-600 cursor-pointer" />
                <Trash2
                  size={16}
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleScriptDelete(s.id)}
                />
              </div>
            </div>
          ))}
        </div> */}
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full"
        >
          {loading ? "Saving..." : "Submit"}
        </button>
      </div>
    </div>
         </div>
          </div>
        </Navigation>
  );
}
