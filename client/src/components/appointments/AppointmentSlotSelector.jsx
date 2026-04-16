import { getFullName } from "../../utils/formatters.js";

export default function AppointmentSlotSelector({
  slots,
  selectedValue,
  onSelect,
  showBookingDetails = false,
  emptyMessage = "Select a date to see available time slots.",
  compact = false,
  interactive = true,
}) {
  if (!slots || slots.length === 0) {
    return <div className="appointment-empty-inline">{emptyMessage}</div>;
  }

  return (
    <div className={`appointment-slot-grid ${compact ? "compact" : ""}`}>
      {slots.map((slot) => {
        const bookedBy =
          showBookingDetails && slot.booking?.citizenId ? getFullName(slot.booking.citizenId) : slot.booking?.serviceName || "";

        return (
          <button
            className={`appointment-slot ${slot.isSelected ? "selected" : ""} ${slot.isBooked ? "booked" : "available"}`}
            disabled={!interactive || (slot.isBooked && !slot.isSelected)}
            key={slot.value}
            onClick={() => interactive && onSelect?.(slot.value)}
            type="button"
          >
            <strong>{slot.label}</strong>
            <span>{slot.statusLabel}</span>
            {bookedBy && <small>{bookedBy}</small>}
          </button>
        );
      })}
    </div>
  );
}
