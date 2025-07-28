import {
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
  } from "lucide-react";
  
  const getPages = (currentPage, totalPages) => {
    const pages = [];
  
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
  
    return pages;
  };
  
  const Pagination = ({ pageCount, currentPage, handlePageChange }) => {
    const pagesToShow = getPages(currentPage, pageCount);
  
    return (
      <div className="flex flex-wrap justify-center items-center w-full gap-1 sm:gap-2 text-[0.5rem] md:text-[0.6rem] lg:text-xs">
        <button
          className="lg:w-[1.8rem] lg:h-[1.8rem] md:w-[1.6rem] md:h-[1.6rem] w-[1.4rem] h-[1.4rem] flex justify-center items-center bg-white/60 rounded-full disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          <ChevronsLeft size={12} />
        </button>
  
        <button
          className="lg:w-[1.8rem] lg:h-[1.8rem] md:w-[1.6rem] md:h-[1.6rem] w-[1.4rem] h-[1.4rem] flex justify-center items-center bg-white/60 rounded-full disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ChevronLeft size={12} />
        </button>
  
        {pagesToShow.map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-1 text-gray-400">...</span>
          ) : (
            <button
              key={page}
              className={`lg:w-[1.8rem] lg:h-[1.8rem] md:w-[1.6rem] md:h-[1.6rem] w-[1.4rem] h-[1.4rem] flex justify-center items-center rounded-full font-medium ${page === currentPage
                ? "bg-[#7367F0] text-white"
                : "bg-white/60 text-[#252B37]"
                }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          )
        )}
  
        <button
          className="lg:w-[1.8rem] lg:h-[1.8rem] md:w-[1.6rem] md:h-[1.6rem] w-[1.4rem] h-[1.4rem] flex justify-center items-center bg-white/60 rounded-full disabled:opacity-50"
          disabled={currentPage === pageCount}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <ChevronRight size={12} />
        </button>
  
        <button
          className="lg:w-[1.8rem] lg:h-[1.8rem] md:w-[1.6rem] md:h-[1.6rem] w-[1.4rem] h-[1.4rem] flex justify-center items-center bg-white/60 rounded-full disabled:opacity-50"
          disabled={currentPage === pageCount}
          onClick={() => handlePageChange(pageCount)}
        >
          <ChevronsRight size={12} />
        </button>
      </div>
    );
  };
  
  export default Pagination;
  