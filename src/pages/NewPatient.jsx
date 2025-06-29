import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Navigation from "../pages/admin/Navigation";
import PatientTopBar from "../components/PatientTopBar";
import { useNavigate } from "react-router-dom";
import {
  Eye, Edit2, Trash2, Plus, Search, Calendar, EllipsisVertical,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FILTER_OPTIONS = [
  { id: 'all', label: 'All', isActive: true },
  { id: 'active', label: 'Active', isActive: false },
  { id: 'inactive', label: 'Inactive', isActive: false }
];

const API_URL =
  "https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/dev/api/patient/patients";

export default function NewPatient() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [filterDate, setFilterDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const calendarRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400); // debounce delay

    return () => clearTimeout(timer); // cancel previous timer
  }, [searchTerm]);


  useEffect(() => {
    if (debouncedSearchTerm.trim().length > 0) {
      fetchPatients(`${API_URL}?search=${debouncedSearchTerm}`, activeFilter, 1);
    } else {
      fetchPatients(API_URL, activeFilter, 1);
    }
  }, [debouncedSearchTerm, startDate]);


  const [filterOptions, setFilterOptions] = useState(FILTER_OPTIONS);
  const [activeFilter, setActiveFilter] = useState('all');

  const navigate = useNavigate();

  const fetchPatients = async (url = API_URL, filter = activeFilter, page = 1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found");
      return;
    }

    try {
      setLoading(true);

      let fullUrl = url;

      if (url === API_URL) {
        const params = new URLSearchParams();
        if (filter === "active") params.append("is_active", "true");
        if (filter === "inactive") params.append("is_active", "false");
        params.append("page", page);
        if (startDate) {
          params.append("start_date", startDate);
          params.append("end_date", endDate);
        }
        fullUrl = `${API_URL}?${params.toString()}`;
      }
      // params.append("page", page);

      const res = await axios.get(fullUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPatients(res.data.results);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
      setPageCount(Math.ceil(res.data.count / 10));
      setCurrentPage(page);
    } catch (err) {
      console.error("❌ Failed to fetch patients:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPatients(API_URL, activeFilter, currentPage);
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
    fetchPatients(API_URL, filterId, 1);
  };

  return (
    <Navigation>
      <div className="flex flex-col min-h-screen font-inter no-scrollbar">
        <div className="sticky top-0 z-[999] p-2 md:px-6 md:py-0 backdrop-blur-sm md:ml-4 overflow-y-hidden">
          <PatientTopBar />
          <div className="py-0 ">
            <div className="flex flex-col gap-0 ">

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
                    <div className="relative flex items-center">
                      <AnimatePresence>
                        {showSearchInput && (
                          <motion.input
                            key="search-input"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 180, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="
                              px-3 py-2
                              rounded-[30px] border border-[#e6e6e6]
                              bg-white text-[#333] text-[14px] font-sans
                              transition-all duration-300
                              hover:border-[#a99ef9]
                              focus:border-[#7367f0]
                              focus:[box-shadow:0_0_0_1px_#7367f0]
                              outline-none
                              absolute right-0"
                          />
                        )}
                      </AnimatePresence>

                      <Search
                        onClick={() => setShowSearchInput(!showSearchInput)}
                        className="absolute right-3 w-[34px] h-[34px] rounded-full p-2 text-gray-600 hover:bg-purple-300 cursor-pointer"
                      />
                    </div>

                    <div
                      onClick={() => calendarRef.current?.click()}
                      className="relative hover:bg-[#c7c3f6] rounded-full hover:cursor-pointer w-fit"
                    >
                      {/* <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" /> */}
                      <input
                        ref={calendarRef}
                        type="date"
                        value={filterDate}
                        onChange={(e) => {
                          const selectedDate = new Date(e.target.value);
                          
                          const formatDate = (date, time) => {
                            const pad = (n) => n.toString().padStart(2, '0');
                            const mm = pad(date.getMonth() + 1);
                            const dd = pad(date.getDate());
                            const yyyy = date.getFullYear();
                            return `${mm}/${dd}/${yyyy} ${time}`;
                          };
                          setFilterDate(e.target.value);
                          setStartDate(formatDate(selectedDate, "00:00"));
                          setEndDate(formatDate(new Date(), "23:59"));
                        }}
                        
                        className="px-3 py-2 font-medium 
                              rounded-[30px] border-none
                              bg-transparent text-[#333] text-[14px] font-sans
                              transition-all duration-300
                              hover:border-[#a99ef9]
                              focus:border-[#7367f0]
                              hover:cursor-pointer
                              focus:[box-shadow:0_0_0_1px_#7367f0]
                              outline-none"
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
                <div className="flex justify-center items-center py-10">
                  <svg className="animate-spin h-8 w-8 text-[#7367F0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span className="ml-3 text-[#7367F0] text-base font-medium"></span>
                </div>
              ) : (
                <>
                  <div className="relative overflow-hidden bg-transparent ">
                    <div className="relative overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)] no-scrollbar">
                      <table className="min-w-full border-separate border-spacing-y-2 bg-[#ebeafd]/40 px-2 no-scrollbar">
                        <thead>
                          <tr className={`rounded-[30px] transition-colors bg-[#c7c2fa] `}>
                            <th className="px-3 py-4 text-xs lg:text-sm text-left rounded-l-[30px] font-medium">Pateint Name</th>
                            <th className="px-3 py-4 text-xs lg:text-sm text-left font-medium">ID</th>
                            <th className="px-3 py-4 text-xs lg:text-sm text-left font-medium">DOB</th>
                            <th className="px-3 py-4 text-xs lg:text-sm text-left font-medium">Image</th>
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
                              <td className="px-3 py-4 text-xs lg:text-sm rounded-l-[30px]">{patient.full_name.slice(0, 10) + "..."}</td>
                              <td className="px-3 py-4 text-xs lg:text-sm">{patient.id}</td>
                              <td className="px-3 py-4 text-xs lg:text-sm">{patient.date_of_birth}</td>
                              <td className="px-3 py-4 text-xs lg:text-sm">
                                {patient.profile_image_url ? (
                                  <img
                                    src={patient.profile_image_url}
                                    alt="Patient Image"
                                    className="w-12 h-12 object-cover rounded-full"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User size={24} />
                                  </div>
                                )}
                              </td>
                              <td className="px-3 py-4 text-xs lg:text-sm">{(patient.email).slice(0, 5) + "..."}</td>
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
                                    <EllipsisVertical size={18} />
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

                </>
              )}

              {/* Bottom Pagination */}
              {pageCount &&
                <div className="w-full rounded-b-[30px] bg-[#ebeffafd]/40 px-2 py-2 no-scrollbar flex justify-center items-center">
                  {/* <tfoot className="w-full"> */}
                  {/* <tr className="border border-red-500 w-full"> */}
                  <td
                    colSpan="100%"
                    className="w-full px-3 py-2 bg-[#fff]/35 rounded-[30px] text-center"
                  >
                    <div className="w-full inline-flex flex-wrap justify-center items-center gap-3 text-sm font-medium text-gray-800">
                      <button
                        className="p-2 rounded-full bg-[#fff] disabled:cursor-not-allowed"
                        disabled={currentPage === 1}
                        onClick={() => fetchPatients(API_URL, activeFilter, 1)}
                      >
                        <ChevronsLeft size={18} />
                      </button>

                      <button
                        className="p-2 rounded-full bg-[#fff] disabled:cursor-not-allowed"
                        disabled={currentPage === 1}
                        onClick={() => fetchPatients(API_URL, activeFilter, currentPage - 1)}
                      >
                        <ChevronLeft size={18} />
                      </button>


                      {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          className={`w-8 h-8 rounded-full ${page === currentPage
                            ? "bg-[#7165f0] text-white"
                            : "bg-white text-gray-700"
                            }`}
                          onClick={() => fetchPatients(API_URL, activeFilter, page)}
                        >
                          {page}
                        </button>
                      ))}


                      <button
                        className="p-2 rounded-full bg-[#fff] disabled:cursor-not-allowed"
                        disabled={currentPage === pageCount}
                        onClick={() => fetchPatients(API_URL, activeFilter, currentPage + 1)}
                      >
                        <ChevronRight size={18} />
                      </button>

                      <button
                        className="p-2 rounded-full bg-[#fff] disabled:cursor-not-allowed"
                        disabled={currentPage === pageCount}
                        onClick={() => fetchPatients(API_URL, activeFilter, pageCount)}
                      >
                        <ChevronsRight size={18} />
                      </button>

                    </div>
                  </td>
                  {/* </tr> */}
                  {/* </tfoot> */}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </Navigation>
  );
}
