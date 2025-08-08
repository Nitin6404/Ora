import React from "react";
import { User, Zap, AlertTriangle, CircleCheckBig, Clock3 } from "lucide-react";
import { formatDate } from "../../../utils/format_date";
import ModalWrapper from "../../../components/ModalWrapper";
import "../../patient.css";
import { snakeToCamel } from "../../../constants/index";

const MoodEmoji = ({ mood }) => {
  const getMoodEmoji = () => {
    switch (mood?.toLowerCase()) {
      case "sad":
        return "😢";
      case "stable":
        return "😊";
      case "improving":
        return "🙂";
      case "happy":
        return "😊";
      default:
        return "😊";
    }
  };
  return <span className="text-lg">{getMoodEmoji()}</span>;
};

const getStatusColor = (status, flagged) => {
  if (flagged) return "bg-red-100 text-red-700";
  if (status === "Completed") return "bg-[#70eba8] text-green-700";
  if (status === "Active") return "bg-[#d6d7db] text-[#333]";
  if (status === "In Progress") return "bg-yellow-100 text-yellow-700";
  if (status === "Inactive") return "bg-[#fde4e4] text-red-800";
  if (status === "Flagged") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};

const PatientDashboardModal = ({ isOpen, onClose, patientData }) => {
  if (!isOpen) return null;

  const data = patientData;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      Header={
        <>
          <h1 className="hidden lg:block text-xl font-semibold text-gray-800">
            Program Participation Summary
          </h1>
          <h2 className="hidden lg:block text-xl font-semibold text-gray-800">
            Session Log Table
          </h2>
        </>
      }
    >
      <PatientInfoCard data={data} />
      <ProgramList data={data} />
      <SessionLog data={data} />
    </ModalWrapper>
  );
};

const PatientInfoCard = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-6 space-y-4 font-medium text-gray-500">
      <div className="flex items-center gap-4">
        {data?.profile_image_url ? (
          <img
            src={data.profile_image_url}
            alt={data.name}
            className="w-20 h-20 rounded-full mr-4"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            {/* <User size={24} /> */}
            {snakeToCamel(data?.full_name)?.slice(0, 1)}
          </div>
        )}
        <div className="flex flex-col space-y-2">
          {/* <StatusBadge className status={data.status} /> */}
          <div>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              {data?.status || "-"}
            </span>
          </div>
          <div className="flex flex-col items-start mb-2">
            <h3 className="text-lg font-semibold mr-3 text-black">
              {snakeToCamel(data?.full_name) || "-"}
            </h3>
            <p className="text-gray-600 text-start">ORA-00{data?.id || "-"}</p>
          </div>
        </div>
      </div>

      <div className="h-[2px] bg-gray-200 font-medium" />

      <div className="space-y-4 bg-[#f1f1fd] rounded-xl py-4 px-2 ">
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Gender</span>
          <span className="font-medium px-[0.75em] py-[0.25em] rounded-full bg-white">
            {snakeToCamel(data?.gender) || "-"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Date of Birth</span>
          <span className="font-medium px-[0.75em] py-[0.25em] rounded-full bg-white">
            {formatDate(data?.date_of_birth) || "-"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Phone Number</span>
          <span className="font-medium text-cyan-500 px-[0.75em] py-[0.25em] rounded-full bg-cyan-50">
            {snakeToCamel(data?.phone_no) || "-"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Email</span>
          <span className="font-medium text-cyan-500 px-[0.75em] py-[0.25em] rounded-full bg-cyan-50">
            {data?.email || "-"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Clinic / Site</span>
          <span className="font-medium px-[0.75em] py-[0.25em] rounded-full bg-white">
            {snakeToCamel(data?.clinic_site || "-")}
          </span>
        </div>
      </div>

      <Divider />

      <div className="space-y-4 rounded-xl">
        <MoodTrend
          label="Last Mood"
          moodTrend={{
            to: data?.last_mood || "-",
          }}
        />
      </div>

      <Divider />

      <div className="space-y-4 rounded-xl">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Last Session</span>
          <span className="font-medium">
            {formatDate(data?.last_session) || "-"}
          </span>
        </div>
      </div>

      <Divider />
    </div>
  );
};

const ProgramList = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-6 space-y-4 h-full lg:overflow-y-auto no-scrollbar ">
      {data?.programs?.length > 0 ? (
        data?.programs?.map((program, index) => (
          <ProgramCard program={program} index={index} />
        ))
      ) : (
        <div className="flex items-center justify-center h-full bg-[#f1f1fd] uppercase font-bold rounded-xl">
          No programs found
        </div>
      )}
    </div>
  );
};
const ProgramCard = ({ program, index }) => (
  <div
    key={index}
    className="bg-white border-2 border-[#7367f0] rounded-xl p-6 shadow-sm min-h-[300px]"
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center justify-between w-full">
        <span
          // className="bg-[#7367f0] text-white px-4 py-2 rounded-full text-sm font-medium"
          className="purple-gradient-btn px-[1em] py-[0.25em]"
        >
          Program {program?.id}
        </span>
        <span
          className={`px-1 py-1 rounded-full text-xs font-medium flex justify-center items-center  ${getStatusColor(
            program?.status,
            program?.flagged
          )}`}
        >
          <div className="mr-1 bg-white rounded-full w-6 h-6 flex items-center justify-center">
            {program?.flagged && <AlertTriangle className="w-4 h-4" />}
            {program?.status === "Completed" && (
              <CircleCheckBig className="w-4 h-4" />
            )}
            {program?.status === "Active" && <Zap className="w-4 h-4" />}
            {program?.status === "In Progress" && (
              <Clock3 className="w-4 h-4" />
            )}
            {program?.status === "Flagged" && (
              <AlertTriangle className="w-4 h-4" />
            )}
          </div>
          <span className="pr-3 pl-1">{program.status}</span>
        </span>
      </div>
    </div>

    <div className="text-sm font-medium text-gray-600 mb-3">
      Assigned On: {formatDate(program?.started_at)}
    </div>

    <Divider />

    <div className="space-y-2 mt-3 font-medium text-black">
      <PatientProgramInfo
        program={{
          environment: program.environment_name,
          sessions: program.number_of_sessions,
          program: program.program_name,
        }}
      />

      <Divider />

      <MoodTrend
        label="Mood Trend"
        moodTrend={{
          to: program.mood_trend,
        }}
      />
    </div>
  </div>
);

const SessionLog = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-6 space-y-4 h-full lg:overflow-y-auto no-scrollbar ">
      {data?.sessions?.length > 0 ? (
        <>
          <h3 className="font-medium text-gray-800 mb-2">
            A timeline of all sessions from all programs
          </h3>
          {data?.sessions?.map((session, index) => (
            <SessionCard session={session} index={index} />
          ))}
        </>
      ) : (
        <div className="flex items-center justify-center h-full bg-[#f1f1fd] uppercase font-bold rounded-xl">
          No sessions found
        </div>
      )}
    </div>
  );
};
const SessionCard = ({ session, index }) => (
  <>
    <div
      key={index}
      className="bg-white border-2 border-[#7367f0] rounded-xl p-[1.5em] shadow-sm min-h-[18.75em] z-[100]"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-[0.5em]">
        <span
          // className="bg-black back-button text-white !px-4 !py-2 rounded-full text-sm font-medium flex !justify-center !items-center"
          className="black-gradient-btn  px-[1em] py-[0.25em]"
        >
          <span className="mr-[0.5em]">Session</span>
          <span className="font-medium">{session?.session_number}</span>
        </span>
        <div className="text-sm text-black font-medium mt-[0.5em] md:mt-0">
          Assigned On: {formatDate(session?.created_at) || "-"}
        </div>
      </div>

      <Divider />

      <div className="space-y-[0.75em] mt-[0.5em]">
        <PatientProgramInfo
          program={{
            environment: session?.environment_name || "Home",
            duration: session?.duration_minutes + " Min" || "10 Min",
            program: session?.program_name || "The Mindful Coping Starter",
          }}
          duration={true}
        />

        <Divider />

        <MoodTrend
          label="Mood Trend"
          moodTrend={{
            // "from": session.mood,
            to: session?.mood,
          }}
        />

        <Divider />

        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            {session?.breakTaken && (
              <div className="flex justify-between items-center gap-2">
                <span className="text-black font-medium">Break Taken</span>
                <span className="font-medium text-red-600 px-[1.25em] py-[0.25em] rounded-full bg-red-50">
                  {session?.breakTaken}
                </span>
              </div>
            )}
            {session?.exit_ground_used && (
              <div className="text-sm text-gray-600">
                Exited at {session?.exit_ground_used}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            {session?.distress_flag && (
              <div className="flex justify-between items-center gap-2">
                <span className="text-black font-medium">
                  Distress Flag Raised
                </span>
                <span className="font-medium text-red-600 px-[1.25em] py-[0.25em] rounded-full bg-red-50">
                  {session?.distress_flag}
                </span>
              </div>
            )}

            {session?.mood_note && (
              <div className="text-sm text-gray-600">{session?.mood_note}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  </>
);

const InfoRow = ({
  label,
  value,
  className = "bg-white",
  textClassName = "",
}) => (
  <div className="flex justify-between">
    <span className="text-gray-600 font-medium">{label}</span>
    <span
      className={`font-medium px-[1em] py-[0.2em] rounded-full ${className} ${textClassName}`}
    >
      {value}
    </span>
  </div>
);
const PatientProgramInfo = ({ program, duration }) => {
  return (
    <div className="space-y-2 mt-3 font-medium text-black">
      <InfoRow
        label="Program"
        value={program?.program}
        className="bg-[#7367f0]/20"
        textClassName="text-[#7367f0]"
      />
      <InfoRow
        label="Environment"
        value={program?.environment}
        className="bg-cyan-50"
        textClassName="text-cyan-500"
      />
      {!duration ? (
        <InfoRow
          label="Sessions"
          value={program?.sessions}
          className="bg-white"
          textClassName="text-black"
        />
      ) : (
        <InfoRow
          label="Duration"
          value={program?.duration}
          className="bg-white"
          textClassName="text-black"
        />
      )}
      {/* <InfoRow label="Mood Trend" value={program.moodTrend} /> */}
    </div>
  );
};
const MoodTrend = ({ label, moodTrend }) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600 font-medium">{label}</span>
      <div className="flex items-center px-[0.75em] py-[0.25em] rounded-full bg-pink-50">
        {moodTrend.from && (
          <>
            <MoodEmoji mood={moodTrend.from} />
            <span className="mx-[0.5em] font-medium">
              {snakeToCamel(moodTrend.from) || "-"}
            </span>
            <span className="mx-[0.5em]">→</span>
          </>
        )}
        {moodTrend.to && (
          <>
            <MoodEmoji mood={moodTrend.to} />
            <span className="ml-2 font-medium">
              {snakeToCamel(moodTrend.to) || "-"}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
const Divider = () => <div className="h-[2px] bg-gray-200" />;

export default PatientDashboardModal;
