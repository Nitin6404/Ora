const BreadCrumb = ({ BREADCRUMBS }) => {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto rounded-full px-1 py-1 bg-white backdrop-blur-md border border-white/30 shadow-sm mb-2">
      {BREADCRUMBS.map((item, index) => (
        <button
          key={index}
          className={`px-6 py-3 text-xs lg:text-sm font-medium rounded-full flex items-center gap-2
                                            ${
                                              item.current
                                                ? "bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white shadow-md "
                                                : "bg-white text-[#252B37] hover:text-[#574EB6] hover:bg-[#E3E1FC]"
                                            }
                                            }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default BreadCrumb;
