import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../pages/admin/Navigation";
import TopBar from "../pages/admin/dashboard/components/TopBar";
import { useNavigate } from "react-router-dom";
import { Eye, Edit2, Trash2, Plus } from "lucide-react";

const API_URL =
  "https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/dev/api/patient/patients/";

export default function NewPatient() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const navigate = useNavigate();

  const fetchPatients = async (url = API_URL) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("🚀 Fetched patients:", res.data);
      setPatients(res.data.results);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
    } catch (err) {
      console.error("❌ Failed to fetch patients:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleView = (id) => {
    console.log("👁️ View patient ID:", id);
    navigate(`/programview/${id}`);
  };

  const handleEdit = (id) => {
    console.log("✏️ Edit patient ID:", id);
    navigate(`/editpatient/${id}`);
  };

  const handleDelete = (id) => {
    console.log("🗑️ Delete patient ID:", id);
  };

  const handleAddPatient = () => {
    console.log("➕ Add New Patient clicked");
    navigate("/addpatient");
  };

  return (
    <Navigation>
      <div className="flex flex-col min-h-screen font-inter">
        <div className="sticky top-0 z-[999] p-4 md:px-6 md:py-3 backdrop-blur-sm md:ml-4">
          <TopBar />
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Patients</h2>
              <button
                onClick={handleAddPatient}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Add New Patient
              </button>
            </div>

            {loading ? (
              <p>Loading patients...</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 border">#</th>
                        <th className="px-4 py-2 border">Full Name</th>
                        <th className="px-4 py-2 border">DOB</th>
                        <th className="px-4 py-2 border">Email</th>
                        <th className="px-4 py-2 border">Phone</th>
                        <th className="px-4 py-2 border">QR Code</th>
                        <th className="px-4 py-2 border">Active</th>
                        <th className="px-4 py-2 border">Consent</th>
                        <th className="px-4 py-2 border">Created At</th>
                        <th className="px-4 py-2 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient, index) => (
                        <tr key={patient.id} className="border-t">
                          <td className="px-4 py-2 border">{index + 1}</td>
                          <td className="px-4 py-2 border">{patient.full_name}</td>
                          <td className="px-4 py-2 border">{patient.date_of_birth}</td>
                          <td className="px-4 py-2 border">{patient.email}</td>
                          <td className="px-4 py-2 border">{patient.phone_no}</td>
                          <td className="px-4 py-2 border">{patient.qrcode}</td>
                          <td className="px-4 py-2 border">
                            {patient.is_active ? "✅" : "❌"}
                          </td>
                          <td className="px-4 py-2 border">
                            {patient.concent_given ? "✅" : "❌"}
                          </td>
                          <td className="px-4 py-2 border">
                            {new Date(patient.created_date).toLocaleString()}
                          </td>
                          <td className="px-4 py-2 border">
                            <div className="flex space-x-3 justify-center">
                              <button
                                onClick={() => handleView(patient.id)}
                                title="View"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => handleEdit(patient.id)}
                                title="Edit"
                                className="text-green-600 hover:text-green-800"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(patient.id)}
                                title="Delete"
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => fetchPatients(prevPage)}
                    disabled={!prevPage}
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-1 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchPatients(nextPage)}
                    disabled={!nextPage}
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-1 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Navigation>
  );
}
