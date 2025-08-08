const FilterButtons = ({ filterOptions, handleFilterChange }) => {
  return (
    <div className="flex flex-row gap-2">
      {filterOptions.map((button) => (
        <button
          key={button.id}
          onClick={() => handleFilterChange(button.id)}
          className={`rounded-[1.5rem]  lg:px-6 md:px-4 px-4 lg:py-[0.68rem] md:py-[0.5rem] py-[0.3rem] lg:gap-[0.625rem] md:gap-[0.5rem] gap-[0.3rem] lg:text-[0.875rem] md:text-[0.75rem] text-[0.625rem] leading-[1.25rem] font-medium font-inter text-center 
                        ${
                          button.isActive
                            ? "box-border flex flex-row justify-center items-center  bg-gradient-to-r from-[#574EB6] to-[#7367F0] border border-white shadow-[0.125rem_0.18rem_0.5rem_rgba(100,90,209,0.5)]  text-white"
                            : "hover:bg-[#f1f0fd] text-[#252B37] font-medium hover:text-[#7367f0] transition-all duration-500 ease-in-out"
                        }`}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
