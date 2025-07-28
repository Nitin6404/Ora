import React from "react";
import {
  Zap,
  EllipsisVertical,
  CirclePause,
  AlertTriangle,
  CircleCheckBig,
  Clock3,
} from "lucide-react";

const ProgramCard = ({ program, onprogramClick }) => {
  const programId = program.id;
  const status = program.status || "Inactive";
  const flagged = program.flagged || false;
  const sessionCount = program.number_of_sessions || 0;

  const getStatusColor = (status, flagged) => {
    if (flagged) return "bg-red-100 text-red-700";
    if (status === "Completed") return "bg-[#70eba8] text-green-700";
    if (status === "Active") return "bg-[#d6d7db] text-[#333]";
    if (status === "In Progress") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  console.log(program);

  return (
    <div className="rounded-2xl p-[1rem] shadow-md border bg-white w-full hover:bg-[#f1f1fd] transition-all duration-300 ease-in-out">
      {/* Top: ORA ID + Status */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-[#161824] font-medium">ORA-00{programId}</span>
        <div className="flex items-center gap-[0.5rem]">
          <span
            className={`px-[0.25rem] py-[0.25rem] rounded-full text-xs font-medium flex justify-center items-center  ${getStatusColor(
              status,
              flagged
            )}`}
          >
            <div className="mr-[0.25rem] bg-white rounded-full w-6 h-6 flex items-center justify-center">
              {flagged && <AlertTriangle className="w-[1rem] h-[1rem]" />}
              {status === "Completed" && (
                <CircleCheckBig className="w-[1rem] h-[1rem]" />
              )}
              {status === "Active" && <Zap className="w-[1rem] h-[1rem]" />}
              {status === "In Progress" && (
                <Clock3 className="w-[1rem] h-[1rem]" />
              )}
            </div>
            <span className="pr-[0.75rem] pl-[0.25rem]">{status}</span>
          </span>
          <EllipsisVertical className="w-[1.25rem] h-[1.25rem] text-gray-600" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between gap-[0.5rem] py-[0.5rem]">
        <span>{status === "Completed" ? "100%" : "82%"}</span>
        <div className="w-full flex items-center justify-between bg-gray-100 h-[0.5rem] rounded-full">
          <div
            className={` h-full rounded-full
            ${status === "Completed" && "bg-[#70eba8]"}
            ${status === "Active" && "bg-[#8057db]"}
            ${status === "In Progress" && "bg-yellow-400"}
            ${status === "Flagged" && "bg-red-400"}
            `}
            style={{
              width: status === "Completed" ? "100%" : "82%",
            }}
          />
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-3 mb-[0.5rem]">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
          {program.patient?.profile_image ? (
            <img
              src={program.patient.profile_image}
              alt="Profile"
              className="w-full h-full rounded-full"
            />
          ) : (
            "U"
          )}
        </div>
        <div className="ml-auto text-sm bg-[#f8f7fd] px-3 py-1.5 rounded-full">
          {program.mood_status || "😐 Sad"}
        </div>{" "}
        {/* mood_status is null; fallback */}
      </div>

      {/* Patient Name */}
      <div className="flex flex-col items-start gap-1 mb-2">
        <div className="flex items-center justify-center text-xl font-semibold text-[#171925">
          {program.patient?.full_name ? program.patient.full_name : "U"}
        </div>
        <div className="text-sm text-[#3e404c]">
          {program.program?.name || "The Mindful Coping Starter"}
        </div>
      </div>

      <div className="bg-[#f5f5f5] w-full flex flex-col items-start justify-between px-2 py-4 rounded-2xl">
        {/* Advisors */}
        <div className="text-xs space-y-2 w-full">
          <div className="flex gap-2 items-center justify-between">
            <span className="bg-gray-100 font-semibold px-2 py-1 rounded-full">
              VMA
            </span>
            <span className="text-right bg-white font-medium px-5 py-1 rounded-full">
              {program.vma_detail?.name || "N/A"}
            </span>
          </div>
          <div className="flex gap-2 items-center justify-between">
            <span className="bg-gray-100 font-semibold px-2 py-1 rounded-full">
              VSA
            </span>
            <span className="text-right bg-white font-medium px-5 py-1 rounded-full">
              {program.vsa_detail?.name || "N/A"}
            </span>
          </div>
          {/* Environment & Frequency */}
          <div className="flex gap-2 items-center justify-between w-full">
            <span className="font-medium text-[#41abbb] bg-[#f3fcf9] px-5 py-1 rounded-full text-sm">
              {program.environment?.name || "Unknown"}
            </span>
            <span className="text-sm font-medium text-[#2d4e57] bg-[#ebf0f4] px-5 py-1 rounded-full">
              {program.solfeggio_frequency || "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1 text-xs">
        <div className="mb-3"></div>
        <div className="flex justify-between text-[#42424e]">
          <div className="flex flex-col justify-between font-medium">
            <span>Current Session</span>
            <span className="px-4 py-1.5 rounded-full bg-[#f2f0fd] text-center mt-2 text-[#7670b8]">
              {program.number_of_sessions + " of 3" || "N/A"}
            </span>
          </div>
          <div className="w-[1.5px] h-12 bg-gray-200" />
          <div className="flex flex-col justify-between font-medium">
            <span>Break Taken</span>
            <span className="px-4 py-1.5 rounded-full bg-[#eff8ff] text-center mt-2 text-[#5d84a3]">
              {program.exits || "2 Breaks"}
            </span>
          </div>
        </div>
        <div className="border-b-2 border-gray-200 mt-3"></div>
        <div className="py-2 text-xs font-semibold text-[#3a3c48] flex justify-between items-center">
          <span>Last Session: {program.last_session || "May 20, 2025"}</span>
          <img
            onClick={() => onprogramClick(program.id)}
            className="cursor-pointer"
            src="/tilde-icon.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
