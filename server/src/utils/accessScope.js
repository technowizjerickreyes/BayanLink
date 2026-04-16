import ApiError from "./ApiError.js";

function stringValue(value) {
  return String(value || "");
}

export function assertOperationalRole(user) {
  if (!user) {
    throw new ApiError(401, "Authentication required");
  }

  if (!["citizen", "barangay_admin", "municipal_admin"].includes(user.role)) {
    throw new ApiError(403, "This action is outside your role scope");
  }
}

export function getManagementScopeFilter(user, fieldMap = {}) {
  assertOperationalRole(user);

  const municipalityField = fieldMap.municipalityId || "municipalityId";
  const barangayField = fieldMap.barangayId || "barangayId";

  if (user.role === "municipal_admin") {
    return {
      [municipalityField]: user.municipalityId,
    };
  }

  if (user.role === "barangay_admin") {
    return {
      [municipalityField]: user.municipalityId,
      [barangayField]: user.barangayId,
    };
  }

  throw new ApiError(403, "You do not have permission to manage this resource");
}

export function getCitizenScopeFilter(user, fieldMap = {}) {
  assertOperationalRole(user);

  const citizenField = fieldMap.citizenId || "citizenId";

  if (user.role !== "citizen") {
    throw new ApiError(403, "Citizen scope is required");
  }

  return {
    [citizenField]: user._id,
  };
}

export function ensureSameMunicipality(user, municipalityId) {
  if (stringValue(user.municipalityId) !== stringValue(municipalityId)) {
    throw new ApiError(403, "This record is outside your municipality scope");
  }
}

export function ensureSameBarangay(user, barangayId) {
  if (stringValue(user.barangayId) !== stringValue(barangayId)) {
    throw new ApiError(403, "This record is outside your barangay scope");
  }
}
