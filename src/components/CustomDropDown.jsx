import React, { useEffect, useRef, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import "../pages/patient.css";

const CustomDropdown = ({
  label,
  options,
  selected,
  onSelect,
  disabled,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [positionAbove, setPositionAbove] = useState(false);

  const ref = useRef(null);

  const filtered = options.filter((item) => {
    const name = item?.name || item?.full_name;
    return name?.toLowerCase().includes(search.toLowerCase());
  });

  const handleSelect = (item) => {
    setIsOpen(false);
    if (typeof item === "object") {
      if (item.id) {
        onSelect(item.id);
      } else {
        onSelect(item);
      }
    } else {
      onSelect(item);
    }
  };

  useEffect(() => {
    if (isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 250; // Estimated dropdown height
      setPositionAbove(spaceBelow < dropdownHeight);
    }
  }, [isOpen]);

  // OUt side click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full text-sm" ref={ref}>
      {label && (
        <label className="text-[0.8rem] md:text-[0.8rem] lg:text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="input-wrapper !rounded-[0.375rem] !px-3 lg:!h-12 md:!h-8 !h-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className={`input-field w-full text-left !text-gray-500 !font-medium bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm
            ${disabled && "opacity-50 cursor-not-allowed"}`}
        >
          {placeholder ? placeholder : selected || `Select ${label}`}
        </button>
        <ChevronDown className="absolute top-2/3 right-3 transform -translate-y-1/2 text-gray-400 " />
      </div>

      {isOpen && (
        <div
          className={`
          absolute z-[999] w-full
          ${positionAbove ? "bottom-full mb-2" : "mt-2"}
          bg-white border border-gray-200 rounded-xl shadow-xl px-1.5 py-3
        `}
        >
          <div className="relative">
            <Search
              className="absolute top-3 right-5 text-gray-400"
              size={16}
            />
            {/* <div className="input-wrapper"> */}
            <input
              type="text"
              className="
                lg:px-3 lg:py-2 md:px-2 md:py-1 px-2 py-1 
                rounded-[6px] border border-[#e6e6e6]
                bg-white text-[#333] text-[14px] font-sans
                transition-all duration-300
                hover:border-[#a99ef9]
                focus:border-[#7367f0]
                focus:[box-shadow:0_0_0_1px_#7367f0]
                outline-none
                w-full
                "
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* </div> */}
          </div>

          <div className="lg:my-2 md:my-1 my-1 border-b border-gray-100" />

          <div className="lg:max-h-40 md:max-h-32 max-h-28 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((item, index) => (
                <div
                  key={index}
                  className="lg:p-3 md:p-2 p-1 hover:bg-purple-50 cursor-pointer"
                  onClick={() => handleSelect(item)}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {item.name || item.full_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.subtitle || item.email}
                  </div>
                </div>
              ))
            ) : (
              <div className="lg:p-3 md:p-2 p-1 text-xs text-gray-500">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
