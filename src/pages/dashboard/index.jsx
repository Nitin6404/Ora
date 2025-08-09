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
import { formatDateForAPI } from "../../utils/format_date_for_api";
import getMoveTrends from "./helpers/getMoveTrends";
import AssignModal from "../assign/components/AssignModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("All");
  const [filterOptions, setFilterOptions] = useState(DASHBOARD_FILTER_OPTIONS);

  const [assignId, setAssignId] = useState(null);
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
      status: activeTab,
      // flag: activeTab === "Flagged" ? "Flagged" : "",
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

  const {
    data: moodTrends,
    isLoading: moodTrendsLoading,
    error: moodTrendsError,
  } = useQuery({
    queryKey: ["mood-trends"],
    queryFn: () => getMoveTrends(),
  });
  console.log(moodTrends);

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
    setSearchTerm("");
    setDebouncedSearch("");
    setStartDate("");
    setEndDate("");
    handleSearchChange("");
  };

  const sessionDuration = isObjectWithValues(stats?.duration_buckets)
    ? Object.entries(stats?.duration_buckets).map(([key, value]) => ({
        name: key,
        value,
      }))
    : [];

  const filteredPrograms = isLoading ? [] : stats?.patient_programs?.results;
  const userObj = JSON.parse(localStorage.getItem("user"));
  let name = "Olivia Grant";
  if (userObj?.first_name) {
    name = userObj?.first_name + " " + userObj?.last_name;
  }

  return (
    <Navigation>
      <TopBar name={name} />
      <div className="h-full flex flex-col p-[0.125rem] overflow-y-auto no-scrollbar font-inter">
        <div className="flex-1 p-[0.25rem] md:px-[0.375rem] md:py-[0.1875rem] overflow-auto no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-[0.375rem] md:mb-[0.5rem] w-full">
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
              <MoodTrends
                moodTrends={moodTrends || []}
                isLoading={moodTrendsLoading}
              />
            </div>
          </div>

          <div className="bg-[#ebeafd]/40 p-[0.25rem] md:p-[0.125rem] rounded-[1.875rem]">
            <div className="flex flex-wrap items-center justify-between gap-[0.125rem] mb-[0.25rem] md:mb-[0.125rem]">
              <FilterTopBar
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
                onSearchChange={handleSearchChange}
                searchPlaceholder={`Search ${
                  filterOptions.find((option) => option.isActive).id
                }...`}
                onAddClick={() => navigate("/assign/assignprogram")}
                addButtonText="Assign Program"
                startDate={startDate}
                endDate={endDate}
                onDateSelect={() => setShowDateRange(true)} // Open modal
                handleReset={handleReset}
                isDashboard={true}
              />
            </div>

            <ScrollWrapper>
              {isLoading ? (
                <div className="flex flex-1 items-center justify-center w-full min-h-[4rem]">
                  <PrimaryLoader />
                </div>
              ) : isArrayWithValues(filteredPrograms) ? (
                filteredPrograms.map((program, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[16.25rem] md:w-[19.6875rem] overflow-hidden rounded-[1.5rem]"
                  >
                    <ProgramCard
                      program={program}
                      onprogramClick={(id) => {
                        if (assignId !== id) {
                          setAssignId(id);
                        }
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="flex flex-1 items-center justify-center w-full min-h-[4rem]">
                  <p className="text-gray-600 text-sm">No programs found</p>
                </div>
              )}
            </ScrollWrapper>
          </div>
        </div>
      </div>

      {assignId && (
        <>
          <AssignModal
            isOpen={!!assignId}
            onClose={() => setAssignId(null)}
            assignId={assignId}
          />
          <div className="absolute inset-0 backdrop-blur-2xl bg-white/20 w-full h-full z-[70]" />
        </>
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
