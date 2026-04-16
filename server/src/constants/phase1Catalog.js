export const DOCUMENT_REQUEST_TYPES = [
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

export const DOCUMENT_REQUEST_TYPE_VALUES = DOCUMENT_REQUEST_TYPES.map((item) => item.value);

export const APPOINTMENT_SERVICES = [
  {
    value: "document_release",
    label: "Document Release",
    scope: "municipality",
  },
  {
    value: "civil_registry_consultation",
    label: "Civil Registry Consultation",
    scope: "municipality",
  },
  {
    value: "barangay_service_desk",
    label: "Barangay Service Desk",
    scope: "barangay",
  },
  {
    value: "permit_assistance",
    label: "Permit Assistance",
    scope: "municipality",
  },
];

export const APPOINTMENT_SERVICE_VALUES = APPOINTMENT_SERVICES.map((item) => item.value);

export const COMPLAINT_CATEGORIES = ["waste", "road_damage", "streetlight", "drainage", "noise", "public_safety", "transport", "others"];

export const NOTIFICATION_TYPES = ["document_request", "appointment", "complaint", "system"];
