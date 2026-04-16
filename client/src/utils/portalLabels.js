export const portalByRole = {
  super_admin: {
    name: "Super Admin Portal",
    home: "/super-admin/dashboard",
  },
  municipal_admin: {
    name: "Municipal Admin Portal",
    home: "/municipal/dashboard",
  },
  barangay_admin: {
    name: "Barangay Portal",
    home: "/barangay/dashboard",
  },
  citizen: {
    name: "Citizen Portal",
    home: "/citizen/dashboard",
  },
};

export function getPortalName(role) {
  return portalByRole[role]?.name || "BayanLink Portal";
}
