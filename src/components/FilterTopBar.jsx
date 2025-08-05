import React, { useEffect, useState } from "react";
import { Plus, Calendar, RotateCcw, Search } from "lucide-react";
import FilterButtons from "./FilterButtons";
import PrimarySearchInput from "./PrimarySearchInput";
import { formatDate } from "../utils/format_date";

/**
 * A reusable component for a filter bar with search, date, and action buttons.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.filterOptions - Array of filter button configurations. E.g., [{ id: 'All', label: 'All', isActive: true }]
 * @param {Function} props.onFilterChange - Callback function when a filter is changed. Receives filter ID.
 * @param {Function} props.onSearchChange - Callback function for search input changes. Receives search term.
 * @param {string} props.startDate - Start date for date range filter.
 * @param {string} props.endDate - End date for date range filter.
 * @param {Function} props.onDateSelect - Callback function when a date is selected.
 * @param {Function} props.onResetFilters - Callback function to reset all filters.
 * @param {Function} props.onAddClick - Callback function for the "Add" button click.
 * @param {string} props.addButtonText - Text to display on the "Add" button.
 * @param {string} props.searchPlaceholder - Placeholder text for the search input.
 * @returns {JSX.Element} The rendered FilterTopBar component.
 */
const FilterTopBar = ({
  filterOptions,
  onFilterChange,
  onSearchChange,
  startDate,
  endDate,
  onDateSelect,
  onAddClick,
  addButtonText = "Add New",
  searchPlaceholder = "Search...",
  handleReset,
  isDashboard = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(searchTerm);
    }
  }, [searchTerm]);

  const handleResetFilter = () => {
    if (handleReset) {
      handleReset();
      setSearchTerm("");
      setShowSearchInput(false);
    } else window.location.reload();
  };

  return (
    <div
      className={`w-full backdrop-blur-sm bg-white/10 overflow-x-auto no-scrollbar px-2
        ${isDashboard ? "rounded-[1.875rem] py-2" : "rounded-t-[1.875rem] pt-2"}
        `}
    >
      <div className="bg-white p-1 rounded-[1.875rem] flex flex-row items-center justify-between overflow-x-auto lg:gap-4 md:gap-2 gap-1 w-full no-scrollbar">
        {/* Filter Buttons */}
        <div className="flex items-center lg:gap-2 md:gap-1 gap-1">
          <FilterButtons
            filterOptions={filterOptions}
            handleFilterChange={onFilterChange}
          />
        </div>

        {/* Search, Date Picker & Add Button */}
        <div className="flex lg:gap-2 md:gap-1 gap-0.5 items-center">
          <div className="relative flex items-center pl-6">
            <PrimarySearchInput
              showSearchInput={showSearchInput}
              setShowSearchInput={setShowSearchInput}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

          {onDateSelect && (
            <div className="relative">
              <button
                onClick={onDateSelect}
                className={`px-4 py-2 flex rounded-full items-center gap-0.5 md:gap-1 lg:gap-2 text-xs md:text-base font-inter text-[#181D27] hover:text-[#7367F0] transition
                  ${startDate && endDate ? "bg-[#C7C2F9]" : ""}`}
              >
                <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-5 lg:h-5 inline-block" />
                {startDate && endDate ? (
                  <span className="text-nowrap text-[0.5rem] md:text-[0.6rem] lg:text-[0.8rem]">
                    {formatDate(startDate)} - {formatDate(endDate)}
                  </span>
                ) : (
                  <span className="text-nowrap text-[0.5rem] md:text-[0.6rem] lg:text-[0.8rem]">
                    MM-DD-YYYY
                  </span>
                )}
              </button>
            </div>
          )}

          <div className="p-1">
            <button
              onClick={handleResetFilter}
              className="p-1 md:p-1 lg:p-2 rounded-full bg-[#f4f3ff] text-[#7367F0] hover:bg-[#e4e3fc] transition shadow-sm border border-[#e0ddff] flex items-center justify-center"
              title="Reset Filters"
            >
              <RotateCcw className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
            </button>
          </div>

          {onAddClick && (
            <button
              onClick={onAddClick}
              className="rounded-full md:px-6 px-3 lg:py-[0.75rem] md:py-[0.5rem] py-[0.35rem] gap-[0.625rem] text-[0.525rem] md:text-[0.625rem] lg:text-[0.875rem] leading-[1.25rem] font-medium font-inter text-center box-border flex flex-row justify-center items-center bg-gradient-to-r from-[#574EB6] to-[#7367F0] hover:from-[#352F6E] hover:to-[#352F6E] border border-white shadow-[0.125rem_0.1875rem_0.5rem_rgba(100,90,209,0.5)] text-white hover:shadow-[0px_0.1875rem_0.5rem_rgba(100,90,209,0.5)] w-full text-nowrap"
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
              {addButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterTopBar;
