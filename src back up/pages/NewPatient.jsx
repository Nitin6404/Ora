import React, { useEffect, useState } from "react";
import axiosInstance from "../services/apiService";
import Navigation from "../pages/admin/Navigation";
import PatientTopBar from "../components/PatientTopBar";
import { useNavigate } from "react-router-dom";
import {Edit2, Plus, Calendar, EllipsisVertical,User, RotateCcw} from "lucide-react";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css
import 'react-date-range/dist/theme/default.css'; // theme css
import DataTable from "../components/DataTable";
import { formatDate } from "../utils/format_date";
import PatientDashboardModal from "./patient/components/PatientModal";
import PrimaryLoader from "../components/PrimaryLoader";
import PrimarySearchInput from "../components/PrimarySearchInput";
import FilterButtons from "../components/FilterButtons";
import UniversalTopBar from "../components/UniversalTopBar";
import { API_BASE_URL, PATIENT_ENDPOINT } from "../config/apiConfig";
import { PATIENT_FILTER_OPTIONS as FILTER_OPTIONS } from "../constants"

const API_URL = API_BASE_URL + PATIENT_ENDPOINT;

export default function NewPatient() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [isDateFilterActive, setIsDateFilterActive] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [dropdownPatientId, setDropdownPatientId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientData, setPatientData] = useState(null);


  const [showDateRange, setShowDateRange] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: startDate,
      endDate: endDate,
      key: 'selection'
    }
  ]);

  const [filterOptions, setFilterOptions] = useState(FILTER_OPTIONS);
  const [activeFilter, setActiveFilter] = useState('all');

  const navigate = useNavigate();

  const columns = [
    // { key: "full_name", label: "Patient Name", render: (p) => p.full_name.slice(0, 10) + "..." },
    { key: "full_name", label: "Patient Name", render: (p) => p.full_name },
    { key: "id", label: "ID" },
    {
      key: "date_of_birth", label: "DOB", render: (p) => {
        const date = new Date(p.date_of_birth);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      }
    },
    {
      key: "profile_image_url",
      label: "Image",
      render: (p) =>
        p.profile_image_url ? (
          <img
            src={p.profile_image_url}
            className="w-[32px] h-[32px] object-cover rounded-full"
          />
        ) : (
          <div className="w-[32px] h-[32px] bg-gray-200 rounded-full flex items-center justify-center">
            <User size={24} />
          </div>
        ),
    },
    {
      key: "email",
      label: "Email",
      render: (p) => p.email,
    },
    { key: "phone_no", label: "Phone" },
    { key: "qrcode", label: "QR Code" },
    {
      key: "is_active",
      label: "Status",
      render: (p) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${p.is_active ? "bg-[#d4f8df] text-green-800" : "bg-[#fde4e4] text-red-800"
            }`}
        >
          {p.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "concent_given",
      label: "Consent",
      render: (p) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${p.concent_given ? "bg-[#d4f8df] text-green-800" : "bg-[#fde4e4] text-red-800"
            }`}
        >
          {p.concent_given ? "Given" : "Not Given"}
        </span>
      ),
    },
    {
      key: "created_date",
      label: "Created At",
      render: (p) => new Date(p.created_date).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (p) => {
        const handleClick = (e) => {
          if (dropdownPatientId === p.id) {
            setDropdownPatientId(null);
            return;
          }

          const rect = e.currentTarget.getBoundingClientRect();
          setDropdownPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
          });

          setDropdownPatientId(p.id);
        };

        return (
          <div className="relative">
            <button className=""
              onClick={() => {
                fetchPatientDetails(p.id);
                setIsModalOpen(true)
              }}>
              <img src="/tilde-icon.png" alt="" />
            </button>
            <button
              onClick={handleClick}
              className="text-gray-500 hover:text-gray-700 dropdown-trigger"
            >
              <EllipsisVertical size={18} />
            </button>
          </div>
        );
      }
    }
  ];

  const fetchPatients = async (url = API_URL, filter = activeFilter, page = 1) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found");
      return;
    }

    try {

      let fullUrl = url;

      // if (url === API_URL) {
        const params = new URLSearchParams();
        if (filter === "active") params.append("is_active", "true");
        if (filter === "inactive") params.append("is_active", "false");
        params.append("page", page);
        if (startDate) {
          params.append("start_date", startDate);
          params.append("end_date", endDate);
        }
        if (debouncedSearchTerm) {
          console.log("search", debouncedSearchTerm)
          params.append("search", debouncedSearchTerm);  
        };
        fullUrl = `${API_URL}?${params.toString()}`;
      // }
      // params.append("page", page);

      const res = await axiosInstance.get(fullUrl, {
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchPatients(API_URL, activeFilter, page);
  };

  const handleEdit = (id) => {
    console.log("✏️ Edit patient ID:", id);
    navigate(`/patients/editpatient/${id}`);
  };

  const handleAddPatient = () => {
    console.log("➕ Add New Patient clicked");
    navigate("/patients/addpatient");
  };

  const fetchPatientDetails = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found");
      return;
    }
    try {
      const res = await axiosInstance.get(`${API_URL}/summary/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatientData(res.data);
      // console.log(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch patient details:", err.response?.data || err.message);
    }
  }

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

  const handleResetFilter = () => {
    // reload whole page
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Delay to let dropdown render before checking click
      setTimeout(() => {
        if (!e.target.closest(".dropdown-menu") && !e.target.closest(".dropdown-trigger")) {
          setDropdownPatientId(null);
        }
      }, 0);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400); // debounce delay

    return () => clearTimeout(timer); // cancel previous timer
  }, [searchTerm]);


  useEffect(() => {
    if (debouncedSearchTerm.trim().length > 0) {
      console.log(activeFilter)
      fetchPatients(API_URL, activeFilter, 1);
    } else {
      fetchPatients(API_URL, activeFilter, 1);
    }
  }, [debouncedSearchTerm, startDate, endDate]);

  useEffect(() => {
    fetchPatients(API_URL, activeFilter, currentPage);
  }, []);

  return (
    <Navigation>
      <div className="flex flex-col h-full font-inter no-scrollbar">
        <div className="sticky top-0 z-[100] p-2 md:px-6 md:py-0 backdrop-blur-sm md:ml-4 overflow-y-hidden h-full">
          <UniversalTopBar defaultTitle="Therapy Patient"/>
          <div className="py-0 h-[88%]">
            <div className="flex flex-col gap-0 h-full">

              {/* FILTER + SEARCH + ADD as TABLE */}
              <div className="w-full backdrop-blur-sm bg-white/10 rounded-t-[30px] px-3 pt-2">
                <div className="bg-white p-1 rounded-[30px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                  {/* Filter Buttons */}
                  <FilterButtons filterOptions={filterOptions} handleFilterChange={handleFilterChange} />

                  {/* Date Picker & Add Button */}
                  <div className="flex flex-wrap gap-2 items-center justify-end">
                    <PrimarySearchInput
                      showSearchInput={showSearchInput}
                      setShowSearchInput={setShowSearchInput}
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                    />

                    <div className="relative">
                      <button
                        onClick={() => {
                          setIsDateFilterActive(true);
                          setShowDateRange(!showDateRange)
                        }}
                        className={`px-4 py-2 rounded-full text-base font-inter text-[#181D27] hover:text-[#7367F0] transition
                          ${isDateFilterActive ? "bg-[#C7C2F9]" : ""}
                          `}
                      >
                        <Calendar className="inline-block mr-2" size={16} />
                        {
                          startDate && endDate ? (
                            <span className="">
                              {formatDate(startDate)} - {formatDate(endDate)}
                            </span>
                          ) : (
                            <span className="">MM-DD-YYYY</span>
                          )
                        }
                      </button>
                    </div>
                    <button
                      onClick={handleResetFilter}
                      className="p-2 rounded-full bg-[#f4f3ff] text-[#7367F0] hover:bg-[#e4e3fc] transition shadow-sm border border-[#e0ddff] flex items-center justify-center"
                      title="Reset Filters"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      onClick={handleAddPatient}
                      className={`rounded-[24px]  px-6 py-[11px] gap-[10px] text-[14px] leading-[20px] font-medium font-inter text-center box-border flex flex-row justify-center items-center  bg-gradient-to-r from-[#574EB6] hover:from-[#352F6E] to-[#7367F0] hover:to-[#352F6E] border border-white shadow-[2px_3px_8px_rgba(100,90,209,0.5)]  text-white  hover:shadow-[0px_3px_8px_rgba(100,90,209,0.5)] hover:bg-[#352F6E] `}
                    >
                      <Plus size={16} />
                      New Patient
                    </button>
                  </div>

                </div>
              </div>

              <DataTable
                columns={columns}
                data={patients}
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
      {showDateRange && (
        <div className="absolute top-32 right-56 !z-[9999] mt-2 bg-white rounded-md shadow p-3 !overflow-y-visible">
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            className="w-full h-full !overflow-y-visible !z-20"
          />

          <button
            className="mt-2 px-3 py-1 text-sm bg-[#7165f0] text-white rounded-full hover:bg-[#5e55d9] !z-[9999] !block"
            onClick={() => {
              const formatDate = (date, time) => {
                const pad = (n) => n.toString().padStart(2, '0');
                const mm = pad(date.getMonth() + 1);
                const dd = pad(date.getDate());
                const yyyy = date.getFullYear();
                return `${mm}/${dd}/${yyyy} ${time}`;
              };

              setStartDate(formatDate(dateRange[0].startDate, "00:00"));
              setEndDate(formatDate(dateRange[0].endDate, "23:59"));
              setShowDateRange(false);

              // Only fetch after user confirms
              fetchPatients(API_URL, activeFilter, 1);
            }}
          >
            Apply Filter
          </button>
        </div>
      )}
      {dropdownPatientId && (
        <div
          className="dropdown-menu absolute bg-white z-[9999] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left - 150}px`, // adjust left based on width
            width: "160px"
          }}
        >
          <button
            onClick={() => handleEdit(dropdownPatientId)}
            className="w-full flex items-center gap-2 px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
          >
            <Edit2 size={16} />
            Edit
          </button>
        </div>
      )}

      {isModalOpen && (
        patientData ? (
          <>
            <PatientDashboardModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setPatientData(null);
              }}
              patientData={patientData}
            />
            <div className="absolute inset-0 backdrop-blur-2xl bg-white/20 w-full h-full z-[70]" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-2xl bg-white/20 w-full h-full z-[100]">
            <PrimaryLoader />
          </div>
        )
      )}

    </Navigation>
  );
}
