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

  const handleReset = () => {
    setActiveTab("All");
    setFilterOptions(DASHBOARD_FILTER_OPTIONS);
    setPage(1);
    setSearch("");
    setDebouncedSearch("");
    setStartDate("");
    setEndDate("");
  };

  const sessionDuration = isObjectWithValues(stats?.duration_buckets)
    ? Object.entries(stats?.duration_buckets).map(([key, value]) => ({
        name: key,
        value,
      }))
    : [];

  const filteredPrograms = isLoading ? [] : stats?.patient_programs?.results;
  const userObj = localStorage.getItem("user");
  let name = "Olivia Grant";
  if (userObj?.first_name) {
    name = userObj?.first_name + " " + userObj?.last_name;
  }

  return (
    <Navigation>
      <TopBar name={name} />
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
                addButtonText="Assign Program"
                startDate={startDate}
                endDate={endDate}
                onDateSelect={() => setShowDateRange(true)} // Open modal
                handleReset={handleReset}
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
