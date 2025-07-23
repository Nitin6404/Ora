import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/apiService";
import Navigation from "../admin/Navigation";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css
import "react-date-range/dist/theme/default.css"; // theme css
import AssignCard from "./components/AssignCard";
import UniversalTopBar from "../../components/UniversalTopBar";
import PrimaryLoader from "../../components/PrimaryLoader";
import Pagination from "./components/Pagination";
import { ASSIGNMENT_FILTER_OPTIONS } from "../../constants";
import { API_BASE_URL, ASSIGNMENT_ENDPOINT } from "../../config/apiConfig";
import FilterTopBar from "../../components/FilterTopBar";
import DateRangeModal from "../../components/DateRangeModal";

export default function Assign() {
  const [assign, setAssign] = useState([]);
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateRange, setShowDateRange] = useState(false);
  const [filterOptions, setFilterOptions] = useState(ASSIGNMENT_FILTER_OPTIONS);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [dateRange, setDateRange] = useState([
    {
      startDate: startDate,
      endDate: endDate,
      key: "selection",
    },
  ]);

  // Debounce useEffect: updates debouncedSearchTerm after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400); // 400ms delay

    return () => clearTimeout(timer); // Cleanup timer
  }, [searchTerm]);

  // Data fetching useEffect: runs when filter, page, or debounced search term changes
  useEffect(() => {
    fetchassign(activeFilter, currentPage);
  }, [debouncedSearchTerm, startDate, endDate, activeFilter, currentPage]);

  // Fetch assign from API
  const fetchassign = async (filter = "All", page = 1) => {
    setLoading(true);
    const API_URL = API_BASE_URL; // Using mocked base URL

    const params = new URLSearchParams();
    params.append("page", page);
    if (filter !== "All") params.append("status", filter);
    if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
    params.append("page_size", 12);
    if (startDate && endDate) {
      params.append("start_date", startDate);
      params.append("end_date", endDate);
    }

    try {
      const res = await axiosInstance.get(
        `${API_URL}${ASSIGNMENT_ENDPOINT}?${params.toString()}`
      );
      setAssign(res.data.results);
      setPageCount(Math.ceil(res.data.count / 12));
    } catch (err) {
      console.error("❌ Failed to fetch assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchassign();
  }, []);

  const handlePageChange = (page) => {
    if (page > 0 && page <= pageCount) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleAddProgram = () => {
    navigate("/assign/assignprogram");
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setFilterOptions((prev) =>
      prev.map((option) => ({
        ...option,
        isActive: option.id === filterId,
      }))
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleDateSelect = () => {
    setShowDateRange(!showDateRange);
  };

  const applyDateFilter = () => {
    const formatDate = (date) => date.toLocaleDateString("en-US"); // Simple format for example
    setStartDate(formatDate(dateRange[0].startDate));
    setEndDate(formatDate(dateRange[0].endDate));
    setShowDateRange(false);
    setCurrentPage(1);
  };

  return (
    <Navigation>
      <div className="h-full flex flex-col p-2">
        <UniversalTopBar
          isAdd={false}
          isEdit={false}
          defaultTitle="Assignment"
          backPath="/assign"
        />
        <FilterTopBar
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearch}
          startDate={startDate}
          endDate={endDate}
          onDateSelect={handleDateSelect}
          onAddClick={handleAddProgram}
          addButtonText="Assign Program"
          searchPlaceholder="Search Assignments..."
        />
        <div className="backdrop-blur-sm bg-white/10 flex-1 overflow-hidden w-full h-full">
          <div className="h-full w-full overflow-y-auto px-4 pt-4 no-scrollbar">
            <div
              className="grid gap-4 w-full h-auto 
             grid-cols-1 
             sm:grid-cols-2 
             md:grid-cols-3 
             lg:grid-cols-4 
             xl:grid-cols-6"
            >
              {loading ? (
                <div className="flex justify-center items-center py-10 w-full col-span-full row-span-full">
                  <PrimaryLoader />
                </div>
              ) : Array.isArray(assign) && assign.length > 0 ? (
                assign.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="col-span-1 sm:col-span-1 md:col-span-3 lg:col-span-2 xl:col-span-2"
                  >
                    <AssignCard assign={item} />
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center py-10 w-full h-full col-span-full row-span-full">
                  <p className="text-gray-600">No Assignments Found</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-16 flex-shrink-0  z-10 bg-white/10 rounded-b-[1.875rem]">
          <div className="p-2 w-full flex h-full">
            <div className="w-full h-full bg-white/10 rounded-[1.875rem] flex justify-between items-center gap-2">
              {pageCount > 0 ? (
                <Pagination
                  pageCount={pageCount}
                  currentPage={currentPage}
                  handlePageChange={handlePageChange}
                />
              ) : (
                <div className="flex justify-center items-center w-full gap-2">
                  {Array.isArray(assign) && assign.length > 0 ? (
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

      {showDateRange && (
        <DateRangeModal
          show={showDateRange}
          onClose={() => setShowDateRange(false)}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onApply={(start, end) => {
            setStartDate(start);
            setEndDate(end);
            fetchassign();
          }}
        />
      )}
    </Navigation>
  );
}
