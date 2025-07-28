import React from "react";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import PrimaryLoader from "./PrimaryLoader";
import Pagination from "./Pagination";

export default function DataTable({
  columns = [],
  data = [],
  currentPage = 1,
  pageCount = 1,
  onPageChange = () => { },
  renderActions = () => null,
  loading = false,
}) {
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center py-10 h-full w-full">
          <PrimaryLoader />
        </div>
      ) : (
        <>
          {Array.isArray(data) && data.length > 0 ? (
            // <div className="relative overflow-hidden bg-transparent h-full">
              <div className="flex flex-col h-full overflow-x-auto overflow-y-auto no-scrollbar backdrop-blur-sm  bg-red-500">
                <table className="min-w-full border-separate border-spacing-y-2 px-2 no-scrollbar overflow-y-auto h-full bg-orange-500">
                  <thead className="bg-white/35">
                    <tr className="sticky top-2 z-[999] bg-[#C7C2F9] rounded-[2.625rem] h-[3.125rem] px-[2rem] py-[1rem] text-[#181D27] text-[12px] leading-[18px] font-medium">
                      {columns.map((col, i) => (
                        <th
                          key={col.key}
                          className={`text-left px-3 py-2 ${i === 0 ? "rounded-l-[2.625rem]" : ""
                            } ${i === columns.length - 1 ? "rounded-r-[2.625rem]" : ""}
                         ${col.key === "full_name" ? "px-8" : ""}`}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto bg-cyan-500 h-full">
                    {data.map((row, rowIndex) => (
                      <tr
                        key={row.id || rowIndex}
                        className="bg-white/90 backdrop-blur-[2.5px] rounded-[2.625rem] h-[3.5rem] max-h-20 px-[2rem] py-[0.8rem] text-[#181D27] text-[12px] leading-[18px] font-medium transition hover:bg-[#E3E1FC]"
                      >
                        {columns.map((col, i) => (
                          <td
                            key={col.key}
                            className={`px-3 py-2 ${i === 0 ? "rounded-l-[2.625rem]" : ""
                              } ${i === columns.length - 1 ? "rounded-r-[2.625rem]" : ""}
                           ${col.key === "full_name" ? "pl-8" : ""}                                        
                           `}
                          >
                            {typeof col.render === "function" ? col.render(row) : row[col.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            // </div>
          ) : (
            <div className="flex justify-center items-center py-10 h-full w-full backdrop-blur-sm bg-white/10">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </>
      )}
      {/* Pagination */}
      <div className="w-full rounded-b-[24px] backdrop-blur-sm bg-white/10 py-2 no-scrollbar flex justify-center items-center">
            <div className="w-full flex px-2">
              <div className="py-2  w-full bg-white/35 rounded-[24px] flex justify-between items-center gap-2">
                {/* Pagination Controls */}
                {pageCount > 0 ? (
                  <Pagination pageCount={pageCount} currentPage={currentPage} handlePageChange={onPageChange} />
                ) : (
                  <div className="flex justify-center items-center w-full gap-2">
                    {Array.isArray(data) && data.length > 0 ? (
                      <PrimaryLoader />
                    ) : (
                      <p className="text-gray-500">No page found</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
    </>
  );
}
