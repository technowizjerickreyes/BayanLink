export const documentRequestTypes = [
  {
    value: "barangay_clearance",
    label: "Barangay Clearance",
    description: "General-purpose clearance for local records and transactions.",
    scope: "barangay",
    processingDays: "1-2 business days",
    feeLabel: "PHP 50",
    requirements: ["Valid government ID", "Proof of residence"],
  },
  {
    value: "certificate_of_indigency",
    label: "Certificate of Indigency",
    description: "Certification for citizens requesting welfare-related assistance.",
    scope: "barangay",
    processingDays: "1 business day",
    feeLabel: "Free",
    requirements: ["Valid government ID", "Request letter or intake note"],
  },
  {
    value: "business_permit_assistance",
    label: "Business Permit Assistance",
    description: "Initial document intake and support for local business permit processing.",
    scope: "municipality",
    processingDays: "3-5 business days",
    feeLabel: "Varies by permit",
    requirements: ["Valid government ID", "Business name and address", "Supporting requirements"],
  },
  {
    value: "residency_certificate",
    label: "Residency Certificate",
    description: "Certification confirming municipal or barangay residency.",
    scope: "barangay",
    processingDays: "1 business day",
    feeLabel: "PHP 30",
    requirements: ["Valid government ID", "Proof of address"],
  },
  {
    value: "cedula_request",
    label: "Community Tax Certificate",
    description: "Request support for community tax certificate issuance.",
    scope: "municipality",
    processingDays: "Same day",
    feeLabel: "Depends on declared income",
    requirements: ["Valid government ID"],
  },
];

export const appointmentServices = [
  {
    value: "document_release",
    label: "Document Release",
    scope: "municipality",
    icon: "file",
    description: "Pick up an approved document with a reserved release window instead of waiting in line.",
    locationLabel: "Municipal records window",
    durationLabel: "15-minute visit",
    preparationLabel: "Bring a valid ID and your request reference.",
  },
  {
    value: "civil_registry_consultation",
    label: "Civil Registry Consultation",
    scope: "municipality",
    icon: "calendar",
    description: "Discuss civil registry concerns, corrections, or requirements with the proper desk.",
    locationLabel: "Municipal civil registry office",
    durationLabel: "20-minute consult",
    preparationLabel: "Bring any record copies or supporting details you already have.",
  },
  {
    value: "barangay_service_desk",
    label: "Barangay Service Desk",
    scope: "barangay",
    icon: "people",
    description: "Reserve a resident assistance slot for barangay documents, endorsements, or community concerns.",
    locationLabel: "Assigned barangay hall",
    durationLabel: "15-minute service slot",
    preparationLabel: "Prepare your resident information and supporting documents.",
  },
  {
    value: "permit_assistance",
    label: "Permit Assistance",
    scope: "municipality",
    icon: "building",
    description: "Meet the permit desk for business permit guidance, follow-ups, and submission support.",
    locationLabel: "Municipal business permit desk",
    durationLabel: "30-minute support slot",
    preparationLabel: "Bring permit requirements and any existing reference number.",
  },
];

function formatSlotLabel(value) {
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(`2000-01-01T${value}:00`));
}

export const appointmentTimeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
].map((value) => ({
  value,
  label: formatSlotLabel(value),
}));

export const complaintCategories = [
  { value: "waste", label: "Waste" },
  { value: "road_damage", label: "Road Damage" },
  { value: "streetlight", label: "Streetlight" },
  { value: "drainage", label: "Drainage" },
  { value: "noise", label: "Noise" },
  { value: "public_safety", label: "Public Safety" },
  { value: "transport", label: "Transport" },
  { value: "others", label: "Others" },
];
