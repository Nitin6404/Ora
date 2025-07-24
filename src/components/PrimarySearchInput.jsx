import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PrimarySearchInput = ({
  showSearchInput,
  setShowSearchInput,
  searchTerm,
  setSearchTerm,
}) => (
  <div className="relative flex items-center">
    <AnimatePresence>
      {showSearchInput && (
        <motion.input
          key="search-input"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 180, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`
                            absolute right-0
                            lg:h-[2.625rem] lg:w-[12.5rem]
                            md:h-[2rem] md:w-[12rem]
                            h-[1.5rem] w-[8rem]
                            lg:pl-4 lg:py-3
                            md:pl-2 md:py-2
                            py-4 px-4
                            flex items-center justify-between
                            rounded-[1.25rem] border border-[#7367F0]
                            bg-white text-[#A4A7AE] text-[0.875rem] font-sans
                            shadow-[0px_0.125rem_0.375rem_rgba(100,90,209,0.1)]
                            outline-none
                            transition-all duration-500 ease-in-out
                            focus:[box-shadow:0_0_0_0.06rem_#7367F0]
                            placeholder:text-[#A4A7AE]
                            placeholder:font-inter
                            placeholder:text-[0.875rem]
                            placeholder:font-normal
                            `}
        />
      )}
    </AnimatePresence>

    <div
      className="absolute right-1 p-1 md:p-2 lg:p-3 hover:bg-[#f1f0fd] transition-all duration-500 ease-in-out rounded-full text-[#42464E] cursor-pointer"
      onClick={() => setShowSearchInput(!showSearchInput)}
    >
      <Search className="w-3 md:w-3 lg:w-[1.125rem] h-3 md:h-3 lg:h-[1.125rem]" />
    </div>
  </div>
);

export default PrimarySearchInput;
