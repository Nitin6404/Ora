import { formatDate } from "../utils/format_date";
import PlayPauseIcon from "../pages/media/components/PlayPauseIcon";
import { EllipsisVertical, Play } from "lucide-react";

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
  { name: "Programs Details", href: "/programs/editprogram", current: true },
  {
    name: "Questionnaire",
    href: "/programs/edit-decision-tree-flow",
    current: false,
  },
];

const TONE_PREFERENCE_CHOICES = [
  { id: 1, name: "Calm" },
  { id: 2, name: "Friendly" },
  { id: 3, name: "Professional" },
  { id: 4, name: "Casual" },
  { id: 5, name: "Energetic" },
];

const SOLFEGGIO_FREQUENCY = [
  { id: 1, name: "250 Hz", value: "250hz" },
  { id: 2, name: "528 Hz", value: "528hz" },
  { id: 3, name: "741 Hz", value: "741hz" },
  { id: 4, name: "1100 Hz", value: "1100hz" },
  { id: 5, name: "1440 Hz", value: "1440hz" },
];

const NO_OF_SESSIONS = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
];

const TOP_BAR_COMPONENT = [];

const DASHBOARD_FILTER_OPTIONS = [
  { id: "All", label: "All", isActive: true },
  { id: "Active", label: "Active", isActive: false },
  { id: "Completed", label: "Completed", isActive: false },
  // { id: "Flagged", label: "Flagged", isActive: false },
];

const ASSIGNMENT_FILTER_OPTIONS = [
  { id: "All", label: "All", isActive: true },
  { id: "Active", label: "Active", isActive: false },
  { id: "Completed", label: "Completed", isActive: false },
  { id: "Flagged", label: "Flagged", isActive: false },
];

const PROGRAM_FILTER_OPTIONS = [
  { id: "all", label: "All", isActive: true },
  { id: "published", label: "Published", isActive: false },
  { id: "draft", label: "Draft", isActive: false },
];

const PATIENT_FILTER_OPTIONS = [
  { id: "all", label: "All", isActive: true },
  { id: "active", label: "Active", isActive: false },
  { id: "inactive", label: "Inactive", isActive: false },
];

const USERS_FILTER_OPTIONS = [
  { id: "patient", label: "Patient", isActive: true },
  { id: "admin", label: "Admin", isActive: false },
];

const GENDER_DROPDOWN = [
  { name: "Male", value: "male" },
  { name: "Female", value: "female" },
  { name: "Other", value: "other" },
];

const MEDIA_TYPE = [
  { name: "Audio", value: "mp3" },
  { name: "Video", value: "mp4" },
];

const MEDIA_FILTER_OPTIONS = [
  { id: "audio", label: "Audio", isActive: true },
  { id: "video", label: "Video", isActive: false },
];

const AUDIO_COLUMN = [
  { key: "id", label: "ID", render: (p) => p.id },
  { key: "title", label: "Title", render: (p) => p.title },
  {
    key: "uploaded_at",
    label: "Uploaded At",
    render: (p) => formatDate(p.uploaded_at),
  },
  {
    key: "audio_s3_url",
    label: "Audio",
    render: (row) => (
      <PlayPauseIcon
        url={row.audio_s3_url}
        id={row.id}
        playingAudioId={playingAudioId}
        setPlayingAudioId={setPlayingAudioId}
        audioRef={audioRef}
      />
    ),
  },
  {
    key: "action",
    label: "Action",
    render: (row) => (
      <EllipsisVertical
        className="hover:cursor-pointer w-5 h-5"
        onClick={() => {}}
      />
    ),
  },
];

const VIDEO_COLUMN = [
  { key: "id", label: "ID", render: (p) => p.id },
  { key: "title", label: "Title", render: (p) => p.title },
  {
    key: "uploaded_at",
    label: "Uploaded At",
    render: (p) => formatDate(p.uploaded_at),
  },
  {
    key: "video_s3_url",
    label: "Video",
    render: (p) => (
      <Play className="w-5 h-5 text-green-600 hover:cursor-pointer" />
    ),
  },
  {
    key: "action",
    label: "Action",
    render: (row) => (
      <EllipsisVertical
        className="hover:cursor-pointer w-5 h-5"
        onClick={() => {}}
      />
    ),
  },
];

const USER_COLUMN = [
  {
    key: "first_name",
    label: "First Name",
    render: (p) => p.first_name || "NA",
  },
  { key: "last_name", label: "Last Name", render: (p) => p.last_name || "NA" },
  { key: "id", label: "ID" },
  {
    key: "role_names",
    label: "Role",
    render: (p) => p.role_names.join(", ") || "NA",
  },
  { key: "gender", label: "Gender", render: (p) => p.gender || "NA" },
  {
    key: "date_of_birth",
    label: "DOB",
    render: (p) => {
      const date = new Date(p.date_of_birth);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
  },
  {
    key: "email",
    label: "Email",
    render: (p) => p.email || "NA",
  },
  { key: "phone_no", label: "Phone", render: (p) => p.phone_no || "NA" },
  {
    key: "created_date",
    label: "Created At",
    render: (p) => new Date(p.created_date).toLocaleDateString() || "NA",
  },
  {
    key: "actions",
    label: "Actions",
    render: (p) => {
      return (
        <div className="relative">
          {/* <button
              className=""
              onClick={() => {
                fetchUserDetails(p.id);
                setIsModalOpen(true);
              }}
            >
              <img src="/tilde-icon.png" alt="" />
            </button> */}
          <button
            onClick={() => {}}
            className="text-gray-500 hover:text-gray-700 dropdown-trigger"
          >
            <EllipsisVertical size={18} />
          </button>
        </div>
      );
    },
  },
];

const USER_FORM_FIELD = [
  { key: "first_name", label: "First Name", type: "text" },
  { key: "middle_name", label: "Middle Name", type: "text" },
  { key: "last_name", label: "Last Name", type: "text" },
  { key: "date_of_birth", label: "Date of Birth", type: "date" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone_no", label: "Phone", type: "number" },
  { key: "password", label: "Password", type: "password" },
  { key: "gender", label: "Gender", type: "select", options: GENDER_DROPDOWN },
];

const EDIT_DECISION_FLOW_BREADCRUMBS = [
  { name: "Programs Details", href: "/programs/editprogram", current: false },
  {
    name: "Questionnaire",
    href: "/programs/edit-decision-tree-flow",
    current: true,
  },
];

export {
  CONDITION_OPTIONS,
  DURATION_OPTIONS,
  TARGET_GROUP_OPTIONS,
  BREADCRUMBS,
  TONE_PREFERENCE_CHOICES,
  SOLFEGGIO_FREQUENCY,
  NO_OF_SESSIONS,
  ASSIGNMENT_FILTER_OPTIONS,
  PROGRAM_FILTER_OPTIONS,
  PATIENT_FILTER_OPTIONS,
  GENDER_DROPDOWN,
  MEDIA_TYPE,
  MEDIA_FILTER_OPTIONS,
  AUDIO_COLUMN,
  VIDEO_COLUMN,
  USER_COLUMN,
  USER_FORM_FIELD,
  USERS_FILTER_OPTIONS,
  DASHBOARD_FILTER_OPTIONS,
  EDIT_DECISION_FLOW_BREADCRUMBS,
};
