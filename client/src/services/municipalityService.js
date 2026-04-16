import api from "./api";

export const getMunicipalities = async (params = {}) => {
  const { data } = await api.get("/super-admin/municipalities", { params });
  return data;
};

export const getMunicipality = async (id) => {
  const { data } = await api.get(`/super-admin/municipalities/${id}`);
  return data;
};

export const createMunicipality = async (payload) => {
  const { data } = await api.post("/super-admin/municipalities", payload);
  return data;
};

export const updateMunicipality = async (id, payload) => {
  const { data } = await api.patch(`/super-admin/municipalities/${id}`, payload);
  return data;
};

export const getMunicipalityAuditLogs = async (params = {}) => {
  const { data } = await api.get("/super-admin/audit-logs", { params });
  return data;
};

export const assignMunicipalAdmin = async (id, payload) => {
  const { data } = await api.post(`/super-admin/municipalities/${id}/municipal-admin`, payload);
  return data;
};

export const deleteMunicipality = async () => {
  throw new Error("Municipality hard delete is disabled. Use soft-delete workflow only when explicitly enabled.");
};
