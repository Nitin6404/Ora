
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
    { name: "Questionnaire", href: "/programs/edit-decision-tree-flow", current: false },
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

const TOP_BAR_COMPONENT = [
    
]

const ASSIGNMENT_FILTER_OPTIONS = [
    { id: 'All', label: 'All', isActive: true,},
    { id: 'Active', label: 'Active', isActive: false,},
    { id: 'Completed', label: 'Completed', isActive: false,},
    { id: 'Flagged', label: 'Flagged', isActive: false,},
];

const PATIENT_FILTER_OPTIONS = [
    { id: 'all', label: 'All', isActive: true },
    { id: 'active', label: 'Active', isActive: false },
    { id: 'inactive', label: 'Inactive', isActive: false }
];

const GENDER_DROPDOWN = [
    { name: "Male", value: "male" },
    { name: "Female", value: "female" },
    { name: "Other", value: "other" },
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
    PATIENT_FILTER_OPTIONS,
    GENDER_DROPDOWN,
}
