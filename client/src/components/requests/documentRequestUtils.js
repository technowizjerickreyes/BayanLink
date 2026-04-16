import { documentRequestTypes } from "../../utils/serviceCatalog.js";
import { formatStatusLabel } from "../../utils/formatters.js";

export const citizenRequestSteps = [
  { key: "service", label: "Choose service" },
  { key: "details", label: "Your details" },
  { key: "requirements", label: "Requirements" },
  { key: "review", label: "Review" },
];

export const citizenRequestStatusOptions = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "under_review", label: "Under review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "for_pickup", label: "For pickup" },
  { value: "completed", label: "Completed" },
];

export const adminRequestStatusOptions = citizenRequestStatusOptions.filter((option) => option.value);

export const paymentStatusOptions = [
  { value: "", label: "All payment states" },
  { value: "not_applicable", label: "Not applicable" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

export function getDocumentRequestDefinition(requestType) {
  return documentRequestTypes.find((item) => item.value === requestType) || documentRequestTypes[0];
}

export function getDocumentRequestServiceOptions() {
  return documentRequestTypes.map((item) => ({ label: item.label, value: item.value }));
}

export function getDocumentScopeLabel(scope) {
  return scope === "barangay" ? "Barangay service" : "Municipal service";
}

export function normalizeDocumentFieldLabel(key = "") {
  const labels = {
    fullName: "Full name",
    birthDate: "Birth date",
    civilStatus: "Civil status",
    purpose: "Purpose",
    deliveryPreference: "Delivery preference",
    notes: "Additional notes",
  };

  return labels[key] || formatStatusLabel(key);
}

export function formatAttachmentSize(bytes) {
  const size = Number(bytes || 0);

  if (!size) {
    return "0 B";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function isImageAttachment(attachment) {
  return String(attachment?.mimeType || "").startsWith("image/");
}

export function buildCitizenRequestInitialForm(user, requestType = "") {
  return {
    requestType: requestType || documentRequestTypes[0]?.value || "",
    deliveryPreference: "pickup",
    fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    birthDate: "",
    civilStatus: "",
    purpose: "",
    notes: "",
  };
}

export function extractApiFieldErrors(error, fieldPrefix = "") {
  const apiErrors = error?.response?.data?.details?.errors;

  if (!Array.isArray(apiErrors)) {
    return {};
  }

  return apiErrors.reduce((fieldMap, item) => {
    const rawField = String(item?.field || "");
    const normalizedField = fieldPrefix && rawField.startsWith(fieldPrefix) ? rawField.slice(fieldPrefix.length) : rawField;

    if (normalizedField && item?.message && !fieldMap[normalizedField]) {
      fieldMap[normalizedField] = item.message;
    }

    return fieldMap;
  }, {});
}

export function getApiErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}

export function validateCitizenRequestStep(step, form, selectedFiles = []) {
  const errors = {};

  if (step === "service" && !form.requestType) {
    errors.requestType = "Please choose the document you want to request first.";
  }

  if (step === "details") {
    if (!String(form.fullName || "").trim()) {
      errors.fullName = "Please enter the full name that should appear on the request.";
    }

    if (String(form.fullName || "").trim().length < 2) {
      errors.fullName = "Please enter a complete full name.";
    }

    if (form.birthDate && Number.isNaN(new Date(form.birthDate).getTime())) {
      errors.birthDate = "Please choose a valid birth date.";
    }

    if (String(form.civilStatus || "").trim().length > 80) {
      errors.civilStatus = "Civil status should stay short and clear.";
    }
  }

  if (step === "requirements") {
    if (!String(form.purpose || "").trim()) {
      errors.purpose = "Please tell the office why you need this document.";
    } else if (String(form.purpose || "").trim().length < 3) {
      errors.purpose = "Please add a slightly more detailed purpose.";
    }

    if (String(form.notes || "").trim().length > 500) {
      errors.notes = "Additional notes should stay under 500 characters.";
    }

    if (selectedFiles.length > 5) {
      errors.attachments = "You can upload up to 5 supporting files only.";
    }
  }

  return errors;
}

export function validateCitizenRequestForm(form, selectedFiles = []) {
  return citizenRequestSteps.reduce((fieldMap, step) => {
    const stepErrors = validateCitizenRequestStep(step.key, form, selectedFiles);
    return { ...fieldMap, ...stepErrors };
  }, {});
}

export function getCitizenStatusTone(status) {
  if (["approved", "for_pickup", "completed"].includes(status)) {
    return "success";
  }

  if (status === "rejected") {
    return "danger";
  }

  if (status === "under_review") {
    return "info";
  }

  return "warning";
}

export function getQuickStatusActions(item) {
  const currentStatus = item?.status;

  return [
    { label: "Approve", value: "approved", disabled: currentStatus === "approved" || currentStatus === "completed" },
    { label: "Reject", value: "rejected", disabled: currentStatus === "rejected" || currentStatus === "completed" },
    { label: "Mark for pickup", value: "for_pickup", disabled: currentStatus === "for_pickup" || currentStatus === "completed" },
    { label: "Mark completed", value: "completed", disabled: currentStatus === "completed" },
  ];
}
