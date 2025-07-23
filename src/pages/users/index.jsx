// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../services/apiService";
// import Navigation from "../../pages/admin/Navigation";
// import { useNavigate } from "react-router-dom";
// import { Edit2, EllipsisVertical, User } from "lucide-react";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";
// import PatientDashboardModal from "../patient/components/PatientModal";
// import PrimaryLoader from "../../components/PrimaryLoader";
// import UniversalTopBar from "../../components/UniversalTopBar";
// import {
//   API_BASE_URL,
//   PATIENT_ENDPOINT,
//   USER_ENDPOINT,
// } from "../../config/apiConfig";
// import { PATIENT_FILTER_OPTIONS as FILTER_OPTIONS } from "../../constants";
// import FilterTopBar from "../../components/FilterTopBar";
// import Pagination from "../../components/Pagination";
// import DateRangeModal from "../../components/DateRangeModal";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// const API_URL = API_BASE_URL + USER_ENDPOINT;

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [nextPage, setNextPage] = useState(null);
//   const [prevPage, setPrevPage] = useState(null);
//   const [pageCount, setPageCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showSearchInput, setShowSearchInput] = useState(false);

//   const [debounceTimer, setDebounceTimer] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

//   const [isDateFilterActive, setIsDateFilterActive] = useState(false);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);

//   const [dropdownPatientId, setDropdownPatientId] = useState(null);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [patientData, setUserData] = useState(null);

//   const [showDateRange, setShowDateRange] = useState(false);
//   const [dateRange, setDateRange] = useState([
//     {
//       startDate: startDate,
//       endDate: endDate,
//       key: "selection",
//     },
//   ]);

//   const [filterOptions, setFilterOptions] = useState([]);
//   const [activeFilter, setActiveFilter] = useState("all");

//   const navigate = useNavigate();

//   const columns = [
//     // { key: "full_name", label: "Patient Name", render: (p) => p.full_name.slice(0, 10) + "..." },
//     { key: "first_name", label: "First Name", render: (p) => p.first_name },
//     { key: "last_name", label: "Last Name", render: (p) => p.last_name },
//     { key: "id", label: "ID" },
//     {
//       key: "role_names",
//       label: "Role",
//       render: (p) => p.role_names.join(", "),
//     },
//     { key: "gender", label: "Gender", render: (p) => p.gender },
//     {
//       key: "date_of_birth",
//       label: "DOB",
//       render: (p) => {
//         const date = new Date(p.date_of_birth);
//         return date.toLocaleDateString("en-US", {
//           year: "numeric",
//           month: "2-digit",
//           day: "2-digit",
//         });
//       },
//     },
//     {
//       key: "email",
//       label: "Email",
//       render: (p) => p.email,
//     },
//     { key: "phone_no", label: "Phone" },
//     {
//       key: "created_date",
//       label: "Created At",
//       render: (p) => new Date(p.created_date).toLocaleDateString(),
//     },
//     {
//       key: "actions",
//       label: "Actions",
//       render: (p) => {
//         const handleClick = (e) => {
//           if (dropdownPatientId === p.id) {
//             setDropdownPatientId(null);
//             return;
//           }

//           const rect = e.currentTarget.getBoundingClientRect();
//           setDropdownPosition({
//             top: rect.bottom + window.scrollY,
//             left: rect.left + window.scrollX,
//           });

//           setDropdownPatientId(p.id);
//         };

//         return (
//           <div className="relative">
//             <button
//               className=""
//               onClick={() => {
//                 fetchUserDetails(p.id);
//                 setIsModalOpen(true);
//               }}
//             >
//               <img src="/tilde-icon.png" alt="" />
//             </button>
//             <button
//               onClick={handleClick}
//               className="text-gray-500 hover:text-gray-700 dropdown-trigger"
//             >
//               <EllipsisVertical size={18} />
//             </button>
//           </div>
//         );
//       },
//     },
//   ];

//   const fetchusers = async (url = API_URL, filter = activeFilter, page = 1) => {
//     setLoading(true);

//     try {
//       let fullUrl = url;

//       // if (url === API_URL) {
//       const params = new URLSearchParams();
//       if (filter === "active") params.append("is_active", "true");
//       if (filter === "inactive") params.append("is_active", "false");
//       params.append("page", page);
//       if (startDate) {
//         params.append("start_date", startDate);
//         params.append("end_date", endDate);
//       }
//       if (debouncedSearchTerm) {
//         console.log("search", debouncedSearchTerm);
//         params.append("search", debouncedSearchTerm);
//       }
//       fullUrl = `${API_URL}?${params.toString()}`;
//       // }
//       // params.append("page", page);

//       const res = await axiosInstance.get(fullUrl);

//       setUsers(res.data.results);
//       setNextPage(res.data.next);
//       setPrevPage(res.data.previous);
//       setPageCount(Math.ceil(res.data.count / 10));
//       setCurrentPage(page);
//     } catch (err) {
//       console.error(
//         "❌ Failed to fetch users:",
//         err.response?.data || err.message
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     fetchusers(API_URL, activeFilter, page);
//   };

//   const handleEdit = (id) => {
//     navigate(`/users/edit/${id}`);
//   };

//   const handleAddPatient = () => {
//     navigate("/users/add");
//   };

//   const fetchUserDetails = async (id) => {
//     try {
//       const res = await axiosInstance.get(`${USER_ENDPOINT}${id}/`);
//       setUserData(res.data);
//       // console.log(res.data);
//     } catch (err) {
//       console.error(
//         "❌ Failed to fetch user details:",
//         err.response?.data || err.message
//       );
//     }
//   };

//   const handleFilterChange = (filterId) => {
//     setActiveFilter(filterId);
//     setFilterOptions((prev) =>
//       prev.map((option) => ({
//         ...option,
//         isActive: option.id === filterId,
//       }))
//     );
//     fetchusers(API_URL, filterId, 1);
//   };

//   const handleSearchChange = (searchValue) => {
//     setSearchTerm(searchValue);
//     if (debounceTimer) clearTimeout(debounceTimer);

//     const timer = setTimeout(() => {
//       setDebouncedSearchTerm(searchValue);
//       fetchusers(API_URL, activeFilter, 1);
//     }, 400);

//     setDebounceTimer(timer);
//   };

//   const handleDateSelect = () => {
//     setShowDateRange(!showDateRange);
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       // Delay to let dropdown render before checking click
//       setTimeout(() => {
//         if (
//           !e.target.closest(".dropdown-menu") &&
//           !e.target.closest(".dropdown-trigger")
//         ) {
//           setDropdownPatientId(null);
//         }
//       }, 0);
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (debouncedSearchTerm.trim().length > 0) {
//       fetchusers(API_URL, activeFilter, 1);
//     } else {
//       fetchusers(API_URL, activeFilter, 1);
//     }
//   }, [debouncedSearchTerm, startDate, endDate]);

//   useEffect(() => {
//     fetchusers(API_URL, activeFilter, currentPage);
//   }, []);

//   return (
//     <Navigation>
//       <div className="h-full flex flex-col p-2">
//         <UniversalTopBar defaultTitle="Users" />
//         {/* <div className="flex w-full bg-white/30 rounded-t-[1.875rem] pt-2 px-2 h-16"> */}
//         <FilterTopBar
//           filterOptions={filterOptions}
//           onFilterChange={handleFilterChange}
//           onSearchChange={handleSearchChange}
//           startDate={startDate}
//           endDate={endDate}
//           onDateSelect={handleDateSelect}
//           onAddClick={handleAddPatient}
//           addButtonText="Add New User"
//           searchPlaceholder="Search..."
//         />
//         {/* </div> */}
//         <div className="flex-1 overflow-y-auto no-scrollbar bg-white/10">
//           {/* {loading ? (
//             <div className="flex justify-center items-center h-full">
//               <PrimaryLoader />
//             </div>
//           ) : (
//             <table className="min-w-full border-separate border-spacing-y-2 px-2 no-scrollbar overflow-y-auto">
//               <thead className="bg-white/35">
//                 <tr className="sticky top-2 z-[60] bg-[#C7C2F9] rounded-[2.625rem] h-[3.125rem] px-[2rem] py-[1rem] text-[#181D27] text-[12px] leading-[18px] font-medium">
//                   {columns.map((col, i) => (
//                     <th
//                       key={col.key}
//                       className={`text-left px-3 py-2 ${
//                         i === 0 ? "rounded-l-[2.625rem]" : ""
//                       } ${
//                         i === columns.length - 1 ? "rounded-r-[2.625rem]" : ""
//                       }
//                          ${col.key === "full_name" ? "px-8" : ""}`}
//                     >
//                       {col.label}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="overflow-y-auto h-full w-full">
//                 {Array.isArray(users) && users.length > 0 ? (
//                   <>
//                     {users.map((row, rowIndex) => (
//                       <tr
//                         key={row.id || rowIndex}
//                         className="bg-white/90 backdrop-blur-[2.5px] rounded-[2.625rem] h-[3.5rem] max-h-16 px-[2rem] py-[0.8rem] text-[#181D27] text-[12px] leading-[18px] font-medium transition hover:bg-[#E3E1FC]"
//                       >
//                         {columns.map((col, i) => (
//                           <td
//                             key={col.key}
//                             className={`px-3 py-2 ${
//                               i === 0 ? "rounded-l-[2.625rem]" : ""
//                             } ${
//                               i === columns.length - 1
//                                 ? "rounded-r-[2.625rem]"
//                                 : ""
//                             }
//                              ${col.key === "full_name" ? "pl-8" : ""}
//                               ${
//                                 col.key === "concent_given"
//                                   ? "text-nowrap text-center"
//                                   : ""
//                               }
//                              `}
//                           >
//                             {typeof col.render === "function"
//                               ? col.render(row)
//                               : row[col.key]}
//                           </td>
//                         ))}
//                       </tr>
//                     ))}
//                   </>
//                 ) : (
//                   <tr>
//                     <td colSpan={columns.length} className="text-center">
//                       No users found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           )} */}
//         </div>

//         {/* Pagination */}
//         <div className="h-16 flex-shrink-0  z-10 bg-white/10 rounded-b-[1.875rem]">
//           <div className="p-2 w-full flex h-full">
//             <div className="w-full h-full bg-white/10 rounded-[1.875rem] flex justify-between items-center gap-2">
//               {/* Pagination Controls */}
//               {pageCount > 0 ? (
//                 <Pagination
//                   pageCount={pageCount}
//                   currentPage={currentPage}
//                   handlePageChange={handlePageChange}
//                 />
//               ) : (
//                 <div className="flex justify-center items-center w-full gap-2">
//                   {Array.isArray(users) && users.length > 0 ? (
//                     <PrimaryLoader />
//                   ) : (
//                     <p className="text-gray-500">No page found</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {isModalOpen &&
//         (patientData ? (
//           <>
//             <PatientDashboardModal
//               isOpen={isModalOpen}
//               onClose={() => {
//                 setIsModalOpen(false);
//                 setUserData(null);
//               }}
//               patientData={patientData}
//             />
//             <div className="absolute inset-0 backdrop-blur-2xl bg-white/20 w-full h-full z-[70]" />
//           </>
//         ) : (
//           <div className="absolute inset-0 flex items-center justify-center backdrop-blur-2xl bg-white/20 w-full h-full z-[100]">
//             <PrimaryLoader />
//           </div>
//         ))}

//       {showDateRange && (
//         <DateRangeModal
//           show={showDateRange}
//           onClose={() => setShowDateRange(false)}
//           dateRange={dateRange}
//           setDateRange={setDateRange}
//           onApply={(start, end) => {
//             setStartDate(start);
//             setEndDate(end);
//             fetchusers(API_URL, activeFilter, 1);
//           }}
//         />
//       )}

//       {dropdownPatientId && (
//         <div
//           className="dropdown-menu absolute bg-white z-[9999] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1"
//           style={{
//             top: `${dropdownPosition.top}px`,
//             left: `${dropdownPosition.left - 150}px`, //adjust left based on width
//             width: "160px",
//           }}
//         >
//           <button
//             onClick={() => handleEdit(dropdownPatientId)}
//             className="w-full flex items-center gap-2 px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
//           >
//             <Edit2 size={16} />
//             Edit
//           </button>
//         </div>
//       )}
//     </Navigation>
//   );
// }

import React, { useEffect, useState } from "react";
import Navigation from "../../pages/admin/Navigation";
import { useNavigate } from "react-router-dom";
import { Edit2, EllipsisVertical } from "lucide-react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import PatientDashboardModal from "../patient/components/PatientModal";
import PrimaryLoader from "../../components/PrimaryLoader";
import UniversalTopBar from "../../components/UniversalTopBar";
import { API_BASE_URL, USER_ENDPOINT } from "../../config/apiConfig";
import {
  PATIENT_FILTER_OPTIONS as FILTER_OPTIONS,
  USER_COLUMN,
} from "../../constants";
import FilterTopBar from "../../components/FilterTopBar";
import Pagination from "../../components/Pagination";
import DateRangeModal from "../../components/DateRangeModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../services/apiService";

const API_URL = API_BASE_URL + USER_ENDPOINT;

const fetchUsers = async ({ queryKey }) => {
  const [, { filter, page, startDate, endDate, search }] = queryKey;

  const params = new URLSearchParams();
  if (filter === "active") params.append("is_active", "true");
  if (filter === "inactive") params.append("is_active", "false");
  params.append("page", page);
  if (startDate) {
    params.append("start_date", startDate);
    params.append("end_date", endDate);
  }
  if (search) params.append("search", search);

  const res = await axiosInstance.get(`${API_URL}?${params.toString()}`);
  return res.data;
};

const fetchUserDetails = async (id) => {
  const res = await axiosInstance.get(`${USER_ENDPOINT}${id}/`);
  return res.data;
};

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
  const [showDateRange, setShowDateRange] = useState(false);
  const [dateRange, setDateRange] = useState([
    { startDate: startDate, endDate: endDate, key: "selection" },
  ]);
  const [activeFilter, setActiveFilter] = useState("all");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const columns = USER_COLUMN.map((col) =>
    col.key === "actions"
      ? {
          ...col,
          render: (row) => (
            <EllipsisVertical
              className="hover:cursor-pointer hover:text-[#7367F0] w-5 h-5"
              onClick={(e) => {
                console.log(row.id);
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
    queryFn: fetchUsers,
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

  const handleUserDetails = async (id) => {
    const data = await fetchUserDetails(id);
    setUserData(data);
    setIsModalOpen(true);
  };

  const handleFilterChange = (filterId) => setActiveFilter(filterId);

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

  console.log(dropdownUserId);
  return (
    <Navigation>
      <div className="h-full flex flex-col p-2">
        <UniversalTopBar defaultTitle="Users" />
        <FilterTopBar
          filterOptions={FILTER_OPTIONS}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          startDate={startDate}
          endDate={endDate}
          onDateSelect={handleDateSelect}
          onAddClick={handleAddUser}
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
                {Array.isArray(users) && users.length > 0 ? (
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
