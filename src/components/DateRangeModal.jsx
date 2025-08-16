import React from "react";
import { DateRange } from "react-date-range";
import { XIcon } from "lucide-react";

export default function DateRangeModal({
  show,
  onClose,
  dateRange,
  setDateRange,
  onApply,
}) {
  if (!show) return null;

  const handleApply = () => {
    const formatDate = (date, time) => {
      const pad = (n) => n.toString().padStart(2, "0");
      return `${pad(date.getMonth() + 1)}/${pad(
        date.getDate()
      )}/${date.getFullYear()} ${time}`;
    };

    const start = formatDate(dateRange[0].startDate, "00:00");
    const end = formatDate(dateRange[0].endDate, "23:59");
    onApply(start, end);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 z-[9998] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md shadow-md p-3 w-fit z-[9999] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-between">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 z-[10000] cursor-pointer hover:text-red-500 transition-colors p-1"
          >
            <XIcon size={16} />
          </button>
        </div>
        <DateRange
          editableDateInputs
          onChange={(item) => setDateRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={dateRange}
          // className="w-full flex"
        />

        <button
          className="mt-3 w-full px-4 py-2 text-sm bg-[#7165f0] text-white rounded-full hover:bg-[#5e55d9]"
          onClick={handleApply}
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
}
