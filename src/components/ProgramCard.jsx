import React, { useEffect, useRef, useState } from "react";
import { Zap, EllipsisVertical, Pencil, CirclePause } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProgramCard = ({ program, onClick }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleEditProgram = (id) => {
    navigate(`/programs/editprogram/${id}`);
  };

  const programId = program.id;
  const status = program.status?.toUpperCase() || "UNKNOWN";

  const formattedDate = program.updated_date
    ? new Date(program.updated_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".menu-toggle")
      ) {
        setOpen(false);
      }
    };

    // Use pointerdown instead of mousedown!
    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 hover:shadow-md hover:bg-[#f1f1fd] transition-all duration-300 ease-in-out w-full">
      {/* Top section: ID + Status */}
      <div className="flex items-center justify-between mb-[0.5em]">
        <span className="text-xs font-medium text-gray-600">
          {"ORA-00" + programId}
        </span>
        <div className="flex items-center gap-[0.5em]">
          <div
            className={`flex items-center gap-[0.25em] text-xs p-1 rounded-full font-medium
              ${
                program.status === "draft"
                  ? "bg-[#fca29a] text-[#7A271A]"
                  : "bg-[#D5D7DA] text-gray-800"
              }
            `}
          >
            {program.status === "draft" ? (
              <CirclePause size={24} className="p-1 bg-white rounded-full" />
            ) : (
              <Zap size={24} className="p-1 bg-white rounded-full" />
            )}
            <span className="pr-1">{status}</span>
          </div>

          {/* Dropdown */}
          <div className="relative">
            <EllipsisVertical
              size={20}
              className="text-gray-400 cursor-pointer menu-toggle"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((prev) => !prev);
              }}
            />

            {open && (
              <div
                ref={dropdownRef}
                className="absolute top-3 right-0 z-10 mt-2 w-36 bg-white rounded-md shadow-lg p-1 dropdown"
              >
                <button
                  className="flex items-center gap-2 w-full p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditProgram(program.id);
                  }}
                >
                  <Pencil size={20} className="text-gray-400" />
                  <span>Edit Program</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="my-[0.5em] border-b-[2px] border-[#E3E1FC]" />

      {/* Program Title */}
      <h3 className="text-lg font-medium text-[#414651] leading-[28px]">
        {program.name?.length > 22
          ? program.name.slice(0, 22) + "..."
          : program.name}
      </h3>

      {/* Patients Assigned */}
      <div className="mt-[0.5em] flex items-center justify-between bg-[#F5F5F5] rounded-full p-1.5">
        <span className="bg-gray-100 text-sm text-[#535862] px-3 py-1 rounded-full">
          Patients Assigned
        </span>
        <span className="bg-[#535862] text-white text-sm font-medium px-2.5 py-1.5 rounded-[1em]">
          {program.assigned_patient_count || 0}
        </span>
      </div>

      {/* Tags */}
      <div className="mt-[0.5em] flex gap-[0.5em]">
        <span className="text-sm leading-[20px] font-medium bg-[#F8F7FE] text-[#7367F0] px-4 py-1 rounded-full">
          {program.condition_type || "Condition"}
        </span>
        <span className="text-sm leading-[20px] font-medium bg-[#FFFBF2] text-[#F6A705] px-4 py-1 rounded-full capitalize">
          {program.target_group || "Group"}
        </span>
      </div>

      <div className="my-[0.5em] border-b-[2px] border-[#E3E1FC]" />

      {/* Last Updated */}
      <p className="flex justify-between items-center gap-[0.5em] text-xs font-medium leading-[18px] text-[#414651]">
        Last Updated: {formattedDate}
        <button onClick={() => onClick(program.id)} className="cursor-pointer">
          <img src="/tilde-icon.png" alt="View Program" />
        </button>
      </p>
    </div>
  );
};

export default ProgramCard;
