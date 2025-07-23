import {
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
} from "lucide-react";

const Pagination = ({ pageCount, currentPage, handlePageChange }) => (
    <div className="flex justify-center items-center w-full gap-2">
        {/* First Page */}
        <button
            className="w-[1.75rem] h-[1.75rem] flex justify-center items-center bg-white/60 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(1)}
        >
            <ChevronsLeft size={12} className="text-[#252B37] w-[1.125rem] h-[1.125rem]" />
        </button>

        {/* Previous Page */}
        <button
            className="w-[1.75rem] h-[1.75rem] flex justify-center items-center bg-white/60 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
        >
            <ChevronLeft size={12} className="text-[#252B37] w-[1.125rem] h-[1.125rem]" />
        </button>

        {/* Page Numbers */}
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
            <button
                key={page}
                className={`w-[1.75rem] h-[1.75rem] flex justify-center items-center rounded-full font-medium text-[0.75rem] leading-[1.125rem] font-['Inter'] ${page === currentPage
                    ? "bg-[#7367F0] text-white"
                    : "bg-white/60 text-[#252B37]"
                    }`}
                onClick={() => handlePageChange(page)}
            >
                {page}
            </button>
        ))}

        {/* Next Page */}
        <button
            className="w-[1.75rem] h-[1.75rem] flex justify-center items-center bg-white/60 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === pageCount}
            onClick={() => handlePageChange(currentPage + 1)}
        >
            <ChevronRight size={12} className="text-[#252B37] w-[1.125rem] h-[1.125rem]" />
        </button>

        {/* Last Page */}
        <button
            className="w-[1.75rem] h-[1.75rem] flex justify-center items-center bg-white/60 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === pageCount}
            onClick={() => handlePageChange(pageCount)}
        >
            <ChevronsRight size={12} className="text-[#252B37] w-[1.125rem] h-[1.125rem]" />
        </button>
    </div>
)

export default Pagination
