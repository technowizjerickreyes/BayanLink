import { formatStatusLabel } from "../../utils/formatters.js";

const phonePattern = /^[0-9+()\-.\s]{7,32}$/;
const codePattern = /^[A-Za-z0-9_-]+$/;

export const municipalityProtectedFieldDefinitions = [
  { key: "code", label: "Municipality Code" },
  { key: "name", label: "Municipality Name" },
  { key: "province", label: "Province" },
  { key: "region", label: "Region" },
];

export const municipalityEditableFieldDefinitions = [
  { key: "officialEmail", label: "Official Email" },
  { key: "officialContactNumber", label: "Official Contact Number" },
  { key: "officeAddress", label: "Office Address" },
  { key: "logoUrl", label: "Logo URL" },
  { key: "status", label: "Status" },
];

export const municipalityStatusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const municipalitySortOptions = [
  { label: "Newest first", value: "-createdAt" },
  { label: "Oldest first", value: "createdAt" },
  { label: "Name A-Z", value: "name" },
  { label: "Name Z-A", value: "-name" },
  { label: "Province A-Z", value: "province" },
  { label: "Province Z-A", value: "-province" },
  { label: "Status", value: "status" },
];

export const municipalityInitialForm = {
  code: "",
  name: "",
  province: "",
  region: "",
  officialEmail: "",
  officialContactNumber: "",
  officeAddress: "",
  logoUrl: "",
  status: "active",
};

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch (_error) {
    return false;
  }
}

function normalizeString(value) {
  return String(value || "").trim();
}

export function getMunicipalityFieldLabel(field) {
  const match = [...municipalityProtectedFieldDefinitions, ...municipalityEditableFieldDefinitions].find((item) => item.key === field);
  return match?.label || formatStatusLabel(field);
}

export function getMunicipalityFormValues(source = {}) {
  return {
    ...municipalityInitialForm,
    ...source,
    code: normalizeString(source.code),
    name: normalizeString(source.name),
    province: normalizeString(source.province),
    region: normalizeString(source.region),
    officialEmail: normalizeString(source.officialEmail),
    officialContactNumber: normalizeString(source.officialContactNumber),
    officeAddress: normalizeString(source.officeAddress),
    logoUrl: normalizeString(source.logoUrl),
    status: source.status || "active",
  };
}

export function buildMunicipalityCreatePayload(form) {
  return {
    code: normalizeString(form.code).toUpperCase(),
    name: normalizeString(form.name),
    province: normalizeString(form.province),
    region: normalizeString(form.region),
    officialEmail: normalizeString(form.officialEmail).toLowerCase(),
    officialContactNumber: normalizeString(form.officialContactNumber),
    officeAddress: normalizeString(form.officeAddress),
    logoUrl: normalizeString(form.logoUrl),
    status: form.status || "active",
  };
}

export function buildMunicipalityUpdatePayload(form) {
  return {
    officialEmail: normalizeString(form.officialEmail).toLowerCase(),
    officialContactNumber: normalizeString(form.officialContactNumber),
    officeAddress: normalizeString(form.officeAddress),
    logoUrl: normalizeString(form.logoUrl),
    status: form.status || "active",
  };
}

export function validateMunicipalityForm(form, mode = "create") {
  const errors = {};
  const values = mode === "edit" ? buildMunicipalityUpdatePayload(form) : buildMunicipalityCreatePayload(form);

  if (mode === "create") {
    if (!values.code) {
      errors.code = "Municipality code is required.";
    } else if (!codePattern.test(values.code) || values.code.length < 2 || values.code.length > 32) {
      errors.code = "Use 2 to 32 letters, numbers, underscores, or hyphens.";
    }

    if (!values.name || values.name.length < 2) {
      errors.name = "Municipality name is required.";
    }

    if (!values.province || values.province.length < 2) {
      errors.province = "Province is required.";
    }

    if (!values.region || values.region.length < 2) {
      errors.region = "Region is required.";
    }
  }

  if (!values.officialEmail) {
    errors.officialEmail = "Official email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.officialEmail)) {
    errors.officialEmail = "Enter a valid official email address.";
  }

  if (!values.officialContactNumber) {
    errors.officialContactNumber = "Official contact number is required.";
  } else if (!phonePattern.test(values.officialContactNumber)) {
    errors.officialContactNumber = "Enter a valid contact number.";
  }

  if (!values.officeAddress || values.officeAddress.length < 2) {
    errors.officeAddress = "Office address is required.";
  }

  if (values.logoUrl && !isValidUrl(values.logoUrl)) {
    errors.logoUrl = "Enter a valid logo URL including https://";
  }

  if (!["active", "inactive"].includes(values.status)) {
    errors.status = "Select a valid municipality status.";
  }

  return errors;
}

export function extractApiFieldErrors(error) {
  const apiErrors = error?.response?.data?.details?.errors;

  if (!Array.isArray(apiErrors)) {
    return {};
  }

  return apiErrors.reduce((fieldMap, item) => {
    if (item?.field && item?.message && !fieldMap[item.field]) {
      fieldMap[item.field] = item.message;
    }

    return fieldMap;
  }, {});
}

export function getApiErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || fallbackMessage;
}

export function formatAuditValue(value) {
  if (value === null || value === undefined || value === "") {
    return "Not set";
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Not set";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

export function formatAuditActionLabel(actionType = "") {
  return formatStatusLabel(actionType.replace("municipality_", "").replace("municipal_admin_", "admin "));
}

export function getAuditActorLabel(log) {
  const actor = log?.actorUserId;

  if (actor?.firstName || actor?.lastName) {
    return [actor.firstName, actor.lastName].filter(Boolean).join(" ");
  }

  if (actor?.email) {
    return actor.email;
  }

  return log?.actorRole ? formatStatusLabel(log.actorRole) : "System";
}
