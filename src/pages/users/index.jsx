import React, { useEffect, useState } from "react";
import Navigation from "../../pages/admin/Navigation";
import { useNavigate } from "react-router-dom";
import { Edit2, EllipsisVertical } from "lucide-react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import PatientDashboardModal from "../patient/components/PatientModal";
import PrimaryLoader from "../../components/PrimaryLoader";
import UniversalTopBar from "../../components/UniversalTopBar";
import { USERS_FILTER_OPTIONS, USER_COLUMN } from "../../constants";
import FilterTopBar from "../../components/FilterTopBar";
import Pagination from "../../components/Pagination";
import DateRangeModal from "../../components/DateRangeModal";
import { useQuery } from "@tanstack/react-query";
import { isArrayWithValues } from "../../utils/isArrayWithValues";
import getUsers from "./helpers/getUsers";

export default function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dropdownUserId, setDropdownUserId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [filterOptions, setFilterOptions] = useState(USERS_FILTER_OPTIONS);
  const [showDateRange, setShowDateRange] = useState(false);
  const [dateRange, setDateRange] = useState([
    { startDate: startDate, endDate: endDate, key: "selection" },
  ]);
  const [activeFilter, setActiveFilter] = useState("patient");
  const navigate = useNavigate();

  const columns = USER_COLUMN.map((col) =>
    col.key === "actions"
      ? {
          ...col,
          render: (row) => (
            <EllipsisVertical
              className="hover:cursor-pointer hover:text-[#7367F0] w-5 h-5 dropdown-trigger"
              onClick={(e) => {
                if (dropdownUserId === row.id) {
                  setDropdownUserId(null);
                  return;
                }

                const rect = e.currentTarget.getBoundingClientRect();
                setDropdownPosition({
                  top: rect.bottom + window.scrollY,
                  left: rect.left + window.scrollX,
                });

                setDropdownUserId(row.id);
              }}
            />
          ),
        }
      : col
  );

  const { data, isLoading } = useQuery({
    queryKey: [
      "users",
      {
        filter: activeFilter,
        page: currentPage,
        startDate,
        endDate,
        search: debouncedSearchTerm,
      },
    ],
    queryFn: getUsers,
    keepPreviousData: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleEdit = (id) => navigate(`/users/edit/${id}`);

  const handleAddUser = () => navigate("/users/add");

  const handleReset = () => {
    setActiveFilter("patient");
    setFilterOptions((prev) =>
      prev.map((option) => ({
        ...option,
        isActive: option.id === "patient",
      }))
    );
    setCurrentPage(1);
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setStartDate(null);
    setEndDate(null);
    setDateRange([{ startDate: null, endDate: null, key: "selection" }]);
    setShowDateRange(false);
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setFilterOptions((prev) =>
      prev.map((option) => ({
        ...option,
        isActive: option.id === filterId,
      }))
    );
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => setSearchTerm(value);

  const handleDateSelect = () => setShowDateRange(!showDateRange);

  useEffect(() => {
    const closeDropdown = (e) => {
      setTimeout(() => {
        if (
          !e.target.closest(".dropdown-menu") &&
          !e.target.closest(".dropdown-trigger")
        ) {
          setDropdownUserId(null);
        }
      }, 0);
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  const users = data?.results || [];
  const pageCount = Math.ceil(data?.count / 10);

  return (
    <Navigation>
      <div className="h-full flex flex-col p-2">
        <UniversalTopBar defaultTitle="Users" />
        <FilterTopBar
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          startDate={startDate}
          endDate={endDate}
          onDateSelect={handleDateSelect}
          onAddClick={handleAddUser}
          handleReset={handleReset}
          addButtonText="Add New User"
          searchPlaceholder="Search..."
        />

        <div className="flex-1 overflow-y-auto no-scrollbar bg-white/10">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <PrimaryLoader />
            </div>
          ) : (
            <table className="min-w-full border-separate border-spacing-y-2 px-2 no-scrollbar overflow-y-auto">
              <thead className="bg-white/35">
                <tr className="sticky top-2 z-[60] bg-[#C7C2F9] rounded-[2.625rem] h-[3.125rem] px-[2rem] py-[1rem] text-[#181D27] text-[12px] leading-[18px] font-medium">
                  {columns.map((col, i) => (
                    <th
                      key={col.key}
                      className={`text-left px-3 py-2 ${
                        i === 0 ? "rounded-l-[2.625rem]" : ""
                      } ${
                        i === columns.length - 1 ? "rounded-r-[2.625rem]" : ""
                      }
                         ${col.key === "first_name" ? "pl-8" : ""}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="overflow-y-auto h-full w-full">
                {isArrayWithValues(users) ? (
                  <>
                    {users.map((row, rowIndex) => (
                      <tr
                        key={row.id || rowIndex}
                        className="bg-white/90 backdrop-blur-[2.5px] rounded-[2.625rem] h-[3.5rem] max-h-16 px-[2rem] py-[0.8rem] text-[#181D27] text-[12px] leading-[18px] font-medium transition hover:bg-[#E3E1FC]"
                      >
                        {columns.map((col, i) => (
                          <td
                            key={col.key}
                            className={`px-3 py-2 ${
                              i === 0 ? "rounded-l-[2.625rem]" : ""
                            } ${
                              i === columns.length - 1
                                ? "rounded-r-[2.625rem]"
                                : ""
                            }
                             ${col.key === "first_name" ? "pl-8" : ""}
                              ${
                                col.key === "concent_given"
                                  ? "text-nowrap text-center"
                                  : ""
                              }
                             `}
                          >
                            {typeof col.render === "function"
                              ? col.render(row)
                              : row[col.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="h-16 flex-shrink-0 z-10 bg-white/10 rounded-b-[1.875rem]">
          <div className="p-2 w-full flex h-full">
            <div className="w-full h-full bg-white/10 rounded-[1.875rem] flex justify-between items-center gap-2">
              {pageCount > 0 ? (
                <Pagination
                  pageCount={pageCount}
                  currentPage={currentPage}
                  handlePageChange={handlePageChange}
                />
              ) : (
                <div className="flex justify-center items-center w-full gap-2">
                  {users.length > 0 ? (
                    <PrimaryLoader />
                  ) : (
                    <p className="text-gray-500">No page found</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && userData && (
        <>
          <PatientDashboardModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setUserData(null);
            }}
            patientData={userData}
          />
          <div className="absolute inset-0 backdrop-blur-2xl bg-white/20 w-full h-full z-[70]" />
        </>
      )}

      {showDateRange && (
        <DateRangeModal
          show={showDateRange}
          onClose={() => setShowDateRange(false)}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onApply={(start, end) => {
            setStartDate(start);
            setEndDate(end);
            setCurrentPage(1);
          }}
        />
      )}

      {dropdownUserId && (
        <div
          className="dropdown-menu absolute bg-white z-[9999] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left - 150}px`,
            width: "160px",
          }}
        >
          <button
            onClick={() => handleEdit(dropdownUserId)}
            className="w-full flex items-center gap-2 px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
          >
            <Edit2 size={16} />
            Edit
          </button>
        </div>
      )}
    </Navigation>
  );
}
