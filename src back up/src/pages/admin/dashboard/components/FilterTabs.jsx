import { CalendarDays, Plus, Search } from "lucide-react";

const FilterTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["All", "Active", "Completed", "In Progress", "Flagged"];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full bg-white rounded-[30px] p-1 shadow-sm border border-gray-100 gap-4">
      
      {/* Tabs: Horizontal scroll on small screens */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] shadow-md border-3 border-red-500"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tools: Wrap or stack on mobile */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-start md:justify-end gap-4 w-full md:w-auto">
        <Search className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-semibold">29 May, 2025</span>
          <CalendarDays className="w-5 h-5 text-gray-600" />
        </div>

        <button
          className="text-white px-3 py-2 rounded-full flex items-center gap-2 transition-all duration-300 shadow-md hover:brightness-110 bg-gradient-to-b from-[#7367F0] to-[#453E90]"
        >
          <Plus className="w-4 h-4" />
          <span className="whitespace-nowrap">New Program</span>
        </button>
      </div>
    </div>
  );
};

export default FilterTabs;
