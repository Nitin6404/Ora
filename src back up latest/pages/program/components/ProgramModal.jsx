import React from "react";
import { User, Zap, AlertTriangle, CircleCheckBig, Clock3 } from "lucide-react";
import { formatDate } from "../../../utils/format_date";
import ModalWrapper from "../../../components/ModalWrapper";
import "../../patient.css";

const getStatusColor = (status, flagged) => {
  if (flagged) return "bg-red-100 text-red-700";
  if (status === "published") return "bg-[#70eba8] text-green-700";
  if (status === "draft") return "bg-[#d6d7db] text-[#333]";
  if (status === "In Progress") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
};
const ProgramModal = ({ isOpen, onClose, programData = {} }) => {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      Header={
        <>
          <h1 className="hidden lg:block text-xl font-semibold text-gray-800">
            Assigned Patients
          </h1>
          <h2 className="hidden lg:block text-xl font-semibold text-gray-800">
            Onboarding Questionnaire Responses
          </h2>
        </>
      }
    >
      <ProgramInfoCard data={programData?.program_info || {}} />
      <AssignedPatientList patients={programData?.assigned_patients || []} />
      <QuestionnaireCard questions={programData?.questionnaire || []} />
    </ModalWrapper>
  );
};

const ProgramInfoCard = ({ data }) => {
  return (
    <>
      {data && Object.keys(data).length > 0 ? (
        <div className="bg-white rounded-xl p-6 space-y-2 font-medium text-gray-500">
          <div className="flex flex-col items-center justify-between">
            <div className="flex items-center justify-between w-full">
              <div className="text-black flex flex-col space-y-1 text-sm font-medium">
                <span className="text-gray-600 text-sm flex flex-col md:flex-row gap-x-1">
                  <span>Last Updated: </span>
                  <span> {formatDate(data?.updated_date) || "N/A"}</span>
                </span>
                <span>ORA-00{data?.id || "N/A"}</span>
              </div>
              <span
                className={`px-1 py-1 rounded-full text-xs font-medium flex justify-center items-center  ${getStatusColor(
                  data?.status,
                  data?.flagged
                )}`}
              >
                <div className="mr-1 bg-white rounded-full w-6 h-6 flex items-center justify-center">
                  {data.flagged && <AlertTriangle className="w-4 h-4" />}
                  {data.status === "published" && (
                    <CircleCheckBig className="w-4 h-4" />
                  )}
                  {data.status === "draft" && <Zap className="w-4 h-4" />}
                  {data.status === "In Progress" && (
                    <Clock3 className="w-4 h-4" />
                  )}
                </div>
                <span className="pr-3 pl-1 uppercase">{data.status}</span>
              </span>
            </div>
            <div className="flex items-center justify-start w-full pt-3">
              <span className="text-[#7367f0] text-lg md:text-2xl font-medium">
                {data.name || "N/A"}
              </span>
            </div>
          </div>
          <Divider />
          <div className="flex flex-col items-start justify-start text-black">
            <span className="text-sm">Condition Type</span>
            <span className="font-medium text-lg">
              {data.condition_type || "N/A"}
            </span>
          </div>
          <Divider />
          <div className="p-2 bg-[#f1f1fd] rounded-xl">
            <AdvisorInfo advisor={data.advisor || []} />
          </div>
          <InfoRow
            label="Target Group"
            value={data.target_group || "N/A"}
            className="bg-[#dff0fe] text-blue-600"
          />
          <InfoRow
            label="Estimate Duration"
            value={data.estimate_duration || "N/A"}
            className="text-black font-bold"
          />
          <Divider />
          <ProgramDetailCard
            title="Therapy Goal"
            description={data.therapy_goal || "N/A"}
          />
          <Divider />
          <ProgramDetailCard
            title="Program Description"
            description={data.program_description || "N/A"}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 flex flex-1 items-center justify-center h-full w-full ">
          <span className="text-gray-600">No data available</span>
        </div>
      )}
    </>
  );
};
const AdvisorInfo = ({ advisor }) => {
  return (
    <div className="font-medium text-black w-full flex items-center">
      <InfoRow
        label={advisor.advisor_type}
        value={advisor.name || "N/A"}
        className="bg-white"
      />
    </div>
  );
};
const ProgramDetailCard = ({ title, description }) => {
  return (
    <div className="py-1 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const AssignedPatientList = ({ patients }) => {
  return (
    <div className="flex flex-col items-start justify-start text-black bg-white rounded-xl p-6 h-full w-full">
      <FilterBar options={["In Progress", "Completed", "Flagged"]} />
      <Divider className="h-[3px]" />
      <div className="flex flex-col items-start justify-start text-black w-full h-full">
        {patients.length > 0 ? (
          patients.map((patient, index) => (
            <PatientInfoRow key={index} patient={patient} />
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center h-full w-full bg-[#f1f1fd] rounded-xl mt-3">
            <span className="text-gray-600">No patients assigned</span>
          </div>
        )}
      </div>
    </div>
  );
};
const PatientInfoRow = ({ patient }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center justify-start gap-2 w-full">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          {patient.profile_image ? (
            <img
              src={patient.profile_image}
              alt={patient.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={24} />
            </div>
          )}
        </div>
        <div className="flex flex-col items-start justify-start p-2">
          <span className="font-medium flex items-center text-xl">
            {patient.full_name || "N/A"}
          </span>
          <span className="text-gray-700 text-sm">
            ORA-00{patient.patient_id || "N/A"}
          </span>
        </div>
      </div>
      <div className="w-6 h-6">
        <img
          src="/tilde-icon.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

const QuestionnaireCard = ({ questions }) => {
  return (
    <div className="bg-white rounded-xl p-6 flex flex-col items-start justify-start text-black h-full w-full">
      <FilterBar options={["Questions Analytics", "Questions"]} />
      <Divider className="h-[3px]" />
      {questions.length > 0 ? (
        <>
          <QuestionCard
            label="Overall Response Rate"
            analytics={true}
            questions={questions}
          />
          <QuestionCard
            label="Top-Level Answer Trend (for each question)"
            analytics={false}
            questions={questions}
          />
        </>
      ) : (
        <div className="flex items-center justify-center h-full w-full bg-[#f1f1fd] rounded-xl mt-3">
          <span className="text-gray-600">No questions found</span>
        </div>
      )}
    </div>
  );
};
const QuestionCard = ({ label, analytics, questions }) => {
  const analyticsQuestions = [
    {
      question: "Average Time to complete",
      answer: "7 Min 45 Sec",
    },
    {
      question: "Average Time to complete",
      answer: "7 Min 45 Sec",
    },
  ];
  return (
    <div className="flex flex-col items-start justify-start w-full">
      <span className="flex items-center text-md py-2">{label}</span>
      {/* <Divider /> */}
      <div className="flex flex-col items-start justify-start w-full bg-[#f1f1fd] p-2 rounded-xl ">
        {analytics ? (
          <>
            <div className="flex items-center justify-between w-full py-2">
              <span className="font-medium flex items-center text-sm">
                Metric
              </span>
              <span className="font-medium flex items-center text-sm">
                Response
              </span>
            </div>
            <Divider />
            {analyticsQuestions.map((question, index) => (
              <QuestionRow key={index} question={question} analytics={true} />
            ))}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between w-full py-2">
              <span className="font-medium flex items-center text-sm">
                Question
              </span>
              <div className="flex items-center gap-5">
                <span className="font-medium flex items-center text-sm">
                  Option A
                </span>
                <span className="font-medium flex items-center text-sm">
                  Option B
                </span>
              </div>
            </div>
            <Divider />
            {questions.map((question, index) => (
              <QuestionRow key={index} question={question} analytics={false} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
const QuestionRow = ({ question, analytics }) => {
  return (
    <div className="flex items-center justify-between w-full py-1">
      <div className="flex items-center text-sm w-2/3">
        {question.question || "N/A"}
      </div>
      {analytics ? (
        <span className="text-sm">{question.answer || "N/A"}</span>
      ) : (
        <div className="flex justify-center items-center gap-5 w-1/3">
          {question.answers.map((answer, index) => (
            <span
              className="text-gray-700 text-sm uppercase text-nowrap"
              key={index}
            >
              {answer.label || "N/A"}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterBar = ({ options = [] }) => {
  const [selectedOption, setSelectedOption] = React.useState(options[0]);
  return (
    <>
      {options.length > 0 && (
        <div className="flex items-center justify-start gap-4 w-full pb-3 ">
          {options.map((option, index) => (
            <button
              onClick={() => setSelectedOption(option)}
              className={`px-4 py-2 text-xs lg:text-sm rounded-full flex items-center gap-2
                            ${
                              selectedOption === option
                                ? "bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white shadow-md"
                                : "bg-white text-black hover:bg-gray-100 hover:text-black"
                            }
                            `}
              key={index}
            >
              <span className="flex items-center">{option}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
};
const InfoRow = ({ label, value, className }) => (
  <div className="flex justify-between w-full">
    <span className="text-gray-600 font-medium flex items-center">{label}</span>
    <span
      className={`font-medium px-3 py-1 rounded-full bg-white uppercase ${className}`}
    >
      {value}
    </span>
  </div>
);
const Divider = ({ className }) => (
  <div className={`h-[3px] w-full bg-gray-200 ${className}`} />
);

export default ProgramModal;
