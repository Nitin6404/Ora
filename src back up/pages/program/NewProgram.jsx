import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/apiService";
import Navigation from '../admin/Navigation';
import { useNavigate } from "react-router-dom";
import {
  Plus, Calendar,
  Loader2,
  RotateCcw
} from "lucide-react";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css
import 'react-date-range/dist/theme/default.css'; // theme css
import ProgramCard from "../../components/ProgramCard";
import { formatDate } from "../../utils/format_date";
import ProgramTopBar from "./components/ProgramTopBar";
import ProgramModal from "./components/ProgramModal";
import PrimaryLoader from "../../components/PrimaryLoader";
import Pagination from "../../components/Pagination";
import FilterButtons from "../../components/FilterButtons";
import PrimarySearchInput from "../../components/PrimarySearchInput";

const FILTER_OPTIONS = [
  { id: 'all', label: 'All', isActive: true },
  { id: 'published', label: 'Published', isActive: false },
  { id: 'draft', label: 'Draft', isActive: false }
];

export default function NewProgram() {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState(FILTER_OPTIONS);

  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [isDateFilterActive, setIsDateFilterActive] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programData, setProgramData] = useState(null);

  const [dateRange, setDateRange] = useState([
    {
      startDate: startDate,
      endDate: endDate,
      key: 'selection'
    }
  ]);

  const [openMenuId, setOpenMenuId] = useState(null);

  const API_URL =
    "https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/dev/api/program/programs";


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400); // debounce delay

    return () => clearTimeout(timer); // cancel previous timer
  }, [searchTerm]);


  useEffect(() => {
    if (debouncedSearchTerm.trim().length > 0) {
      fetchPrograms(`${API_URL}?search=${debouncedSearchTerm}`, activeFilter, 1);
    } else {
      fetchPrograms(API_URL, activeFilter, 1);
    }
  }, [debouncedSearchTerm, startDate, endDate]);


  // Fetch programs from API
  const fetchPrograms = async (url = API_URL, filter = activeFilter, page = 1) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No token found");
      setLoading(false);
      return;
    }

    // Build query params
    const params = new URLSearchParams();
    params.append("page", page);
    if (filter !== 'all') params.append("status", filter);
    if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
    if (startDate && endDate) {
      params.append("start_date", startDate);
      params.append("end_date", endDate);
    }

    try {
      const res = await axiosInstance.get(`${API_URL}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPrograms(res.data.results);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
      setPageCount(Math.ceil(res.data.count / 10));
      setCurrentPage(page);
    } catch (err) {
      console.error("❌ Failed to fetch programs:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPrograms();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchPrograms(API_URL, activeFilter, page);
  };

  // Handlers for dropdown
  const handleView = (id) => {
    console.log("👁️ View program ID:", id);
    navigate(`/programs/programview/${id}`);
  };

  const handleEdit = (id) => {
    console.log("✏️ Edit program ID:", id);
    navigate(`/programs/editprogram/${id}`);
  };

  const handleDelete = (id) => {
    console.log("🗑️ Delete program ID:", id);
  };

  const handleAddProgram = () => {
    console.log("➕ Add New Program clicked");
    navigate("/programs/addprogram");
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setFilterOptions(prev =>
      prev.map(option => ({
        ...option,
        isActive: option.id === filterId,
      }))
    );
    fetchPrograms(API_URL, filterId, 1);
  };

  const handleResetFilter = () => {
    // reload whole page
    window.location.reload();
  };

  const fetchProgramDetails = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found");
        return;
      }
      const res = await axiosInstance.get(`https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/dev/api/program/details/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProgramData(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch program details:", err.response?.data || err.message);
    }
  };

  return (

    <Navigation>
      <div className="flex flex-col h-screen font-inter no-scrollbar">
        <div className="sticky top-0 z-[70] p-2 md:px-6 md:py-0 backdrop-blur-sm md:ml-4 overflow-hidden h-screen">
          <ProgramTopBar />

          <div className="py-0 h-[88%]">
            <div className="flex flex-col gap-0 h-full">
              {/* FILTER + SEARCH + ADD as TABLE */}
              <div className="w-full backdrop-blur-sm bg-white/10 rounded-t-[1.8rem] px-3 pt-2">
                <div className="bg-white p-3 lg:p-1 rounded-[1.8rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">

                  <FilterButtons
                    filterOptions={filterOptions}
                    handleFilterChange={handleFilterChange}
                  />

                  {/* Date Picker & Add Button */}
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-start sm:items-center justify-end w-full sm:w-auto">

                    <PrimarySearchInput
                      showSearchInput={showSearchInput}
                      setShowSearchInput={setShowSearchInput}
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                    />

                    <div className="flex items-center gap-[0.5em]">
                      <div className="relative">
                        <button
                          onClick={() => {
                            setIsDateFilterActive(true);
                            setShowDateRange(!showDateRange)
                          }}
                          className={`w-full sm:w-auto px-4 py-2 rounded-full text-base font-inter text-[#181D27] hover:text-[#7367F0] transition flex items-center ${isDateFilterActive ? "bg-[#C7C2F9]" : ""}`}

                        >
                          <Calendar className="inline-block mr-2" size={16} />
                          <span className="text-sm font-inter">{
                            startDate && endDate ? (
                              <span className="">
                                {formatDate(startDate)} - {formatDate(endDate)}
                              </span>
                            ) : (
                              <span className="">MM-DD-YYYY</span>
                            )
                          }</span>
                        </button>
                      </div>
                      <button
                        onClick={handleResetFilter}
                        className="p-2 rounded-full bg-[#f4f3ff] text-[#7367F0] hover:bg-[#e4e3fc] transition shadow-sm border border-[#e0ddff] flex items-center justify-center"
                        title="Reset Filters"
                      >
                        <RotateCcw size={16} />
                      </button>
                    </div>
                    <button
                      onClick={handleAddProgram}
                      className={`rounded-[1.5rem]  px-6 py-[0.68rem] gap-[0.6rem] text-[0.87rem] leading-[1.25rem] font-medium font-inter text-center box-border flex flex-row justify-center items-center  bg-gradient-to-r from-[#574EB6] hover:from-[#352F6E] to-[#7367F0] hover:to-[#352F6E] border border-white shadow-[2px_3px_8px_rgba(100,90,209,0.5)]  text-white  hover:shadow-[0px_3px_8px_rgba(100,90,209,0.5)] hover:bg-[#352F6E] `}

                    >
                      <Plus size={16} />
                      Add New Program
                    </button>
                  </div>

                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/10 flex-1 overflow-hidden w-full">
                <div className="h-full w-full overflow-y-auto px-4 py-4 grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-2 no-scrollbar">
                  {loading ? (
                    <div className="flex justify-center items-center py-10 w-full col-span-4">
                      <PrimaryLoader />
                    </div>
                  ) : (
                    Array.isArray(programs) && programs.length > 0 ? (
                      programs.map((program, index) => (
                        <ProgramCard key={index} program={program} onClick={(id) => {
                          fetchProgramDetails(id);
                          setIsModalOpen(true)
                        }} />
                      ))
                    ) : (
                      <div className="flex justify-center items-center py-10 w-full col-span-4">
                        <p className="text-gray-600">No programs found</p>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="w-full rounded-b-[1.5rem] backdrop-blur-sm bg-white/10 py-2 no-scrollbar flex justify-center items-center">
                <div className="w-full flex px-2">
                  <div className="py-2 w-full bg-white/35 rounded-[1.5rem] flex justify-between items-center gap-2">
                    {/* Pagination Controls */}
                    {pageCount > 1 ? (
                      <Pagination
                        currentPage={currentPage}
                        pageCount={pageCount}
                        handlePageChange={handlePageChange}
                      />
                    ) : (
                      <div className="flex justify-center items-center w-full gap-2">
                        <PrimaryLoader />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDateRange && (
        <div className="absolute top-32 md:right-56 !z-[70] mt-2 bg-white rounded-md shadow p-3 !overflow-y-visible">
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            className="w-full h-full !overflow-y-visible !z-20"
          />

          <button
            className="mt-2 px-3 py-1 text-sm bg-[#7165f0] text-white rounded-full hover:bg-[#5e55d9] !z-[70] !block"
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
              fetchPrograms(API_URL, activeFilter, 1);
            }}
          >
            Apply Filter
          </button>
        </div>
      )}

      {isModalOpen && (
        programData ? (
          <>
            <ProgramModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false)
                setProgramData(null);
              }}
              programData={programData || {}}
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
