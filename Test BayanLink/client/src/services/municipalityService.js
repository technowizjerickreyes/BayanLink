import api from "./api";

export const getMunicipalities = async () => {
  const { data } = await api.get("/municipalities");
  return data;
};

export const getMunicipality = async (id) => {
  const { data } = await api.get(`/municipalities/${id}`);
  return data;
};

export const createMunicipality = async (payload) => {
  const { data } = await api.post("/municipalities", payload);
  return data;
};

export const updateMunicipality = async (id, payload) => {
  const { data } = await api.put(`/municipalities/${id}`, payload);
  return data;
};

export const deleteMunicipality = async (id) => {
  const { data } = await api.delete(`/municipalities/${id}`);
  return data;
};
