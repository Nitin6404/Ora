import React, { useEffect, useRef, useState } from "react";
import { User, Zap, AlertTriangle, CircleCheckBig, Clock3 } from "lucide-react";
import { formatDate } from "../../../utils/format_date";
import ModalWrapper from "../../../components/ModalWrapper";
import "../../patient.css";
import { useQuery } from "@tanstack/react-query";
import { getAssignDetail } from "../helpers/getAssignDetail";
import { toast } from "react-toastify";
import PrimaryLoader from "../../../components/PrimaryLoader";
import CustomDropDown from "../../../components/CustomDropDown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import raiseFlag from "../helpers/raiseFlag";

const formType = [
  { id: 1, name: "Ok" },
  { id: 2, name: "Not Ok" },
];

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
  return "bg-gray-100 text-gray-700";
};

const AssignModal = ({ isOpen, onClose, assignId }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    flag_type: "",
    note: "",
  });
  const hasShownToastRef = useRef(false);
  const {
    data: assignDetail,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["assignDetail", assignId],
    queryFn: () => getAssignDetail(assignId),
    enabled: !!assignId,
    staleTime: 5 * 60 * 1000, // optional but improves UX
    retry: false,
  });

  const raiseFlagMutation = useMutation({
    mutationFn: raiseFlag,
    onSuccess: () => {
      toast.success("Flag raised successfully");
      queryClient.invalidateQueries({
        queryKey: ["assignDetail", assignId],
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Failed to raise flag");
    },
  });

  useEffect(() => {
    if (isError && !hasShownToastRef.current) {
      toast.error(
        error?.response?.data?.error ||
          "Something went wrong while fetching assignment"
      );

      hasShownToastRef.current = true;
      onClose();
    }
  }, [isError, error]);

  useEffect(() => {
    if (isOpen) {
      hasShownToastRef.current = false; // allow toast again on next error
    }
  }, [isOpen]);

  if (isError) return null;

  const data = assignDetail;
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      Header={
        <>
          <h1 className="hidden lg:block text-xl font-semibold text-gray-800">
            Completed Sessions
          </h1>
          <h2 className="hidden lg:block text-xl font-semibold text-gray-800">
            Session Details
          </h2>
        </>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-full w-screen">
          <PrimaryLoader />
        </div>
      ) : (
        <>
          <PatientInfoCard data={data} />
          <SessionsList data={data} />
          <SessionLog
            data={data}
            formData={formData}
            setFormData={setFormData}
            raiseFlagMutation={raiseFlagMutation}
          />
        </>
      )}
    </ModalWrapper>
  );
};

const PatientInfoCard = ({ data }) => {
  const completionPercentage = data?.program_info?.completion_percentage;
  const status = data?.program_info?.status;
  const patientInfo = data?.patient_info;
  const programInfo = data?.program_info;
  const currentSession = data?.sessions?.find(
    (session) => session.session_number === data?.program_info?.current_session
  );
  return (
    <div className="bg-white rounded-xl p-6 space-y-4 font-medium text-gray-500 lg:overflow-auto no-scrollbar">
      <div className="flex items-center justify-between w-full">
        <div className="text-black flex flex-col text-sm font-medium">
          <div className="flex flex-col gap-y-1 divide-y text-sm text-gray-600">
            <div className="flex items-center gap-x-2">
              <span>Assigned On: </span>
              <span> {formatDate(programInfo?.assigned_on) || "N/A"}</span>
            </div>
            <div className="flex items-center gap-x-2">
              <span>Last Session: </span>
              <span> {formatDate(programInfo?.last_session) || "N/A"}</span>
            </div>
          </div>
        </div>
        <span
          className={`px-1 py-1 rounded-full text-xs font-medium flex justify-center items-center  ${getStatusColor(
            status,
            data?.flagged
          )}`}
        >
          <div className="mr-1 bg-white rounded-full w-6 h-6 flex items-center justify-center">
            {data.flagged && <AlertTriangle className="w-4 h-4" />}
            {status === "published" && <CircleCheckBig className="w-4 h-4" />}
            {status === "draft" && <Zap className="w-4 h-4" />}
            {status === "In Progress" && <Clock3 className="w-4 h-4" />}
            {status === "Completed" && <CircleCheckBig className="w-4 h-4" />}
          </div>
          <span className="pr-3 pl-1 uppercase">{status}</span>
        </span>
      </div>

      <div className="flex items-center justify-between gap-[0.5rem] py-[0.5rem]">
        <span>{completionPercentage + "%"}</span>
        <div className="w-full flex items-center justify-between bg-gray-100 h-[0.5rem] rounded-full">
          <div
            className={` h-full rounded-full
            ${status === "Completed" && "bg-[#70eba8]"}
            ${status === "Active" && "bg-[#8057db]"}
            ${status === "In Progress" && "bg-yellow-400"}
            ${status === "Flagged" && "bg-red-400"}
            `}
            style={{
              width: completionPercentage + "%",
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {patientInfo?.profile_image ? (
          <img
            src={patientInfo?.profile_image}
            alt={patientInfo?.full_name}
            className="w-16 h-16 rounded-full mr-4"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={24} />
          </div>
        )}
        <div className="flex flex-col space-y-2">
          {/* <StatusBadge className status={data.status} /> */}
          {/* <div>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              {data.status || "N/A"}
            </span>
          </div> */}
          <div className="flex flex-col items-start mb-2">
            <h3 className="text-xl font-semibold mr-3 text-black">
              {patientInfo?.full_name || "N/A"}
            </h3>
            <p className="text-gray-600 text-start text-base">
              ORA-00{patientInfo?.patient_id || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <p>Program</p>
        <p className="bg-[#f1f1fd] px-[0.75em] py-[0.25em] rounded-full text-[#7367f0]">
          {programInfo?.name || "N/A"}
        </p>
      </div>

      <div className="h-[2px] bg-gray-200 font-medium" />

      <div className="space-y-4 bg-[#f1f1fd] rounded-xl py-4 px-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">
            {programInfo.advisor_type || "N/A"}
          </span>
          <span className="font-medium px-[0.75em] py-[0.25em] rounded-full bg-white">
            {programInfo.advisor || "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Environment</span>
          <span className="font-medium text-cyan-500 px-[0.75em] py-[0.25em] rounded-full bg-cyan-50">
            {programInfo.environment || "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Frequency</span>
          <span className="font-medium text-cyan-500 px-[0.75em] py-[0.25em] rounded-full bg-cyan-50">
            {programInfo.frequency || "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Tone Preference</span>
          <span className="font-medium px-[0.75em] py-[0.25em] rounded-full bg-white">
            {programInfo.tone_preference || "N/A"}
          </span>
        </div>
      </div>

      <Divider />

      <div className="space-y-3 rounded-xl text-sm">
        <div className="flex justify-between text-[#42424e]">
          <div className="flex flex-col justify-between font-medium">
            <span>Current Session</span>
            <span className="px-4 py-1.5 rounded-full bg-[#f2f0fd] text-center mt-2 text-[#7670b8]">
              {programInfo?.current_session +
                " of " +
                programInfo?.total_sessions || "N/A"}
            </span>
          </div>
          <div className="w-[1.5px] h-12 bg-gray-200" />
          <div className="flex flex-col justify-between font-medium">
            <span>Break Taken</span>
            <span className="px-4 py-1.5 rounded-full bg-[#eff8ff] text-center mt-2 text-[#5d84a3]">
              {programInfo?.breaks_taken + " Breaks"}
            </span>
          </div>
          <div className="w-[1.5px] h-12 bg-gray-200" />
          <div className="flex flex-col justify-between font-medium">
            <span>Flag Raised</span>
            <span className="px-4 py-1.5 rounded-full bg-green-100 text-center mt-2 text-green-700">
              {programInfo?.flag_raised ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>

      <Divider />

      <div className="w-full flex justify-between text-sm">
        <div className="flex flex-col justify-center items-center space-y-1">
          <span>Mood Before Session</span>
          <span className="px-8 py-1 rounded-full bg-gray-100 flex items-center gap-2">
            <p>{MoodEmoji(currentSession?.mood_before || "") || "N/A"}</p>
            <p>{currentSession?.mood_before || "N/A"}</p>
          </span>
        </div>
        <div className="flex flex-col justify-center items-center space-y-1">
          <span>Mood After Session</span>
          <span className="px-8 py-1 rounded-full bg-gray-100 flex items-center gap-2">
            <p>{MoodEmoji(currentSession?.mood_after || "") || "N/A"}</p>
            <p>{currentSession?.mood_after || "N/A"}</p>
          </span>
        </div>
      </div>
    </div>
  );
};

const SessionsList = ({ data }) => {
  const sessions = data?.sessions;
  return (
    <div className="bg-white rounded-xl p-6 space-y-4 h-full lg:overflow-y-auto no-scrollbar ">
      {sessions.length > 0 ? (
        sessions.map((session, index) => (
          <ProgramCard session={session} index={index} />
        ))
      ) : (
        <div className="flex items-center justify-center h-full bg-[#f1f1fd] uppercase font-bold rounded-xl">
          No sessions found
        </div>
      )}
    </div>
  );
};
const ProgramCard = ({ session, index }) => (
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
          Session {session.session_number}
        </span>
        <span
          className={`px-1 py-1 rounded-full text-xs font-medium flex justify-center items-center  ${getStatusColor(
            session.status,
            session.flagged
          )}`}
        >
          <div className="mr-1 bg-white rounded-full w-6 h-6 flex items-center justify-center">
            {session.flagged && <AlertTriangle className="w-4 h-4" />}
            {session.status === "Completed" && (
              <CircleCheckBig className="w-4 h-4" />
            )}
            {session.status === "Active" && <Zap className="w-4 h-4" />}
            {session.status === "In Progress" && <Clock3 className="w-4 h-4" />}
          </div>
          <span className="pr-3 pl-1">{session.status}</span>
        </span>
      </div>
    </div>

    <div className="text-sm font-medium text-gray-600 mb-3">
      Assigned On: {formatDate(session?.assigned_on)}
    </div>

    <Divider />

    <div className="space-y-2 mt-3 font-medium text-black">
      <PatientProgramInfo
        program={{
          // vsa: session.vsa,
          // vma: session.vma,
          program: session.program_name,
          environment: session.environment,
          frequency: session.frequency,
          tone_preference: session.tone_preference,
        }}
      />

      <Divider />

      <div className="w-full flex justify-between text-sm">
        <div className="flex flex-col justify-center items-center space-y-1">
          <span>Mood Before Session</span>
          <span className="px-8 py-1 rounded-full bg-gray-100 flex items-center gap-2">
            <p>{MoodEmoji(session?.mood_before || "") || "N/A"}</p>
            <p>{session?.mood_before || "N/A"}</p>
          </span>
        </div>
        <div className="flex flex-col justify-center items-center space-y-1">
          <span>Mood After Session</span>
          <span className="px-8 py-1 rounded-full bg-gray-100 flex items-center gap-2">
            <p>{MoodEmoji(session?.mood_after || "") || "N/A"}</p>
            <p>{session?.mood_after || "N/A"}</p>
          </span>
        </div>
      </div>

      <Divider />

      <InfoRow
        label="Break Taken"
        value={session.break_taken ? "Yes" : "No"}
        className="bg-green-50"
        textClassName="text-green-500"
      />

      <InfoRow
        label="Distress Flag"
        value={session.distress_flag ? "Yes" : "No"}
        className="bg-green-50"
        textClassName="text-green-500"
      />
    </div>
  </div>
);

const SessionLog = ({ data, formData, setFormData, raiseFlagMutation }) => {
  const [activeTab, setActiveTab] = useState("flag");
  const flags = data?.flags;
  const sessions = data?.sessions;
  const program = data?.program_info;
  const currentSession = sessions?.find(
    (session) => session.session_number === data.program_info.current_session
  );
  const totalSessions = data.program_info.total_sessions;
  const handleRaiseFlag = () => {
    if (!currentSession) return;
    raiseFlagMutation.mutate({ id: currentSession.session_id, data: formData });
  };

  return (
    <div className="bg-white rounded-xl p-6 space-y-2 h-full lg:overflow-y-auto no-scrollbar ">
      <BreadCrumb
        BREADCRUMBS={[
          { id: "flag", name: "Raise Flag", current: true },
          { id: "session", name: "Session Overview", current: false },
        ]}
        onSelect={(id) => setActiveTab(id)}
        activeTab={activeTab}
      />

      <Divider />

      {activeTab === "flag" ? (
        <>
          <div className="p-6 space-y-2 bg-gray-100 rounded-lg">
            <CustomDropDown
              label="Flag Type"
              // placeholder="Select Program"
              options={formType}
              selected={
                formType.find((item) => item.id === formData.flag_type)?.name
              }
              onSelect={(id) => setFormData({ ...formData, flag_type: id })}
            />
            <div>
              <label className="text-sm font-medium text-gray-700">
                Note/Reason
              </label>
              <div className="input-wrapper !rounded-[0.375rem] !px-3 lg:!h-12 md:!h-8 !h-8">
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  placeholder={"Enter note/reason"}
                  autoComplete="off"
                  className="input-field pr-10"
                />
              </div>
            </div>
            <Divider />
            <button
              onClick={handleRaiseFlag}
              className="patient-btn flex justify-center items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] rounded-full shadow-md gap-2"
            >
              Raise Flag
            </button>
          </div>

          <Divider />

          {/* Flag List */}
          <div className="font-bold font-inter space-y-2">
            <h1>Flag List</h1>
            {flags.length > 0 ? (
              flags.map((flag, index) => (
                <div key={index} className="bg-[#f1f1fd] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span>{formatDate(flag?.date)}</span>
                    <span>{"Session " + flag?.session}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-500">{flag?.type || "N/A"}</span>
                    <span>{"Raised By: " + flag?.raised_by}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Program</span>
                    <span className="text-[#7367F0]">{program?.name}</span>
                  </div>
                  <Divider />
                  <div className="flex items-center justify-start">
                    <span>{flag?.note || "N/A"}</span>
                    {/* <span>Flagged By</span> */}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center bg-[#f1f1fd] uppercase font-bold rounded-lg min-h-[10rem]">
                No flags found
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col space-y-2 font-inter font-semibold">
          <div className="space-y-2">
            <h1> Session Progress Tracker</h1>
            <div className="bg-[#f1f1fd] rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span>Metric</span>
                <span>Response</span>
              </div>
              <Divider />
              <div className="flex items-center justify-between">
                <span>Session Completed</span>
                <span>
                  {currentSession?.session_number + " of " + totalSessions}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Time Spent</span>
                <span>{currentSession?.total_time_spent || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Avg. Session Duration</span>
                <span>{currentSession?.avg_session_duration || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Breaks Taken</span>
                <span>{currentSession?.break_taken ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Distress Flag</span>
                <span>{currentSession?.distress_flag ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1>Mood Trends Per Session</h1>
            <div className="bg-[#f1f1fd] rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span>Session</span>
                <span>Mood</span>
              </div>
              <Divider />
              {sessions?.map((session, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{"Session " + session?.session_number || "N/A"}</span>
                  <span>{session?.mood_after || "N/A"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BreadCrumb = ({ BREADCRUMBS, onSelect, activeTab }) => {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto rounded-full px-1 py-1 bg-white">
      {BREADCRUMBS.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelect(item.id)}
          className={`px-6 py-2 text-xs lg:text-sm font-medium rounded-full flex items-center gap-2
          ${
            item.id === activeTab
              ? "bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white shadow-md "
              : "bg-white text-[#252B37] hover:text-[#574EB6] hover:bg-[#E3E1FC]"
          }`}
        >
          {item.name}
        </button>
      ))}
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
          <span className="font-medium">{session.session_number}</span>
        </span>
        <div className="text-sm text-black font-medium mt-[0.5em] md:mt-0">
          Assigned On: {formatDate(session.created_at) || "N/A"}
        </div>
      </div>

      <Divider />

      <div className="space-y-[0.75em] mt-[0.5em]">
        <PatientProgramInfo
          program={{
            vsa: session.vsa,
            vma: session.vma,
            program: session.program_name || "The Mindful Coping Starter",
          }}
          duration={true}
        />

        <Divider />

        <MoodTrend
          label="Mood Trend"
          moodTrend={{
            from: data?.program_info?.mood_before,
            to: data?.program_info?.mood_after,
          }}
        />

        <Divider />

        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            {session.breakTaken && (
              <div className="flex justify-between items-center gap-2">
                <span className="text-black font-medium">Break Taken</span>
                <span className="font-medium text-red-600 px-[1.25em] py-[0.25em] rounded-full bg-red-50">
                  {session.breakTaken}
                </span>
              </div>
            )}
            {session.exit_ground_used && (
              <div className="text-sm text-gray-600">
                Exited at {session.exit_ground_used}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            {session.distress_flag && (
              <div className="flex justify-between items-center gap-2">
                <span className="text-black font-medium">
                  Distress Flag Raised
                </span>
                <span className="font-medium text-red-600 px-[1.25em] py-[0.25em] rounded-full bg-red-50">
                  {session.distress_flag}
                </span>
              </div>
            )}

            {session.mood_note && (
              <div className="text-sm text-gray-600">{session.mood_note}</div>
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
      {value || "N/A"}
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
      {/* <InfoRow
        label="VMA"
        value={program?.vma}
        className="bg-gray-50"
        textClassName="text-gray-500"
      />
      <InfoRow
        label="VSA"
        value={program?.vsa}
        className="bg-gray-50"
        textClassName="text-gray-500"
      /> */}
      <InfoRow
        label="Environment"
        value={program?.environment}
        className="bg-cyan-50"
        textClassName="text-cyan-500"
      />
      <InfoRow
        label="Frequency"
        value={program?.frequency}
        className="bg-green-50"
        textClassName="text-green-500"
      />
      <InfoRow
        label="Tone Preference"
        value={program?.tone_preference}
        className="bg-gray-50"
        textClassName="text-gray-500"
      />
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
              {moodTrend.from || "N/A"}
            </span>
            <span className="mx-[0.5em]">→</span>
          </>
        )}
        {moodTrend.to && (
          <>
            <MoodEmoji mood={moodTrend.to} />
            <span className="ml-2 font-medium">{moodTrend.to || "N/A"}</span>
          </>
        )}
      </div>
    </div>
  );
};
const Divider = () => <div className="h-[1.5px] bg-gray-200" />;

export default AssignModal;
