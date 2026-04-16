import api from "./api";

const dashboardPathByRole = {
  super_admin: "/super-admin/dashboard",
  municipal_admin: "/municipal/dashboard",
  barangay_admin: "/barangay/dashboard",
  citizen: "/citizen/dashboard",
};

export const getDashboardData = async (role) => {
  const path = dashboardPathByRole[role] || dashboardPathByRole.citizen;
  const { data } = await api.get(path);
  return data;
};

export const getDashboardSummary = getDashboardData;
