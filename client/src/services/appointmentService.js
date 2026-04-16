import api from "./api";

export function getAppointmentBasePath(role) {
  if (role === "municipal_admin") return "/municipal/appointments";
  if (role === "barangay_admin") return "/barangay/appointments";
  return "/citizen/appointments";
}

export const getAppointments = async (role, params = {}) => {
  const { data } = await api.get(getAppointmentBasePath(role), { params });
  return data;
};

export const getAppointment = async (role, id) => {
  const { data } = await api.get(`${getAppointmentBasePath(role)}/${id}`);
  return data;
};

export const getAppointmentAvailability = async (role, params) => {
  const { data } = await api.get(`${getAppointmentBasePath(role)}/availability`, { params });
  return data;
};

export const createAppointment = async (payload) => {
  const { data } = await api.post("/citizen/appointments", payload);
  return data;
};

export const updateAppointment = async (role, id, payload) => {
  const { data } = await api.patch(`${getAppointmentBasePath(role)}/${id}`, payload);
  return data;
};
