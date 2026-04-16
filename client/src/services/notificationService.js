import api from "./api";

export function getNotificationBasePath(role) {
  if (role === "municipal_admin") return "/municipal/notifications";
  if (role === "barangay_admin") return "/barangay/notifications";
  return "/citizen/notifications";
}

export const getNotifications = async (role, params = {}) => {
  const { data } = await api.get(getNotificationBasePath(role), { params });
  return data;
};

export const markNotificationRead = async (role, id) => {
  const { data } = await api.patch(`${getNotificationBasePath(role)}/${id}/read`);
  return data;
};

export const markAllNotificationsRead = async (role) => {
  const { data } = await api.patch(`${getNotificationBasePath(role)}/read-all`);
  return data;
};
