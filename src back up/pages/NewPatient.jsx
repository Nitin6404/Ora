import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../pages/admin/Navigation";
import PatientTopBar from "../components/PatientTopBar";
import { useNavigate } from "react-router-dom";
import { Eye, Edit2, Trash2, Plus, Search, Calendar, Menu } from "lucide-react";

const FILTER_OPTIONS = [
  { id: 'all', label: 'All', isActive: true },
  { id: 'active', label: 'Active', isActive: false },
  { id: 'inactive', label: 'Inactive', isActive: false }
];

const API_URL =
  "https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/dev/api/patient/patients/";

export default function NewPatient() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const [filterOptions, setFilterOptions] = useState(FILTER_OPTIONS);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredPatients = patients.filter((patient) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return patient.is_active;
    if (activeFilter === 'inactive') return !patient.is_active;
    return true;
  });


  const navigate = useNavigate();

  const fetchPatients = async (url = API_URL, filter = activeFilter) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found");
      return;
    }

    try {
      setLoading(true);

      // Build filter query
      const params = new URLSearchParams();

      if (filter === "active") params.append("is_active", "true");
      if (filter === "inactive") params.append("is_active", "false");

      const fullUrl = url.includes("?") ? `${url}&${params.toString()}` : `${url}?${params.toString()}`;

      const res = await axios.get(fullUrl, {
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
    fetchPatients(API_URL, activeFilter);
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

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setFilterOptions(prev =>
      prev.map(option => ({
        ...option,
        isActive: option.id === filterId,
      }))
    );
    fetchPatients(API_URL, filterId); // Fetch with selected filter
  };



  return (
    <Navigation>
      <div className="flex flex-col min-h-screen font-inter no-scrollbar">
        <div className="sticky top-0 z-[999] p-2 md:px-6 md:py-0 backdrop-blur-sm md:ml-4">
          <PatientTopBar />
          <div className="py-1">
            <div className="flex flex-col gap-0">

              {/* FILTER + SEARCH + ADD as TABLE */}
              <div className="w-full bg-[#ebeafd]/40 rounded-t-[30px] px-3 pt-2">
                <div className="bg-white p-2 rounded-[30px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                  {/* Filter Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleFilterChange(option.id)}
                        className={`px-5 py-2 rounded-full text-xs lg:text-sm font-medium transition-colors duration-200 ${option.isActive
                            ? "text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] shadow-md"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  {/* Date Picker & Add Button */}
                  <div className="flex flex-wrap gap-2 items-center justify-end">
                    <Search className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" /> 
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        className="pl-10 pr-4 py-2 rounded-full  text-xs lg:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleAddPatient}
                      className="px-5 py-2 text-xs lg:text-sm font-medium text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] rounded-full shadow-md flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add New Patient
                    </button>
                  </div>

                </div>
              </div>


              {/* PATIENT TABLE */}
              {loading ? (
                <p>Loading patients...</p>
              ) : (
                <>
                  <div className="relative overflow-hidden bg-transparent rounded-b-[30px]">
                    <div className="relative overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)] no-scrollbar">
                      <table className="min-w-full border-separate border-spacing-y-2 bg-[#ebeafd]/40 px-2 pb-2 no-scrollbar">
                        <thead>
                          <tr className={`rounded-[30px] transition-colors bg-[#c7c2fa] `}>
                            <th className="px-3 py-4 text-xs lg:text-sm text-left rounded-l-[30px] font-medium">Full Name</th>
                            <th className="px-3 py-4 text-xs lg:text-sm text-left font-medium">Id</th>
                            <th className="px-3 py-4 text-xs lg:text-sm text-left font-medium">DOB</th>
                            <th className="px-3 py-4 text-xs lg:text-sm text-left font-medium">Email</th>
                            <th className="px-3 py-4 text-xs lg:text-sm text-left font-medium">Phone</th>
                            <th className="px-3 py-4 text-xs lg:text-sm text-left font-medium">QR Code</th>
                            <th className="px-3 py-4 text-xs lg:text-sm text-left font-medium">Status</th>
                            <th className="px-3 py-4 text-xs lg:text-sm text-left font-medium">Consent</th>
                            <th className="px-3 py-4 text-xs lg:text-sm text-left font-medium">Created At</th>
                            <th className="px-3 py-4 text-xs lg:text-sm text-left font-medium rounded-r-[30px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="no-scrollbar">
                          {patients.map((patient) => (

                            <tr
                              key={patient.id}
                              className={`rounded-[30px] transition-colors bg-[#edebf6] hover:bg-[#fff]`}
                            >
                              <td className="px-3 py-4 text-xs lg:text-sm rounded-l-[30px]">{patient.full_name}</td>
                              <td className="px-3 py-4 text-xs lg:text-sm">{patient.id}</td>
                              <td className="px-3 py-4 text-xs lg:text-sm">{patient.date_of_birth}</td>
                              <td className="px-3 py-4 text-xs lg:text-sm">{patient.email}</td>
                              <td className="px-3 py-4 text-xs lg:text-sm">{patient.phone_no}</td>
                              <td className="px-3 py-4 text-xs lg:text-sm">{patient.qrcode}</td>
                              <td className="px-3 py-4 text-xs lg:text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${patient.is_active
                                    ? 'bg-[#d4f8df] text-green-800'
                                    : 'bg-[#fde4e4] text-red-800'
                                    }`}
                                >
                                  {patient.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-3 py-4 text-xs lg:text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${patient.concent_given
                                    ? 'bg-[#d4f8df] text-green-800'
                                    : 'bg-[#fde4e4] text-red-800'
                                    }`}
                                >
                                  {patient.concent_given ? 'Given' : 'Not Given'}
                                </span>
                              </td>
                              <td className="px-3 py-4 text-xs lg:text-sm">
                                {new Date(patient.created_date).toLocaleDateString()}
                              </td>
                              <td className="px-3 py-4 text-xs lg:text-sm rounded-r-[30px]">
                                <div className="relative">
                                  <button
                                    onClick={() =>
                                      setOpenMenuId(openMenuId === patient.id ? null : patient.id)
                                    }
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    <Menu size={18} />
                                  </button>
                                  {openMenuId === patient.id && (
                                    <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                      <button
                                        onClick={() => handleView(patient.id)}
                                        className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
                                      >
                                        View
                                      </button>
                                      <button
                                        onClick={() => handleEdit(patient.id)}
                                        className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDelete(patient.id)}
                                        className="block px-4 py-2 text-base text-red-700 hover:bg-red-100"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pagination Controls */}
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => fetchPatients(prevPage, activeFilter)}
                      disabled={!prevPage}
                      className="bg-gray-300 hover:bg-gray-400 px-4 py-1 rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => fetchPatients(nextPage, activeFilter)}
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
      </div>
    </Navigation>
  );
}
