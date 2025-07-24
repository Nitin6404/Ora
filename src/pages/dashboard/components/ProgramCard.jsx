import {
  TriangleAlert,
  Zap,
  CircleCheckBig,
  Clock3,
  EllipsisVertical,
} from "lucide-react";

const ProgramCard = ({ program }) => {
  const getStatusColor = (status) => {
    if (status === "Flagged") return "bg-red-100 text-red-700";
    if (status === "Completed") return "bg-[#70eba8] text-green-700";
    if (status === "Active") return "bg-[#d6d7db] text-[#333]";
    if (status === "In Progress") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case "Calm":
        return "😊";
      case "Tired":
        return "😩";
      case "Sad":
        return "😢";
      default:
        return "😊";
    }
  };

  console.log(program);
  return (
    <div className="rounded-3xl border border-gray-200 bg-[#fff] shadow-sm p-4 transition-all hover:shadow-md overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {/* <img
            src={"/pp.png"}
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
          /> */}
          <span className="text-sm font-bold text-gray-500 font-mono">
            {"ORA-00" + program.id}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium flex justify-center items-center  ${getStatusColor(
              program.status || "N/A"
            )}`}
          >
            <div className="mr-1 bg-white rounded-full w-6 h-6 flex items-center justify-center">
              {program.status === "Flagged" && (
                <TriangleAlert className="w-4 h-4" />
              )}
              {program.status === "Completed" && (
                <CircleCheckBig className="w-4 h-4" />
              )}
              {program.status === "Active" && <Zap className="w-4 h-4" />}
              {program.status === "In Progress" && (
                <Clock3 className="w-4 h-4" />
              )}
            </div>
            {program.status || "N/A"}
          </span>
          <EllipsisVertical className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      <div className="flex justify-between items-center mb-3">
        <img
          src={program.patient.profile_image || "/pp.png"}
          alt="User"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex items-center bg-white rounded-full px-2 py-1">
          <span>{getMoodEmoji(program.mood || "Calm")}</span>
          <span className="text-sm text-gray-600">
            {program.mood || "Calm"}
          </span>
        </div>
      </div>

      <h4 className="text-lg font-semibold text-gray-800 mb-1">
        {program.patient.full_name || "N/A"}
      </h4>
      <p className="text-base text-gray-500 mb-3">
        {program.program.name || "N/A"}
      </p>

      {/* horizontal line */}

      <div className="space-y-1 text-xs">
        <div className="border-t border-gray-200 mb-3"></div>
        <div className="flex justify-between">
          <div className="flex flex-col justify-between text-gray-500">
            <span>Current Session</span>
            <span className="px-1 py-1.5 rounded-full bg-[#f2f0fd] text-center mt-2">
              {program.program.current_session_number || "0"}
            </span>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div className="flex flex-col justify-between text-gray-500">
            <span>Exit & Ground Used</span>
            <span className="px-1 py-1.5 rounded-full bg-[#eff8ff] text-center mt-2">
              {program.number_of_exits || "0"}
            </span>
          </div>
        </div>
        <div className="border-b border-gray-200 mt-3"></div>
        <div className="pt-2 text-[11px] text-black">
          Last Session: {program.program.updated_date || "N/A"}
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
