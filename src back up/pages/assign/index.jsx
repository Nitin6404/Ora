import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/apiService";
import Navigation from '../admin/Navigation';
import { useNavigate } from "react-router-dom";
import { Plus, Calendar, RotateCcw } from "lucide-react";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css
import 'react-date-range/dist/theme/default.css'; // theme css
import AssignCard from "./components/AssignCard";
import { formatDate } from "../../utils/format_date";
import UniversalTopBar from "../../components/UniversalTopBar";
import PrimaryLoader from "../../components/PrimaryLoader";
import PrimarySearchInput from "../../components/PrimarySearchInput";
import Pagination from "./components/Pagination";
import FilterButtons from "../../components/FilterButtons";
import { ASSIGNMENT_FILTER_OPTIONS } from "../../constants";
import { API_BASE_URL as API_URL, ASSIGNMENT_ENDPOINT } from "../../config/apiConfig";

export default function Assign() {
  const [assign, setAssign] = useState([]);
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState(ASSIGNMENT_FILTER_OPTIONS);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: startDate,
      endDate: endDate,
      key: 'selection'
    }
  ]);

  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400); // debounce delay

    return () => clearTimeout(timer); // cancel previous timer
  }, [searchTerm]);


  useEffect(() => {
    if (debouncedSearchTerm.trim().length > 0) {
      fetchassign(`${API_URL}?search=${debouncedSearchTerm}`, activeFilter, 1);
    } else {
      fetchassign(API_URL, activeFilter, 1);
    }
  }, [debouncedSearchTerm, startDate, endDate]);


  // Fetch assign from API
  const fetchassign = async (url = API_URL, filter = activeFilter, page = 1) => {
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
    if (filter !== 'All') params.append("status", filter);
    if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
    params.append("page_size", 12);
    if (startDate && endDate) {
      params.append("start_date", startDate);
      params.append("end_date", endDate);
    }

    try {
      const res = await axiosInstance.get(`${API_URL}${ASSIGNMENT_ENDPOINT}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAssign(res.data.results);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
      setPageCount(Math.ceil(res.data.count / 12));
      setCurrentPage(page);
    } catch (err) {
      console.error("❌ Failed to fetch assign:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchassign();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchassign(API_URL, activeFilter, page);
  };

  const handleAddProgram = () => {
    console.log("➕ Add New Program clicked");
    navigate("/assign/assignprogram");
  };

  const handleFilterChange = (filterId) => {
    console.log(filterId)
    setActiveFilter(filterId);
    setFilterOptions(prev =>
      prev.map(option => ({
        ...option,
        isActive: option.id === filterId,
      }))
    );
    fetchassign(API_URL, filterId, 1);
  };

  const handleResetFilter = () => {
    // reload whole page
    window.location.reload();
  };

  return (

    <Navigation>
      <div className="flex flex-col h-[100vh] font-inter no-scrollbar">
        <div className="sticky top-0 z-[999] p-2 md:px-6 md:py-0 backdrop-blur-sm md:ml-4 overflow-y-hidden h-full">
          {/* <AssignTopBar /> */}
          <UniversalTopBar
            isAdd={false}
            isEdit={false}
            defaultTitle="Assignment"
            backPath="/assign"
          />
          <div className="py-0 h-full">
            <div className="flex flex-col gap-0 h-[88%]">
              {/* FILTER + SEARCH + ADD as TABLE */}
              <div className="w-full backdrop-blur-sm bg-white/10 rounded-t-[1.875rem] px-3 pt-2">
                <div className="bg-white p-1 rounded-[1.875rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
                          ${isDateFilterActive ? "bg-[#C7C2F9]" : ""}`}

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
                      onClick={handleAddProgram}
                      className={`rounded-[1.5rem]  px-6 py-[0.75rem] gap-[0.625rem] text-[0.875rem] leading-[1.25rem] font-medium font-inter text-center box-border flex flex-row justify-center items-center  bg-gradient-to-r from-[#574EB6] hover:from-[#352F6E] to-[#7367F0] hover:to-[#352F6E] border border-white shadow-[0.125rem_0.1875rem_0.5rem_rgba(100,90,209,0.5)]  text-white  hover:shadow-[0px_0.1875rem_0.5rem_rgba(100,90,209,0.5)] hover:bg-[#352F6E] `}

                    >
                      <Plus size={16} />
                      Assign Program
                    </button>
                  </div>
                </div>
              </div>
              <div className="backdrop-blur-sm bg-white/10 flex-1 overflow-hidden w-full h-full">
                <div className="h-full w-full overflow-y-auto px-4 pt-4 no-scrollbar">
                  <div className="grid gap-4 w-full 
                  grid-cols-1 
                  sm:grid-cols-2 
                  md:grid-cols-6 md:grid-rows-6">
                    {loading ? (
                      <div className="flex justify-center items-center py-10 w-full col-span-full row-span-full">
                        <PrimaryLoader />
                      </div>
                    ) : (
                      Array.isArray(assign) && assign.length > 0 ? (
                        assign.slice(0, 6).map((item, index) => {
                          const desktopClasses = [
                            "md:col-span-2 md:row-span-3",
                            "md:col-span-2 md:row-span-3 md:col-start-3",
                            "md:col-span-2 md:row-span-3 md:col-start-5",
                            "md:col-span-2 md:row-span-3 md:row-start-4",
                            "md:col-span-2 md:row-span-3 md:col-start-3 md:row-start-4",
                            "md:col-span-2 md:row-span-3 md:col-start-5 md:row-start-4",
                          ];

                          return (
                            <div key={item.id || index} className={`${desktopClasses[index]} col-span-1 sm:col-span-1`}>
                              <AssignCard assign={item} />
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex justify-center items-center py-10 w-full col-span-full row-span-full">
                          <p className="text-gray-600">No Assignments Found</p>
                        </div>
                      )
                    )}
                  </div>
                </div>


              </div>
              <div className="w-full rounded-b-[1.5rem] backdrop-blur-sm bg-white/10 py-2 no-scrollbar flex justify-center items-center">
                <div className="w-full flex px-2">
                  <div className="py-2 w-full bg-white/35 rounded-[1.5rem] flex justify-between items-center gap-2">

                    {pageCount > 0 ? (
                      <Pagination pageCount={pageCount} currentPage={currentPage} handlePageChange={handlePageChange} />
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
              fetchassign(API_URL, activeFilter, 1);
            }}
          >
            Apply Filter
          </button>
        </div>
      )}

    </Navigation>

  );
}