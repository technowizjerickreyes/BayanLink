import api from "./api";

export function getNewsFeedBasePath(role) {
  if (role === "municipal_admin") return "/municipal/news-feeds";
  if (role === "barangay_admin") return "/barangay/news-feeds";
  if (role === "citizen") return "/citizen/news-feed";
  return "/news-feeds";
}

export const getNewsFeeds = async (role, params = {}) => {
  const { data } = await api.get(getNewsFeedBasePath(role), { params });
  return data;
};

export const getNewsFeed = async (role, id) => {
  const { data } = await api.get(`${getNewsFeedBasePath(role)}/${id}`);
  return data;
};

export const createNewsFeed = async (role, payload) => {
  const { data } = await api.post(getNewsFeedBasePath(role), payload);
  return data;
};

export const updateNewsFeed = async (role, id, payload) => {
  const { data } = await api.patch(`${getNewsFeedBasePath(role)}/${id}`, payload);
  return data;
};

export const archiveNewsFeed = async (role, id) => {
  const { data } = await api.delete(`${getNewsFeedBasePath(role)}/${id}`);
  return data;
};

export const deleteNewsFeed = archiveNewsFeed;
