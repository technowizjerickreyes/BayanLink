import { appointmentServices, appointmentTimeSlots } from "./serviceCatalog.js";

const CHANGE_WINDOW_HOURS = 12;

function padDatePart(value) {
  return String(value).padStart(2, "0");
}

function toLocalDateInputValue(date) {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
}

function parseAppointmentDate(value) {
  if (!value) return null;

  if (typeof value === "string") {
    const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) {
      return match[1];
    }
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return toLocalDateInputValue(date);
}

export function formatInputDate(value) {
  return parseAppointmentDate(value);
}

export function getAppointmentServiceDefinition(serviceId) {
  return appointmentServices.find((service) => service.value === serviceId) || appointmentServices[0];
}

export function getAppointmentScopeLabel(scope) {
  return scope === "barangay" ? "Barangay service desk" : "Municipal office";
}

export function getAppointmentReference(item) {
  if (!item?._id) {
    return "Pending reference";
  }

  return `APT-${String(item._id).slice(-8).toUpperCase()}`;
}

export function createQuickAppointmentDates(days = 7) {
  return Array.from({ length: days }, (_value, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + index);

    return {
      value: toLocalDateInputValue(date),
      shortLabel: new Intl.DateTimeFormat("en", { weekday: "short" }).format(date),
      fullLabel: new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date),
    };
  });
}

export function getAppointmentDateTime(item) {
  if (!item?.date || !item?.timeSlot) {
    return null;
  }

  return new Date(`${formatInputDate(item.date)}T${item.timeSlot}:00`);
}

export function canCitizenManageAppointment(item) {
  if (!item || !["pending", "confirmed"].includes(item.status)) {
    return false;
  }

  const schedule = getAppointmentDateTime(item);

  if (!schedule) {
    return false;
  }

  return schedule.getTime() - Date.now() >= CHANGE_WINDOW_HOURS * 60 * 60 * 1000;
}

export function getAppointmentPolicyLabel(item) {
  return canCitizenManageAppointment(item) ? "Changes still allowed" : "Changes locked within 12 hours";
}

export function getAppointmentStatusOptions(includeAllOption = true) {
  const options = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return includeAllOption ? [{ value: "", label: "All statuses" }, ...options] : options;
}

export function buildAppointmentSlotState({ availability, selectedTimeSlot = "" }) {
  const bookedMap = new Map((availability?.bookedItems || []).map((item) => [item.timeSlot, item]));

  return appointmentTimeSlots.map((slot) => {
    const booking = bookedMap.get(slot.value) || null;
    const isSelected = slot.value === selectedTimeSlot;
    const isBooked = Boolean(booking) && !isSelected;

    return {
      ...slot,
      booking,
      isBooked,
      isSelected,
      statusLabel: isSelected ? "Selected" : isBooked ? "Booked" : "Available",
    };
  });
}

export function getAppointmentAvailabilitySummary(availability) {
  const totalSlots = appointmentTimeSlots.length;
  const bookedCount = availability?.bookedCount || 0;

  return {
    totalSlots,
    bookedCount,
    openCount: Math.max(totalSlots - bookedCount, 0),
  };
}

export function sortAppointmentsBySchedule(items, direction = "asc") {
  const factor = direction === "desc" ? -1 : 1;

  return [...items].sort((left, right) => {
    const leftTime = getAppointmentDateTime(left)?.getTime() || 0;
    const rightTime = getAppointmentDateTime(right)?.getTime() || 0;
    return (leftTime - rightTime) * factor;
  });
}

export function isUpcomingAppointment(item) {
  const schedule = getAppointmentDateTime(item);

  if (!schedule) {
    return false;
  }

  return schedule.getTime() >= Date.now() && ["pending", "confirmed"].includes(item.status);
}

export function getAppointmentOutcomeLabel(item) {
  switch (item?.status) {
    case "pending":
      return "Awaiting office confirmation";
    case "confirmed":
      return "Confirmed by the office";
    case "completed":
      return "Completed visit";
    case "cancelled":
      return "Cancelled appointment";
    default:
      return "Appointment update";
  }
}

export function getWeekDates(anchorValue) {
  const anchor = anchorValue ? new Date(`${anchorValue}T00:00:00`) : new Date();
  anchor.setHours(0, 0, 0, 0);

  const day = anchor.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() + diffToMonday);

  return Array.from({ length: 7 }, (_value, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    return {
      value: toLocalDateInputValue(date),
      label: new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(date),
      weekday: new Intl.DateTimeFormat("en", { weekday: "long" }).format(date),
    };
  });
}

export function getWeekBounds(anchorValue) {
  const week = getWeekDates(anchorValue);

  return {
    start: week[0]?.value || "",
    end: week[week.length - 1]?.value || "",
  };
}

export function groupAppointmentsByDate(items) {
  return items.reduce((groups, item) => {
    const key = formatInputDate(item.date) || "unknown";

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(item);
    return groups;
  }, {});
}
