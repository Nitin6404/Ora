import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../../admin/Navigation";
import "../../patient.css";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import CustomFileUploader from "../../../components/CustomFileUploader";
import ProgramTopBar from "./ProgramTopBar";
import { ChevronLeft, Loader2 } from "lucide-react";
import CustomDropdown from "../../../components/CustomDropDown";

const CONDITION_OPTIONS = [
    { name: "Oncology", subtitle: "Cancer-related conditions" },
    { name: "Anxiety", subtitle: "Mental health support" },
    { name: "Pain", subtitle: "Chronic & acute pain" },
];

const DURATION_OPTIONS = [
    { name: "0-5 Mins", subtitle: "Short-term programs" },
    { name: "6-10 Mins", subtitle: "Standard therapy" },
    { name: "10+ Mins", subtitle: "Extended care" },
];

const TARGET_GROUP_OPTIONS = [
    { name: "Adults", subtitle: "18+ years", value: "adults" },
    { name: "Children", subtitle: "13–17 years", value: "children" },
    { name: "Seniors", subtitle: "60+ years", value: "seniors" },
    { name: "All Age Groups", subtitle: "All age groups", value: "all" },
];  

const BREADCRUMBS = [
    { name: "Programs Details", href: "/editprogram", current: true },
    { name: "Questionnaire", href: "/edit-decision-tree-flow", current: false },
];

const API_URL =
    "https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/dev/api/program/programs/";

export default function EditProgram() {
    const {id} = useParams();
    const [formData, setFormData] = useState({
        name: "",
        condition_type: "",
        estimate_duration: "",
        therapy_goal: "",
        target_group: "",
        program_description: "",
        status: "",
        is_active: true,
    });

    const [activeTab, setActiveTab] = useState("Patient Details");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const tabs = ["Patient Details"];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (isSaveAsDraft = false) => {
        // Basic Validation
        const requiredFields = [
            { name: "name", label: "Program Name" },
            { name: "condition_type", label: "Condition Type" },
            { name: "estimate_duration", label: "Estimate Duration" },
            { name: "therapy_goal", label: "Therapy Goal" },
            { name: "target_group", label: "Target Group" },
            { name: "program_description", label: "Program Description" },
        ];

        for (const field of requiredFields) {
            if (!formData[field.name]?.trim()) {
                toast.error(`${field.label} is required.`);
                return;
            }
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            const multipartData = new FormData();
            multipartData.append("name", formData.name);
            multipartData.append("condition_type", formData.condition_type);
            multipartData.append("estimate_duration", formData.estimate_duration);
            multipartData.append("therapy_goal", formData.therapy_goal);
            multipartData.append("target_group", formData.target_group);
            multipartData.append("program_description", formData.program_description);
            multipartData.append("status", isSaveAsDraft ? "draft" : "");
            multipartData.append("is_active", formData.is_active);

            if(isSaveAsDraft){
                console.log("Saving as draft");
                // append programData as empty array if isSaveAsDraft is true
                multipartData.append("programData", JSON.stringify([]));
                const res = await axios.post(API_URL, multipartData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                toast.success("Program created!");
                navigate("/programs");
            }else{
                navigate("/edit-decision-tree-flow", {state: {programDetails: formData}});
            }
        } catch (err) {
            console.error("❌ Error:", err.response?.data || err.message);
            toast.error("Failed to add program.");
        } finally {
            setLoading(false);
        }
    };

    const fetchProgramDetails = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            const res = await axios.get(`${API_URL}${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFormData(res.data);
        } catch (err) {
            console.error("❌ Error:", err.response?.data || err.message);
            toast.error("Failed to fetch program details.");
        } finally{
            setLoading(false);
        }
    }

    const handleSaveAsDraft = () => {
        handleSubmit(true);
    };

    const [showPassword, setShowPassword] = useState(false);
    const handlePasswordVisibility = () => setShowPassword((prev) => !prev);

    useEffect(() => {
        fetchProgramDetails();
    }, [id]);

    console.log(formData);  

    return (
        <Navigation>
            <ToastContainer />
            <div className="flex flex-col min-h-screen font-inter" >
                <div className="sticky top-0 z-[999] p-4 md:px-6 md:py-3 backdrop-blur-sm md:ml-4">
                    <div className=" flex flex-col gap-2">
                        <ProgramTopBar isEditProgram={true} />
                        <div
                            style={{ minHeight: "500px" }}
                            className="w-full backdrop-blur-sm bg-white/10 rounded-[15px] lg:rounded-[24px] px-2 py-2 md:px-4 lg:px-3 lg:pt-2 lg:pb-8"
                        >
                            <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto rounded-full px-1 py-1 bg-white backdrop-blur-md border border-white/30 shadow-sm mb-2">
                                {BREADCRUMBS.map((item, index) => (
                                    <button
                                        key={index}
                                        className={`px-6 py-3 text-xs lg:text-sm font-medium rounded-full flex items-center gap-2
                                            ${item.current ? "bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white shadow-md " : "bg-white text-[#252B37] hover:text-[#574EB6] hover:bg-[#E3E1FC]"}
                                            }`}
                                        onClick={() => {
                                            if(item.href === "/edit-decision-tree-flow"){
                                                handleSubmit();
                                            }else{
                                                navigate(`${item.href}/${id}`)
                                            }
                                        }}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                            <div className="bg-white/30 mx-2 md:mx-4 lg:px-8 lg:py-4 !rounded-[15px] lg:rounded-[16px] mt-6">
                                {loading ? (
                                    <div className="flex justify-center items-center py-10 w-full col-span-4">
                                    <svg
                                      className="animate-spin h-8 w-8 text-[#7367F0]"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                      ></path>
                                    </svg>
                                  </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                                    <div className="lg:space-y-4 space-y-2">
                                        <div className="flex flex-col">
                                            <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">Program Name</label>
                                            <div className="input-wrapper !rounded-[6px] !px-3">
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="input-field"
                                                    placeholder="Enter name"
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="program_description" className="text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <div className="input-wrapper !rounded-[6px] !px-3">
                                                <input
                                                    id="program_description"
                                                    name="program_description"
                                                    placeholder="Enter description"
                                                    type="text"
                                                    value={formData.program_description}
                                                    onChange={handleChange}
                                                    className="input-field"
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            {/* <label htmlFor="condition_type" className="text-sm font-medium text-gray-700 mb-1">Condition Type</label> */}
                                            <CustomDropdown
                                                label="Condition Type"
                                                options={CONDITION_OPTIONS}
                                                selected={formData.condition_type}
                                                onSelect={(item) => setFormData((prev) => ({ ...prev, condition_type: item.name }))}
                                            />
                                        </div>
                                        <div className="flex flex-col lg:flex-row gap-4 pt-6">
                                            <label className="inline-flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="is_active"
                                                    checked={formData.is_active}
                                                    onChange={handleChange}
                                                    className="h-5 w-5 text-indigo-600 bg-white border-gray-300 rounded-md focus:ring-indigo-500 transition duration-200"
                                                />
                                                <span className="text-sm text-gray-700 font-medium">Active</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="lg:space-y-4 space-y-2">
                                        <div className="flex flex-col">
                                            {/* <label htmlFor="estimate_duration" className="text-sm font-medium text-gray-700 mb-1">Estimate Duration</label> */}
                                            <CustomDropdown
                                                label="Estimate Duration"
                                                options={DURATION_OPTIONS}
                                                selected={formData.estimate_duration}
                                                onSelect={(item) => setFormData((prev) => ({ ...prev, estimate_duration: item.name }))}
                                            />
                                        </div>
                                        <div className="flex flex-col relative">
                                            <label htmlFor="therapy_goal" className="text-sm font-medium text-gray-700 mb-1">Therapy Goal</label>
                                            <div className="input-wrapper !rounded-[6px] !px-3">
                                                <input
                                                    id="therapy_goal"
                                                    name="therapy_goal"
                                                    type="text"
                                                    value={formData.therapy_goal}
                                                    onChange={handleChange}
                                                    className="input-field pr-10"
                                                    placeholder="Enter therapy goal"
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            {/* <label htmlFor="estimate_duration" className="text-sm font-medium text-gray-700 mb-1">Estimate Duration</label> */}
                                            <CustomDropdown
                                                label="Target Group"
                                                options={TARGET_GROUP_OPTIONS}
                                                selected={TARGET_GROUP_OPTIONS.find((option) => option.value === formData.target_group)?.name}
                                                onSelect={(item) => setFormData((prev) => ({ ...prev, target_group: item.value }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                                )}
                                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between pt-6 mt-16 border-t border-[#ABA4F6]">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="back-button flex items-center space-x-1 !px-3 !py-2 !w-fit">
                                        <ChevronLeft className="w-5 h-5" />
                                        <span>Back</span>
                                    </button>
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 !w-full sm:!w-auto">
                                        {/* <button
                                        onClick={() => handleSaveAsDraft()}
                                        className="back-button !w-full sm:!w-auto">
                                        Save as draft
                                        </button> */}
                                        <button
                                        onClick={() => handleSubmit(false)}
                                        disabled={loading}
                                        className="next-button !w-full sm:!w-auto">
                                        {loading ? "Updating..." : "Next"}
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

