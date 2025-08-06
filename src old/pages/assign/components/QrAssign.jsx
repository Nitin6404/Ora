import React, { useCallback, useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import Navigation from "../../admin/Navigation";
import "../../patient.css";
import { ToastContainer, toast } from "react-toastify";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import UniversalTopBar from "../../../components/UniversalTopBar";

const BREADCRUMBS = [
  { name: "Assign Programs", href: "/assign/assignprogram", current: false },
  { name: "QR Code", href: "/assign/qrcode", current: true },
];

// 🌳 Main Component
export default function QrAssign() {
  const navigate = useNavigate();

  const location = useLocation();
  const patientData = location.state?.patientData;
  console.log(patientData);

  useEffect(() => {
    if (!patientData) {
      toast.error("Patient details not found");
      navigate("/assign");
    }
  }, []);

  return (
    <Navigation>
      <ToastContainer />
      <UniversalTopBar isAdd={true} addTitle="QR Code" backPath="/assign" />
      <div className="h-full flex flex-col bg-white/10 p-2 rounded-2xl gap-2">
        <BreadCrumb BREADCRUMBS={BREADCRUMBS} navigate={navigate} />

        <div className="bg-white/30 mx-2 lg:px-8 lg:py-4 rounded-xl h-[92%] flex flex-col justify-between">
          <div className="flex flex-col justify-center items-center gap-2 h-full">
            {patientData?.qrcode_image_url && (
              <div className="lg:w-[350px] w-[250px] h-auto mx-auto bg-white p-6 rounded-[24px]">
                <img
                  src={patientData?.qrcode_image_url}
                  alt="test-qr"
                  className="w-full h-full"
                />
              </div>
            )}
            <div className="mt-2 flex justify-center mx-auto w-[250px] lg:w-[350px] ">
              <button className="bg-white px-5 py-3 rounded-[24px] tracking-widest">
                {patientData?.qrcode || "6 8 2 5"}
              </button>
              {/* <button className='bg-[#7367F0] px-5 py-3 rounded-[24px]'>
                      <RefreshCcw className='text-white w-6 h-6' />
                    </button> */}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between py-3 px-2 border-t border-[#ABA4F6] gap-3">
            <button
              onClick={() => navigate(-1)}
              disabled
              className="custom-gradient-button flex justify-center items-center text-sm px-4 py-2 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto max-w-full">
              <button
                onClick={() => navigate("/assign")}
                className="patient-btn flex justify-center items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] rounded-full shadow-md gap-2"
              >
                Assign Program
              </button>
            </div>
          </div>
        </div>
      </div>
    </Navigation>
  );
}

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
