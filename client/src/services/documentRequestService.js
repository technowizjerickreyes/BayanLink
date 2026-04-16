import api from "./api";

export function getDocumentRequestBasePath(role) {
  if (role === "municipal_admin") return "/municipal/document-requests";
  if (role === "barangay_admin") return "/barangay/document-requests";
  return "/citizen/document-requests";
}

export const getDocumentRequests = async (role, params = {}) => {
  const { data } = await api.get(getDocumentRequestBasePath(role), { params });
  return data;
};

export const getDocumentRequest = async (role, id) => {
  const { data } = await api.get(`${getDocumentRequestBasePath(role)}/${id}`);
  return data;
};

export const createDocumentRequest = async (payload) => {
  const { data } = await api.post("/citizen/document-requests", payload);
  return data;
};

export const updateDocumentRequest = async (role, id, payload) => {
  const { data } = await api.patch(`${getDocumentRequestBasePath(role)}/${id}`, payload);
  return data;
};

export const trackDocumentRequest = async (trackingNumber) => {
  const { data } = await api.get(`/citizen/request-tracking/${trackingNumber}`);
  return data;
};
