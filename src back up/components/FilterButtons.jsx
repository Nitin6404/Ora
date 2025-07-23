const FilterButtons = ({ filterOptions, handleFilterChange }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {filterOptions.map((button) => (
                <button
                    key={button.id}
                    onClick={() => handleFilterChange(button.id)}
                    className={`rounded-[1.5rem]  px-6 py-[0.68rem] gap-[0.625rem] text-[0.875rem] leading-[1.25rem] font-medium font-inter text-center ${button.isActive ?
                        "box-border flex flex-row justify-center items-center  bg-gradient-to-r from-[#574EB6] to-[#7367F0] border border-white shadow-[0.125rem_0.18rem_0.5rem_rgba(100,90,209,0.5)]  text-white"
                        : "hover:bg-[#f1f0fd] text-[#252B37] font-medium hover:text-[#7367f0] transition-all duration-500 ease-in-out"}`}

                >
                    {button.label}
                </button>
            ))}
        </div>
    )
}

export default FilterButtons;