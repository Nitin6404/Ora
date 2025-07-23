import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../services/apiService";
import Navigation from "../admin/Navigation";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import ProgramCard from "../../components/ProgramCard";
import ProgramTopBar from "./components/ProgramTopBar";
import UniversalTopBar from "../../components/UniversalTopBar";
import ProgramModal from "./components/ProgramModal";
import PrimaryLoader from "../../components/PrimaryLoader";
import Pagination from "../../components/Pagination";
import {
  API_BASE_URL as API_URL,
  PROGRAM_ENDPOINT,
  PROGRAM_DETAILS,
} from "../../config/apiConfig";
import FilterTopBar from "../../components/FilterTopBar";
import { PROGRAM_FILTER_OPTIONS } from "../../constants";
import { formatDate } from "../../utils/format_date";
import DateRangeModal from "../../components/DateRangeModal";

export default function NewProgram() {
  const [programs, setPrograms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");
  const [filterOptions, setFilterOptions] = useState(PROGRAM_FILTER_OPTIONS);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programData, setProgramData] = useState(null);

  const navigate = useNavigate();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch programs on dependency change
  useEffect(() => {
    fetchPrograms();
  }, [debouncedSearchTerm, activeFilter, currentPage, startDate, endDate]);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);

    const params = new URLSearchParams();
    params.append("page", currentPage);
    if (activeFilter !== "all") params.append("status", activeFilter);
    if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
    if (startDate && endDate) {
      params.append("start_date", startDate);
      params.append("end_date", endDate);
    }

    try {
      const res = await axiosInstance.get(
        `${API_URL}${PROGRAM_ENDPOINT}?${params.toString()}`,
      );

      setPrograms(res.data.results);
      const pageSize = res.data.results.length || 10;
      setPageCount(Math.ceil(res.data.count / pageSize));
    } catch (err) {
      console.error("❌ Failed to fetch programs:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, currentPage, debouncedSearchTerm, startDate, endDate]);

  const fetchProgramDetails = async (id) => {
    try {
      const res = await axiosInstance.get(
        `${API_URL}${PROGRAM_DETAILS}${id}`,
      );
      setProgramData(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch program details:", err.response?.data || err.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleAddProgram = () => navigate("/programs/addprogram");

  const handleDateSelect = () => setIsDatePickerVisible((prev) => !prev);

  const applyDateFilter = () => {
    setStartDate(formatDate(dateRange[0].startDate));
    setEndDate(formatDate(dateRange[0].endDate));
    setCurrentPage(1);
    setIsDatePickerVisible(false);
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setCurrentPage(1);
    setFilterOptions((prev) =>
      prev.map((opt) => ({ ...opt, isActive: opt.id === filterId }))
    );
  };

  return (
    <Navigation>
      <div className="h-full flex flex-col p-2">
        <UniversalTopBar defaultTitle="Programs" />
        <FilterTopBar
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearch}
          startDate={startDate}
          endDate={endDate}
          onDateSelect={handleDateSelect}
          onAddClick={handleAddProgram}
          addButtonText="Add New Program"
          searchPlaceholder="Search..."
        />

        <div className="backdrop-blur-sm bg-white/10 flex-1 overflow-hidden w-full">
          <div className="h-full w-full overflow-y-auto px-4 py-4 grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-2 no-scrollbar">
            {loading ? (
              <div className="flex justify-center items-center py-10 w-full col-span-4">
                <PrimaryLoader />
              </div>
            ) : programs.length > 0 ? (
              programs.map((program, index) => (
                <ProgramCard
                  key={index}
                  program={program}
                  onClick={(id) => {
                    fetchProgramDetails(id);
                    setIsModalOpen(true);
                  }}
                />
              ))
            ) : (
              <div className="flex justify-center items-center py-10 w-full col-span-4">
                <p className="text-gray-600">No programs found</p>
              </div>
            )}
          </div>
        </div>

        <div className="h-16 flex-shrink-0  z-10 bg-white/10 rounded-b-[1.875rem]">
          <div className="p-2 w-full flex h-full">
            <div className="w-full h-full bg-white/10 rounded-[1.875rem] flex justify-between items-center gap-2">
              {pageCount > 0 ? (
                <Pagination pageCount={pageCount} currentPage={currentPage} handlePageChange={handlePageChange} />
              ) : (
                <div className="flex justify-center items-center w-full gap-2">
                  {Array.isArray(programs) && programs.length > 0 ? (
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

      {isDatePickerVisible && (
        <DateRangeModal
        show={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onApply={(start, end) => {
          setStartDate(start);
          setEndDate(end);
          fetchPrograms();
        }}
      />
      )}

      {isModalOpen && (
        programData ? (
          <>
            <ProgramModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setProgramData(null);
              }}
              programData={programData}
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
