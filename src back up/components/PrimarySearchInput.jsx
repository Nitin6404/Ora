import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PrimarySearchInput = ({ showSearchInput, setShowSearchInput, searchTerm, setSearchTerm }) => (
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
                    className="
                            absolute right-0
                            h-[2.625rem] w-[12.5rem]
                            pl-4 py-3
                            flex items-center justify-between
                            rounded-[20px] border border-[#7367F0]
                            bg-white text-[#A4A7AE] text-[0.875rem] font-sans
                            shadow-[0px_0.125rem_0.375rem_rgba(100,90,209,0.1)]
                            outline-none
                            transition-all duration-500 ease-in-out
                            focus:[box-shadow:0_0_0_0.06rem_#7367F0]
                            placeholder:text-[#A4A7AE]
                            placeholder:font-inter
                            placeholder:text-[0.875rem]
                            placeholder:font-normal
                        "
                />
            )}
        </AnimatePresence>

        <div
            className="absolute right-1 px-3 py-3 hover:bg-[#f1f0fd] transition-all duration-500 ease-in-out rounded-full text-[#42464E] cursor-pointer"
            onClick={() => setShowSearchInput(!showSearchInput)}
        >
            <Search className="w-[1.125rem] h-[1.125rem]" />
        </div>
    </div>
)

export default PrimarySearchInput;