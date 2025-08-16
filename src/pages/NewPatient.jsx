import React, { useEffect, useState } from "react";
import axiosInstance from "../services/apiService";
import Navigation from "../pages/admin/Navigation";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, EllipsisVertical, User } from "lucide-react";
import "react-date-range/dist/styles.css"; // main css
import "react-date-range/dist/theme/default.css"; // theme css
import { formatDate } from "../utils/format_date";
import PatientDashboardModal from "./patient/components/PatientModal";
import PrimaryLoader from "../components/PrimaryLoader";
import UniversalTopBar from "../components/UniversalTopBar";
import { API_BASE_URL, PATIENT_ENDPOINT } from "../config/apiConfig";
import { PATIENT_FILTER_OPTIONS as FILTER_OPTIONS } from "../constants";
import FilterTopBar from "../components/FilterTopBar";
import Pagination from "../components/Pagination";
import DateRangeModal from "../components/DateRangeModal";
import EHRSync from "./patient/components/EhrSyncModal";
import ModalWrapper from "../components/ModalWrapper";

const API_URL = API_BASE_URL + PATIENT_ENDPOINT;

export default function NewPatient() {
  const [patients, setPatients] = useState([]);
  const abortControllerRef = React.useRef(null);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const [debounceTimer, setDebounceTimer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [isDateFilterActive, setIsDateFilterActive] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [dropdownPatientId, setDropdownPatientId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientData, setPatientData] = useState(null);

  const [isEhrSyncOpen, setIsEhrSyncOpen] = useState(false);

  const [showDateRange, setShowDateRange] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: startDate,
      endDate: endDate,
      key: "selection",
    },
  ]);

  const [filterOptions, setFilterOptions] = useState(FILTER_OPTIONS);
  const [activeFilter, setActiveFilter] = useState("all");

  const navigate = useNavigate();

  const columns = [
    // { key: "full_name", label: "Patient Name", render: (p) => p.full_name.slice(0, 10) + "..." },
    { key: "full_name", label: "Patient Name", render: (p) => p.full_name },
    { key: "id", label: "ID" },
    {
      key: "date_of_birth",
      label: "DOB",
      render: (p) => {
        const date = new Date(p.date_of_birth);
        return formatDate(p.date_of_birth);
      },
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
            {/* <User size={24} /> */}
            {p.full_name?.slice(0, 1)}
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
          className={`px-2 py-1 rounded-full text-xs ${
            p.is_active
              ? "bg-[#d4f8df] text-green-800"
              : "bg-[#fde4e4] text-red-800"
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
          className={`px-2 py-1 rounded-full text-xs ${
            p.concent_given
              ? "bg-[#d4f8df] text-green-800"
              : "bg-[#fde4e4] text-red-800"
          }`}
        >
          {p.concent_given ? "Given" : "Not Given"}
        </span>
      ),
    },
    {
      key: "created_date",
      label: "Created At",
      render: (p) => formatDate(p.created_date),
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
            <button
              className=""
              onClick={() => {
                fetchPatientDetails(p.id);
                setIsModalOpen(true);
              }}
            >
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
      },
    },
  ];

  const fetchPatients = async () => {
    setLoading(true);

    // Abort any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const params = new URLSearchParams();
      if (activeFilter === "active") params.append("is_active", "true");
      if (activeFilter === "inactive") params.append("is_active", "false");
      params.append("page", currentPage);
      if (startDate) {
        params.append("start_date", startDate);
        params.append("end_date", endDate);
      }
      if (debouncedSearchTerm) {
        params.append("search", debouncedSearchTerm);
      }

      const res = await axiosInstance.get(`${API_URL}?${params.toString()}`, {
        signal: abortControllerRef.current.signal, // attach abort signal
      });

      setPatients(res.data.results);
      setPageCount(Math.ceil(res.data.count / 10));
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
        console.log("⚠️ Request canceled");
      } else {
        console.error(
          "❌ Failed to fetch patients:",
          err.response?.data || err.message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ ONE useEffect to rule them all
  useEffect(() => {
    fetchPatients();
  }, [debouncedSearchTerm, activeFilter, startDate, endDate, currentPage]);

  // --- Handlers now only update state ---
  const handlePageChange = (page) => setCurrentPage(page);

  const handleEdit = (id) => {
    navigate(`/patients/editpatient/${id}`);
  };

  const handleDelete = (id) => {
    console.log("delete patient", id);

    // delete patient api call

    // close dropdown
    setDropdownPatientId(null);
  };

  const handleAddPatient = () => {
    navigate("/patients/addpatient");
  };

  const fetchPatientDetails = async (id) => {
    try {
      const res = await axiosInstance.get(`${API_URL}summary/${id}`);
      setPatientData(res.data);
      // console.log(res.data);
    } catch (err) {
      console.error(
        "❌ Failed to fetch patient details:",
        err.response?.data || err.message
      );
    }
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setFilterOptions((prev) =>
      prev.map((option) => ({ ...option, isActive: option.id === filterId }))
    );
    setCurrentPage(1); // reset page
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => setDebouncedSearchTerm(value), 400);
    setDebounceTimer(timer);
  };

  const handleReset = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setStartDate(null);
    setEndDate(null);
    setActiveFilter("all");
    setFilterOptions(FILTER_OPTIONS);
    setCurrentPage(1);
  };

  const handleDateSelect = () => {
    setShowDateRange(!showDateRange);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Delay to let dropdown render before checking click
      setTimeout(() => {
        if (
          !e.target.closest(".dropdown-menu") &&
          !e.target.closest(".dropdown-trigger")
        ) {
          setDropdownPatientId(null);
        }
      }, 0);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.trim().length > 0) {
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
      <div className="h-full flex flex-col p-2">
        <UniversalTopBar defaultTitle="Therapy Patient" />
        {/* <div className="flex w-full bg-white/30 rounded-t-[1.875rem] pt-2 px-2 h-16"> */}
        <FilterTopBar
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          startDate={startDate}
          endDate={endDate}
          onDateSelect={handleDateSelect}
          onAddClick={handleAddPatient}
          addButtonText="Add New Patient"
          searchPlaceholder="Search..."
          handleReset={handleReset}
          children={
            <>
              <button
                onClick={() => setIsEhrSyncOpen(true)}
                className="rounded-full md:px-6 px-3 lg:py-[0.75rem] md:py-[0.5rem] py-[0.35rem] gap-[0.625rem] text-[0.525rem] md:text-[0.625rem] lg:text-[0.875rem] leading-[1.25rem] font-medium font-inter text-center box-border flex flex-row justify-center items-center bg-gradient-to-r from-[#574EB6] to-[#7367F0] hover:from-[#352F6E] hover:to-[#352F6E] border border-white shadow-[0.125rem_0.1875rem_0.5rem_rgba(100,90,209,0.5)] text-white hover:shadow-[0px_0.1875rem_0.5rem_rgba(100,90,209,0.5)] text-nowrap"
              >
                Ehr Sync
              </button>
            </>
          }
        />
        {/* </div> */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-white/10">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <PrimaryLoader />
            </div>
          ) : (
            <table className="min-w-full border-separate border-spacing-y-2 px-2 no-scrollbar overflow-y-auto">
              <thead className="bg-white/35">
                <tr className="sticky top-2 z-[60] bg-[#C7C2F9] rounded-[2.625rem] h-[3.125rem] px-[2rem] py-[1rem] text-[#181D27] text-[0.75rem] leading-[18px] font-medium">
                  {columns.map((col, i) => (
                    <th
                      key={col.key}
                      className={`text-left px-3 py-2 ${
                        i === 0 ? "rounded-l-[2.625rem]" : ""
                      } ${
                        i === columns.length - 1 ? "rounded-r-[2.625rem]" : ""
                      }
                         ${col.key === "full_name" ? "px-8" : ""}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="overflow-y-auto h-full w-full">
                {Array.isArray(patients) && patients.length > 0 ? (
                  <>
                    {patients.map((row, rowIndex) => (
                      <tr
                        key={row.id || rowIndex}
                        className="bg-white/90 backdrop-blur-[2.5px] rounded-[2.625rem] h-[3.5rem] max-h-16 px-[2rem] py-[0.8rem] text-[#181D27] text-[0.75rem] leading-[18px] font-medium transition hover:bg-[#E3E1FC]"
                      >
                        {columns.map((col, i) => (
                          <td
                            key={col.key}
                            className={`px-3 py-2 ${
                              i === 0 ? "rounded-l-[2.625rem]" : ""
                            } ${
                              i === columns.length - 1
                                ? "rounded-r-[2.625rem]"
                                : ""
                            }
                             ${col.key === "full_name" ? "pl-8" : ""}
                              ${
                                col.key === "concent_given"
                                  ? "text-nowrap text-center"
                                  : ""
                              }
                             `}
                          >
                            {typeof col.render === "function"
                              ? col.render(row)
                              : row[col.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center">
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="h-16 flex-shrink-0  z-10 bg-white/10 rounded-b-[1.875rem]">
          <div className="p-2 w-full flex h-full">
            <div className="w-full h-full bg-white/10 rounded-[1.875rem] flex justify-between items-center gap-2">
              {/* Pagination Controls */}
              {pageCount > 0 ? (
                <Pagination
                  pageCount={pageCount}
                  currentPage={currentPage}
                  handlePageChange={handlePageChange}
                />
              ) : (
                <div className="flex justify-center items-center w-full gap-2">
                  {Array.isArray(patients) && patients.length > 0 ? (
                    <PrimaryLoader />
                  ) : (
                    <p className="text-gray-500">No page found</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen &&
        (patientData ? (
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
        ))}

      {showDateRange && (
        <DateRangeModal
          show={showDateRange}
          onClose={() => setShowDateRange(false)}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onApply={(start, end) => {
            setStartDate(start);
            setEndDate(end);
            fetchPatients(API_URL, activeFilter, 1);
          }}
        />
      )}

      {dropdownPatientId && (
        <div
          className="dropdown-menu absolute bg-white z-[9999] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left - 150}px`, //adjust left based on width
            width: "160px",
          }}
        >
          <button
            onClick={() => handleEdit(dropdownPatientId)}
            className="w-full flex items-center gap-2 px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            onClick={() => handleDelete(dropdownPatientId)}
            className="w-full flex items-center gap-2 px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}

      {isEhrSyncOpen && (
        <>
          <ModalWrapper
            isOpen={isEhrSyncOpen}
            onClose={() => setIsEhrSyncOpen(false)}
            Header={<h1>EHR Sync</h1>}
            children={<EHRSync onClose={() => setIsEhrSyncOpen(false)} />}
          />
          <div className="absolute inset-0 backdrop-blur-2xl bg-white/20 w-full h-full z-[70]" />
        </>
      )}
    </Navigation>
  );
}
