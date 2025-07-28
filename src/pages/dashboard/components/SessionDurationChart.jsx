import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

const sessionDurationData = [
  { name: "<6 min", value: 5 },
  { name: "6-10 min", value: 12 },
  { name: ">10 min", value: 7 },
];

const SessionDurationChart = ({ sessionDuration = [] }) => {
  return (
    <div className="bg-[#fff] rounded-3xl shadow-sm px-5 py-4 flex flex-col justify-between w-[100%]">
      <h3 className="text-base lg:text-lg font-bold text-gray-800 mb-4 w-full">
        Session Duration
      </h3>

      <div className="h-48 w-full min-w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sessionDuration}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis dataKey="name" axisLine={true} tickLine={false} />
            {/* <YAxis axisLine={false} tickLine={false} /> */}
            <Bar
              dataKey="value"
              radius={[8, 8, 8, 8]}
              label={{
                position: "top",
                fill: "#686a6d",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              <Cell fill="#fca29a" />
              <Cell fill="#958df4" />
              <Cell fill="#ffea81" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SessionDurationChart;
