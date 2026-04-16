import api from "./api";

export const getNewsFeeds = async () => {
  const { data } = await api.get("/news-feeds");
  return data;
};

export const getNewsFeed = async (id) => {
  const { data } = await api.get(`/news-feeds/${id}`);
  return data;
};

export const createNewsFeed = async (payload) => {
  const { data } = await api.post("/news-feeds", payload);
  return data;
};

export const updateNewsFeed = async (id, payload) => {
  const { data } = await api.put(`/news-feeds/${id}`, payload);
  return data;
};

export const deleteNewsFeed = async (id) => {
  const { data } = await api.delete(`/news-feeds/${id}`);
  return data;
};
