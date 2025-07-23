import React, { useState, useEffect } from "react";
import axiosInstance from "../../../services/apiService";
import Navigation from "../../admin/Navigation";
import "../../patient.css";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import UniversalTopBar from "../../../components/UniversalTopBar";
import { ChevronLeft, Link } from "lucide-react";
import CustomDropdown from "../../../components/CustomDropDown";
import { TONE_PREFERENCE_CHOICES, SOLFEGGIO_FREQUENCY, NO_OF_SESSIONS } from "../../../constants";
import { API_BASE_URL as API_URL, ASSIGNMENT_ENDPOINT, PROGRAM_DROPDOWN, PATIENT_DROPDOWN, METADATA } from "../../../config/apiConfig";

const BREADCRUMBS = [
    { name: "Assign Programs", href: "/assign/assignprogram", current: true },
    { name: "QR Code", href: "/assign/qrcode", current: false },
];

export default function AssignProgram() {
    const [formData, setFormData] = useState({
        program_id: "", 
        patient_id: "", 
        environment_id: "",
        tone_preference: "", 
        solfeggio_frequency: "", 
        no_of_sessions: "", 
    });

    const [programList, setProgramList] = useState([]);
    const [patientList, setPatientList] = useState([]);
    const [environmentList, setEnvironmentList] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (next) => {
        // Basic Validation
        const requiredFields = [
            { name: "program_id", label: "Program" },
            { name: "patient_id", label: "Patient" },
            { name: "environment_id", label: "Environment" },
            { name: "tone_preference", label: "Tone Preference" },
            { name: "solfeggio_frequency", label: "Solfeggio Frequency" },
            { name: "no_of_sessions", label: "No of Sessions" },
        ];

        for (const field of requiredFields) {
            if (!formData[field.name]) {
                toast.error(`${field.label} is required.`);
                return;
            }
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const body = {
                program_id: formData.program_id,
                patient_id: formData.patient_id,
                environment_id: formData.environment_id,
                started_at: new Date().toISOString(),
                tone_preference: TONE_PREFERENCE_CHOICES.find((item) => item.id === formData.tone_preference).name,
                solfeggio_frequency: SOLFEGGIO_FREQUENCY.find((item) => item.id === formData.solfeggio_frequency).value,
                no_of_sessions: formData.no_of_sessions,
            }

            const res = await axiosInstance.post(API_URL + ASSIGNMENT_ENDPOINT,
                body, 
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if(res.status === 200 || res.status === 201){
                toast.success("Program assigned!");
                if(next){
                    navigate(next, {state: {patientData: patientList.find((item) => item.id === formData.patient_id)}});
                }else{
                    navigate("/assign");
                }
            } else{
                toast.error(res.data.message || "Failed to assign program.");
            }
            
        } catch (err) {
            console.error("❌ Error:", err.response?.data || err.message);
            toast.error(err.response?.data.message || "Failed to assign program.");
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async (endpoint) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axiosInstance.get(API_URL + endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data;
        } catch (err) {
            console.error("❌ Error:", err.response?.data || err.message);
            toast.error("Failed to fetch data.");
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
          try {
            const [metaData, programDropdown, patientDropdown] = await Promise.all([
              fetchData(METADATA),
              fetchData(PROGRAM_DROPDOWN),
              fetchData(PATIENT_DROPDOWN),
            ]);
      
            setEnvironmentList(metaData?.environments);
            setProgramList(programDropdown);
            setPatientList(patientDropdown);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
      
        fetchAllData();
      }, []);
      
    return (
        <Navigation>

            <ToastContainer />
            <div className="flex flex-col h-[100vh] font-inter" >
                <div className="sticky top-0 z-[999] px-0 py-4 lg:p-4 md:px-6 md:py-3 h-full backdrop-blur-sm md:ml-4">
                    <div className=" flex flex-col gap-2 h-full">
                        {/* <AssignTopBar isAddProgram={true} /> */}
                        <UniversalTopBar 
                            isAdd={true}
                            addTitle="Assign Program"
                            backPath="/assign" 
                        />
                        <div
                            style={{ minHeight: "500px" }}
                            className="w-full backdrop-blur-sm bg-white/10 rounded-[15px] lg:rounded-[24px] px-2 py-2 md:px-4 lg:px-3 lg:pt-2 lg:pb-8 h-[calc(100%-2rem)] lg:h-[calc(100%-7rem)]"
                        >
                            <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto rounded-full px-1 py-1 bg-white backdrop-blur-md border border-white/30 shadow-sm mb-2">
                                {BREADCRUMBS.map((item, index) => (
                                    <button
                                        key={index}
                                        className={`px-6 py-3 text-xs lg:text-sm font-medium rounded-full flex items-center gap-2
                                            ${item.current ? "bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white shadow-md " : "bg-white text-[#252B37] hover:text-[#574EB6] hover:bg-[#E3E1FC]"}
                                            }`}
                                        onClick={() => {
                                            if(!formData.program_id || !formData.patient_id || !formData.environment_id || !formData.tone_preference || !formData.solfeggio_frequency || !formData.no_of_sessions){
                                                toast.error("Please select all fields.");
                                                return;
                                            }
                                            else navigate(item.href, {state: {patientData: patientList.find((item) => item.id === formData.patient_id)}})
                                        }}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col justify-between bg-white/30 mx-2 md:mx-4 lg:px-8 lg:py-4 !rounded-[15px] lg:rounded-[16px] my-6 h-[calc(100%-6rem)] lg:h-[calc(100%-4rem)] overflow-y-scroll no-scrollbar">
                                <div className="flex flex-col gap-4 p-2">
                                    <div className="flex flex-col md:flex-row justify-start items-end gap-2 lg:gap-6 h-full px-2 md:p-0">
                                        <div className="flex flex-col w-full lg:w-[20em]">
                                            <CustomDropdown
                                                label="Program"
                                                options={programList || []}
                                                selected={programList.find((item) => item.id === formData.program_id)?.name || ""}
                                                onSelect={(value) => setFormData({ ...formData, program_id: value })}
                                            />
                                        </div>

                                        <div className="hidden md:flex h-full items-end">
                                            <Link className="h-12 w-12 text-white bg-[#7367F0] rounded-lg flex items-center justify-center p-3" />
                                        </div>

                                        <div className="flex flex-col w-full lg:w-[20em]">
                                            <CustomDropdown
                                                label="Patient"
                                                options={patientList || []}
                                                selected={patientList.find((item) => item.id === formData.patient_id)?.full_name || ""}
                                                onSelect={(value) => setFormData({ ...formData, patient_id: value })}
                                            />
                                        </div>
                                    </div>

                                    {formData.program_id && formData.patient_id && (
                                        <>
                                            <div className="w-full flex justify-center items-center gap-2">
                                                <span className="text-[#252B37] text-nowrap">Session Details</span>
                                                <div className="h-[1px] w-full bg-[#ABA4F6]" />
                                            </div>

                                            <div className="flex flex-col md:flex-row justify-start items-center gap-2 md:gap-10 px-2 md:p-0 ">
                                                {environmentList.length > 0 && (
                                                    <div className="flex flex-col w-full md:w-[20em]">
                                                        <CustomDropdown
                                                            label="Environment"
                                                            options={environmentList}
                                                            selected={environmentList.find((item) => item.id === formData.environment_id)?.name}
                                                            onSelect={(value) => setFormData({ ...formData, environment_id: value })}
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex flex-col w-full md:w-[20em]">
                                                    <CustomDropdown
                                                        label="Tone Preference"
                                                        options={TONE_PREFERENCE_CHOICES}
                                                        selected={TONE_PREFERENCE_CHOICES.find((item) => item.id === formData.tone_preference)?.name}
                                                        onSelect={(value) => setFormData({ ...formData, tone_preference: value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row justify-start items-center gap-2 md:gap-10 px-2 md:p-0 ">
                                                <div className="flex flex-col w-full md:w-[20em]">
                                                    <CustomDropdown
                                                        label="Solfeggio Frequency"
                                                        options={SOLFEGGIO_FREQUENCY}
                                                        selected={SOLFEGGIO_FREQUENCY.find((item) => item.id === formData.solfeggio_frequency)?.name}
                                                        onSelect={(value) => setFormData({ ...formData, solfeggio_frequency: value })}
                                                    />
                                                </div>
                                                <div className="flex flex-col w-full md:w-[20em]">
                                                    <CustomDropdown
                                                        label="No of Sessions"
                                                        options={NO_OF_SESSIONS}
                                                        selected={NO_OF_SESSIONS.find((item) => item.id === formData.no_of_sessions)?.name}
                                                        onSelect={(value) => setFormData({ ...formData, no_of_sessions: value })}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="w-full mx-auto flex flex-col gap-4 sm:flex-row md:justify-between p-3 md:pt-6 md:px-3 lg:px-0 border-t border-[#ABA4F6]">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="custom-gradient-button !w-fit ">
                                        <ChevronLeft className="w-5 h-5" />
                                        <span>Back</span>
                                    </button>

                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto max-w-full">
                                        <button
                                            onClick={() => handleSubmit("/assign/qrcode")}
                                            className="patient-btn max-w-full px-6 py-3 text-xs lg:text-sm font-medium text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] rounded-full shadow-md flex items-center gap-2">
                                            <span>Submit</span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Navigation>
    );
}

