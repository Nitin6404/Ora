import React, { useState } from "react";
import Navigation from "../Navigation";
import TopBar from "./components/TopBar";
import SessionPerformanceChart from "./components/SessionPerformanceChart";
import SessionDurationChart from "./components/SessionDurationChart";
import MoodTrends from "./components/MoodTrends";
import ActiveProgramsCard from "./components/ActiveProgramCard";
import FilterTabs from "./components/FilterTabs";
import ProgramCard from "./components/ProgramCard";
import ScrollWrapper from "../../../components/ScrollWrapper";

const programsData = [
  {
    id: "ORA-00148",
    name: "Emily Sanchez",
    program: "Mindful Coping Starter",
    mood: "Calm",
    status: "Active",
    session: "2 of 3",
    exits: "1 Exits",
    flagged: false,
    lastSession: "May 1, 2023",
  },
  {
    id: "ORA-00148",
    name: "Emily Sanchez",
    program: "Mindful Coping Starter",
    mood: "Calm",
    status: "Completed",
    session: "2 of 3",
    exits: "1 Exits",
    flagged: false,
    lastSession: "May 1, 2023",
  },
  {
    id: "ORA-00125",
    name: "John Mitchell",
    program: "Chemo Recovery Series A",
    mood: "Tired",
    status: "In Progress",
    session: "2 of 5",
    exits: "2 Exits",
    flagged: false,
    lastSession: "May 1, 2023",
  },
  {
    id: "ORA-00148",
    name: "Emily Sanchez",
    program: "Mindful Coping Starter",
    mood: "Calm",
    status: "Active",
    session: "2 of 3",
    exits: "1 Exits",
    flagged: false,
    lastSession: "May 1, 2023",
  },
  {
    id: "ORA-00125",
    name: "John Mitchell",
    program: "Chemo Recovery Series A",
    mood: "Tired",
    status: "Flagged",
    session: "2 of 5",
    exits: "2 Exits",
    flagged: true,
    lastSession: "May 1, 2023",
  },
  {
    id: "ORA-00148",
    name: "Emily Sanchez",
    program: "Mindful Coping Starter",
    mood: "Calm",
    status: "Active",
    session: "2 of 3",
    exits: "1 Exit",
    flagged: false,
    lastSession: "May 1, 2023",
  },
  {
    id: "ORA-00125",
    name: "John Mitchell",
    program: "Chemo Recovery Series A",
    mood: "Tired",
    status: "In Progress",
    session: "2 of 5",
    exits: "2 Exits",
    flagged: false,
    lastSession: "May 1, 2023",
  },
  {
    id: "ORA-00148",
    name: "Emily Sanchez",
    program: "Mindful Coping Starter",
    mood: "Calm",
    status: "Active",
    session: "2 of 3",
    exits: "1 Exits",
    flagged: false,
    lastSession: "May 1, 2023",
  },
  {
    id: "ORA-00148",
    name: "Emily Sanchez",
    program: "Mindful Coping Starter",
    mood: "Calm",
    status: "Active",
    session: "2 of 3",
    exits: "1 Exits",
    flagged: false,
    lastSession: "May 1, 2023",
  },
  {
    id: "ORA-00125",
    name: "John Mitchell",
    program: "Chemo Recovery Series A",
    mood: "Tired",
    status: "Flagged",
    session: "2 of 5",
    exits: "2 Exits",
    flagged: true,
    lastSession: "May 1, 2023",
  },
  {
    id: "ORA-00148",
    name: "Emily Sanchez",
    program: "Mindful Coping Starter",
    mood: "Calm",
    status: "Active",
    session: "2 of 3",
    exits: "1 Exit",
    flagged: false,
    lastSession: "May 1, 2023",
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("All");

  const filteredPrograms = programsData.filter((program) => {
    if (activeTab === "All") return true;
    if (activeTab === "Flagged") return program.flagged;
    if (activeTab === "In Progress") return program.status === "In Progress";
    if (activeTab === "Active")
      return program.status === "Active" && !program.flagged;
    if (activeTab === "Completed") return program.status === "Completed";
    return true;
  });

  return (
    <Navigation>
      <div
        className="flex flex-col min-h-screen font-inter"
        // style={{
        //   background: "linear-gradient(90deg,rgba(235, 233, 254, 1) 0%, rgba(253, 253, 253, 1) 50%, rgba(254, 246, 232, 1) 100%)",
        // }}
      >
        <div className="sticky top-0 z-[999] p-4 md:px-6 md:py-3 backdrop-blur-sm md:ml-4">
          <TopBar />

        </div>
        <div className="flex-1 p-4 md:px-6 md:py-3 overflow-auto">
          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8 w-full">
            <div className="col-span-1">
              <ActiveProgramsCard />
            </div>

            <div className="col-span-1 md:col-span-2 min-w-0">
              <SessionPerformanceChart />
            </div>

            <div className="col-span-1 min-w-0">
              <SessionDurationChart />
            </div>

            <div className="col-span-1">
              <MoodTrends />
            </div>
          </div>

          {/* Program List */}
          <div className="bg-[#ebeafd]/40 p-4 md:p-2 rounded-[30px]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 md:mb-2">
              <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <ScrollWrapper>
              {filteredPrograms.map((program, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[260px] md:w-[315px] overflow-hidden rounded-3xl"
                >
                  <ProgramCard program={program} />
                </div>
              ))}
            </ScrollWrapper>
          </div>
        </div>
      </div>
    </Navigation>
  );
};

export default Dashboard;
