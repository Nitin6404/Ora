import React, { useState } from "react";
import Navigation from "../admin/Navigation";
import TopBar from "./components/TopBar";
import SessionPerformanceChart from "./components/SessionPerformanceChart";
import SessionDurationChart from "./components/SessionDurationChart";
import MoodTrends from "./components/MoodTrends";
import ActiveProgramsCard from "./components/ActiveProgramCard";
import FilterTabs from "./components/FilterTabs";
import ProgramCard from "./components/ProgramCard";
import ScrollWrapper from "../../components/ScrollWrapper";
import { useQuery } from "@tanstack/react-query";
import getDashboardStats from "./helpers/getDashboardStats";
import { isObjectWithValues } from "../../utils/isObjectWithValues";
import { isArrayWithValues } from "../../utils/isArrayWithValues";
import PrimaryLoader from "../../components/PrimaryLoader";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const param = {
    status: activeTab === "All" ? "" : activeTab,
    // search: searchTerm || "",
  };

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard-stats", param],
    queryFn: () => getDashboardStats(param),
  });

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
              <FilterTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                showSearchInput={showSearchInput}
                setShowSearchInput={setShowSearchInput}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
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
    </Navigation>
  );
};

export default Dashboard;
