import React, { useEffect, useState } from "react";
import Navigation from "../admin/Navigation";
import TopBar from "./components/TopBar";
import SessionPerformanceChart from "./components/SessionPerformanceChart";
import SessionDurationChart from "./components/SessionDurationChart";
import MoodTrends from "./components/MoodTrends";
import ActiveProgramsCard from "./components/ActiveProgramCard";
import ProgramCard from "./components/ProgramCard";
import ScrollWrapper from "../../components/ScrollWrapper";
import { useQuery } from "@tanstack/react-query";
import getDashboardStats from "./helpers/getDashboardStats";
import { isObjectWithValues } from "../../utils/isObjectWithValues";
import { isArrayWithValues } from "../../utils/isArrayWithValues";
import PrimaryLoader from "../../components/PrimaryLoader";
import FilterTopBar from "../../components/FilterTopBar";
import { DASHBOARD_FILTER_OPTIONS } from "../../constants";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { useMemo } from "react";
import DateRangeModal from "../../components/DateRangeModal";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Edit2 } from "lucide-react";
import { formatDateForAPI } from "../../utils/format_date_for_api";

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("All");
  const [filterOptions, setFilterOptions] = useState(DASHBOARD_FILTER_OPTIONS);

  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [showDateRange, setShowDateRange] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [dropdownId, setDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const param = useMemo(() => {
    return {
      status: activeTab === "All" || activeTab === "Flagged" ? "" : activeTab,
      flag: activeTab === "Flagged" ? "Flagged" : "",
      search: searchTerm || "",
      start_date: startDate ? formatDateForAPI(startDate) : "",
      end_date: endDate ? formatDateForAPI(endDate) : "",
    };
  }, [activeTab, searchTerm, startDate, endDate]);

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard-stats", param],
    queryFn: () => getDashboardStats(param),
  });

  const debounced = useMemo(
    () =>
      debounce((val) => {
        setDebouncedSearch(val);
        setPage(1);
      }, 500),
    []
  );

  useEffect(() => {
    setSearchTerm(debouncedSearch);
  }, [debouncedSearch]);

  const handleSearchChange = (val) => {
    setSearch(val);
    debounced(val);
  };

  const handleFilterChange = (type) => {
    setActiveTab(type);
    setFilterOptions((prev) =>
      prev.map((option) => ({
        ...option,
        isActive: option.id === type,
      }))
    );
    setPage(1);
    setSearch("");
    setDebouncedSearch("");
  };

  const sessionDuration = isObjectWithValues(stats?.duration_buckets)
    ? Object.entries(stats?.duration_buckets).map(([key, value]) => ({
        name: key,
        value,
      }))
    : [];

  const filteredPrograms = isLoading ? [] : stats?.patient_programs?.results;

  return (
    <Navigation>
      <TopBar name={stats?.dr_name} />
      <div className="h-full flex flex-col p-2 overflow-x-hidden no-scrollbar font-inter">
        <div className="flex-1 p-4 md:px-6 md:py-3 overflow-auto no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8 w-full">
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <ActiveProgramsCard noOfPrograms={stats?.active_programs} />
            </div>

            <div className="col-span-1 md:col-span-3 lg:col-span-2 min-w-0">
              <SessionPerformanceChart
                totalSessions={stats?.total_sessions}
                sessionCompleted={stats?.completed_sessions}
                distressRaised={stats?.distress_flagged_sessions}
              />
            </div>

            <div className="col-span-1 md:col-span-3 lg:col-span-1">
              <SessionDurationChart sessionDuration={sessionDuration || []} />
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <MoodTrends />
            </div>
          </div>

          <div className="bg-[#ebeafd]/40 p-4 md:p-2 rounded-[30px]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 md:mb-2">
              <FilterTopBar
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
                onSearchChange={handleSearchChange}
                searchPlaceholder={`Search ${
                  filterOptions.find((option) => option.isActive).id
                }...`}
                onAddClick={() => navigate("/programs/addprogram")}
                addButtonText="Add New Program"
                startDate={startDate}
                endDate={endDate}
                onDateSelect={() => setShowDateRange(true)} // Open modal
              />
            </div>

            <ScrollWrapper>
              {isLoading ? (
                <div className="flex flex-1 items-center justify-center w-full min-h-64">
                  <PrimaryLoader />
                </div>
              ) : isArrayWithValues(filteredPrograms) ? (
                filteredPrograms.map((program, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[260px] md:w-[315px] overflow-hidden rounded-3xl"
                  >
                    <ProgramCard program={program} />
                  </div>
                ))
              ) : (
                <div className="flex flex-1 items-center justify-center w-full min-h-64">
                  <p className="text-gray-600 text-sm">No programs found</p>
                </div>
              )}
            </ScrollWrapper>
          </div>
        </div>
      </div>

      {dropdownId && (
        <div
          className="dropdown-menu absolute bg-white z-[100] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left - 150}px`, //adjust left based on width
            width: "160px",
          }}
        >
          <button
            onClick={() => handleEditMedia(dropdownId)}
            className="w-full flex items-center gap-2 px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
          >
            <Edit2 size={16} className="w-5 h-5 text-blue-600" />
            Edit
          </button>
          <button
            onClick={() => handleDeleteMedia(dropdownId)}
            className="w-full flex items-center gap-2 px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
          >
            <Trash2 size={16} className="w-5 h-5 text-red-600" />
            Delete
          </button>
        </div>
      )}

      {showDateRange && (
        <DateRangeModal
          show={showDateRange}
          onClose={() => setShowDateRange(false)}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onApply={(start, end) => {
            setStartDate(start);
            setEndDate(end);
            setShowDateRange(false);
            setPage(1);
            queryClient.invalidateQueries({
              queryKey: ["dashboard-stats", param],
            });
          }}
        />
      )}
    </Navigation>
  );
};

export default Dashboard;
