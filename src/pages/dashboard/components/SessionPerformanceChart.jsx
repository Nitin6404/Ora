import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { EllipsisVertical } from "lucide-react";
import { useState, useEffect } from "react";

const SessionPerformanceChart = ({
  totalSessions = 0,
  sessionCompleted = 0,
  distressRaised = 0,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  const completedData = [
    { name: "Completed", value: sessionCompleted },
    { name: "Remaining", value: totalSessions - sessionCompleted },
  ];

  const distressData = [
    { name: "Distress", value: distressRaised },
    { name: "Remaining", value: totalSessions - distressRaised },
  ];

  const totalData = [
    { name: "Total", value: totalSessions },
    { name: "Dummy", value: 0 }, // Just to fill
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-[#f8f7fd] rounded-3xl shadow-sm py-2 lg:py-4 px-4 lg:px-5 border border-t-2 border-r-2 border-b-transparent border-l-transparent">
      <div className="flex justify-between items-center mb-1 lg:mb-4">
        <h3 className="text-base lg:text-lg font-semibold text-gray-800">
          Session Performance
        </h3>
        {isMobile ? (
          <div className="relative">
            <button className="p-2 rounded-full bg-transparent">
              <EllipsisVertical className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="text-sm text-[#c6c4e6] hover:underline hover:cursor-pointer">
            See more
          </div>
        )}
      </div>

      <div className="flex lg:flex-row flex-col items-center">
        <div className="h-48 w-full lg:w-[50%] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={totalData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={80}
                startAngle={450}
                endAngle={90}
              >
                <Cell fill="#938cf1" />
              </Pie>

              <Pie
                data={completedData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={65}
                startAngle={450}
                endAngle={90}
              >
                <Cell fill="#69e8a7" />
                <Cell fill="#e5e7eb" />
              </Pie>

              <Pie
                data={distressData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={50}
                startAngle={450}
                endAngle={90}
              >
                <Cell fill="#faa499" />
                <Cell fill="#e5e7eb" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-rows-3 gap-4 mt-2 lg:mt-4">
          <div className="text-start flex justify-between items-center space-x-5">
            <div className="w-2 h-full bg-[#938cf1] rounded-md" />
            <div className="text-sm text-gray-600">
              Total <br /> Sessions
            </div>
            <div className="text-2xl font-bold ">{totalSessions}</div>
          </div>
          <div className="text-start flex justify-between items-center space-x-5">
            <div className="w-2 h-full bg-[#69e8a7] rounded-md" />
            <div className="text-sm text-gray-600">
              Session <br /> Completed
            </div>
            <div className="text-2xl font-bold ">{sessionCompleted}</div>
          </div>
          <div className="text-start flex justify-between items-center space-x-5">
            <div className="w-2 h-full bg-[#faa499] rounded-md" />
            <div className="text-sm text-gray-600">
              Distress Flags <br /> Raised
            </div>
            <div className="text-2xl font-bold ">{distressRaised}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPerformanceChart;
