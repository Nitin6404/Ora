import React from "react";
import { DateRange } from "react-date-range";

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
      return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()} ${time}`;
    };

    const start = formatDate(dateRange[0].startDate, "00:00");
    const end = formatDate(dateRange[0].endDate, "23:59");
    onApply(start, end);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 z-[9998] flex items-center justify-center md:justify-end md:items-start md:pt-28 md:pr-14"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md shadow-md p-3 w-[90vw] max-w-[22rem] md:w-auto z-[9999]"
        onClick={(e) => e.stopPropagation()}
      >
        <DateRange
          editableDateInputs
          onChange={(item) => setDateRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={dateRange}
          className="w-full"
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
