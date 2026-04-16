import api from "./api";

export function getComplaintBasePath(role) {
  if (role === "municipal_admin") return "/municipal/complaints";
  if (role === "barangay_admin") return "/barangay/complaints";
  return "/citizen/complaints";
}

export const getComplaints = async (role, params = {}) => {
  const { data } = await api.get(getComplaintBasePath(role), { params });
  return data;
};

export const getComplaint = async (id) => {
  const { data } = await api.get(`/citizen/complaints/${id}`);
  return data;
};

export const createComplaint = async (payload) => {
  const { data } = await api.post("/citizen/complaints", payload);
  return data;
};

export const updateComplaint = async (role, id, payload) => {
  const { data } = await api.patch(`${getComplaintBasePath(role)}/${id}`, payload);
  return data;
};
