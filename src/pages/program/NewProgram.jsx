import React, { useEffect, useState, useCallback, useRef } from "react";
import axiosInstance from "../../services/apiService";
import Navigation from "../admin/Navigation";
import { useNavigate } from "react-router-dom";
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

  const controllerRef = useRef(null);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);

    // Abort previous request if any
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const params = new URLSearchParams({
      page: currentPage,
    });
    if (activeFilter !== "all") params.append("status", activeFilter);
    if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
    if (startDate && endDate) {
      params.append("start_date", startDate);
      params.append("end_date", endDate);
    }

    try {
      const res = await axiosInstance.get(
        `${API_URL}${PROGRAM_ENDPOINT}?${params.toString()}`,
        { signal: controller.signal }
      );
      setPrograms(res.data.results);
      const pageSize = res.data.results.length || 10;
      setPageCount(Math.ceil(res.data.count / pageSize));
    } catch (err) {
      if (err.name !== "CanceledError") {
        console.error(
          "❌ Program fetch error:",
          err.response?.data || err.message
        );
      }
    } finally {
      setLoading(false);
    }
  }, [activeFilter, currentPage, debouncedSearchTerm, startDate, endDate]);

  useEffect(() => {
    fetchPrograms();
    // Cleanup abort on unmount
    return () => controllerRef.current?.abort();
  }, [fetchPrograms]);

  const fetchProgramDetails = async (id) => {
    try {
      const res = await axiosInstance.get(`${API_URL}${PROGRAM_DETAILS}${id}`);
      setProgramData(res.data);
    } catch (err) {
      console.error(
        "❌ Detail fetch error:",
        err.response?.data || err.message
      );
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setCurrentPage(1);
    setActiveFilter("all");
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setStartDate("");
    setEndDate("");
    setDateRange([
      { startDate: new Date(), endDate: new Date(), key: "selection" },
    ]);
    setIsDatePickerVisible(false);
    setFilterOptions((prev) =>
      prev.map((opt) => ({ ...opt, isActive: opt.id === "all" }))
    );
    fetchPrograms();
  };

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

  const handleAddProgram = () => navigate("/programs/addprogram");

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
          onDateSelect={() => setIsDatePickerVisible((prev) => !prev)}
          onAddClick={handleAddProgram}
          addButtonText="Add New Program"
          searchPlaceholder="Search..."
          handleReset={handleReset}
        />

        <div className="backdrop-blur-sm bg-white/10 flex-1 overflow-hidden w-full">
          <div className="h-full w-full overflow-y-auto px-4 py-4 grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-2 no-scrollbar">
            {loading ? (
              <div className="flex justify-center items-center py-10 w-full col-span-4">
                <PrimaryLoader />
              </div>
            ) : Array.isArray(programs) && programs.length > 0 ? (
              <div
                className="grid gap-2 w-full h-auto 
                 grid-cols-1 
                 sm:grid-cols-2 
                 md:grid-cols-3 
                 lg:grid-cols-4 
                 xl:grid-cols-6"
              >
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className="col-span-1 sm:col-span-1 md:col-span-3 lg:col-span-2 xl:col-span-2"
                  >
                    <ProgramCard
                      key={program.id}
                      program={program}
                      onClick={(id) => {
                        fetchProgramDetails(id);
                        setIsModalOpen(true);
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center py-10 w-full col-span-4">
                <p className="text-gray-600">No programs found</p>
              </div>
            )}
          </div>
        </div>

        <div className="h-16 flex-shrink-0 z-10 bg-white/10 rounded-b-[1.875rem]">
          <div className="p-2 w-full flex h-full">
            <div className="w-full h-full bg-white/10 rounded-[1.875rem] flex justify-between items-center gap-2">
              {pageCount > 0 ? (
                <Pagination
                  pageCount={pageCount}
                  currentPage={currentPage}
                  handlePageChange={setCurrentPage}
                />
              ) : (
                <div className="flex justify-center items-center w-full gap-2">
                  {programs.length > 0 ? (
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
            setCurrentPage(1);
          }}
        />
      )}

      {isModalOpen &&
        (programData ? (
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
        ))}
    </Navigation>
  );
}
