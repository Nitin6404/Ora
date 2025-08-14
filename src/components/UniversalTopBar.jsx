import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";

const UniversalTopBar = ({
  isAdd = false,
  isEdit = false,
  addTitle = "Add",
  editTitle = "Edit",
  defaultTitle = "Dashboard",
  backPath = -1, // Can be -1 for history back or string path like '/programs'
}) => {
  const [open, setOpen] = useState(false);

  const pageTitle = isAdd ? addTitle : isEdit ? editTitle : defaultTitle;

  const navigate = useNavigate();

  const goBack = () => {
    if (backPath === -1) navigate(-1);
    else navigate(backPath);
  };

  useEffect(() => {
    // close the dropdown when clicked outside
    const handleClickOutside = (event) => {
      if (open && !event.target.closest(".dropdown")) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="py-1 sticky inset-0 z-50 border-gray-200">
      <div className="flex flex-col justify-center items-end">
        {/* Desktop Topbar */}
        <div className="hidden lg:flex items-center justify-between w-full">
          <div className="w-full">
            {(isAdd || isEdit) && (
              <button
                onClick={goBack}
                className="flex justify-center items-center space-x-0 pl-2 pr-3 py-1 bg-white rounded-full"
              >
                <ArrowLeft color="#252B37" className="w-8 h-6" />
                <span className="text-[#252B37] font-medium text-xs w-full">
                  Back
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Avatar open={open} setOpen={setOpen} />
          </div>
        </div>

        {/* Desktop Title */}
        <div className="hidden lg:flex w-full justify-start items-center space-x-4">
          <p className="text-sm lg:text-xl text-black font-medium pt-2 ml-4">
            {pageTitle}
          </p>
        </div>

        {/* Mobile Topbar */}
        <div className="relative flex justify-between items-center w-full lg:hidden bg-transparent p-2">
          <p className="text-sm lg:text-lg text-black">{pageTitle}</p>
          <Avatar open={open} setOpen={setOpen} />
        </div>
      </div>
    </div>
  );
};

export default UniversalTopBar;
