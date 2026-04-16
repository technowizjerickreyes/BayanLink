import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import FormField from "../../components/common/FormField.jsx";
import LoadingState from "../../components/common/LoadingState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { getAppointments } from "../../services/appointmentService.js";
import { formatDate, formatTimeSlot } from "../../utils/formatters.js";
import {
  canCitizenManageAppointment,
  getAppointmentOutcomeLabel,
  getAppointmentPolicyLabel,
  getAppointmentReference,
  getAppointmentScopeLabel,
  getAppointmentStatusOptions,
  isUpcomingAppointment,
  sortAppointmentsBySchedule,
} from "../../utils/appointmentUtils.js";
import { appointmentServices } from "../../utils/serviceCatalog.js";

function AppointmentHistoryCard({ item, onOpenDetails, onOpenReschedule, onOpenCancel }) {
  const canManage = canCitizenManageAppointment(item);

  return (
    <article className="appointment-history-card">
      <div className="appointment-history-top">
        <div>
          <p className="eyebrow">Reference {getAppointmentReference(item)}</p>
          <h2>{item.serviceName}</h2>
          <p>{getAppointmentOutcomeLabel(item)}</p>
        </div>
        <StatusBadge value={item.status} />
      </div>

      <div className="appointment-history-meta">
        <div>
          <small>Date</small>
          <strong>{formatDate(item.date)}</strong>
        </div>
        <div>
          <small>Time</small>
          <strong>{formatTimeSlot(item.timeSlot)}</strong>
        </div>
        <div>
          <small>Office</small>
          <strong>{getAppointmentScopeLabel(item.scope)}</strong>
        </div>
        <div>
          <small>Policy</small>
          <strong>{getAppointmentPolicyLabel(item)}</strong>
        </div>
      </div>

      <p className="appointment-history-purpose">{item.purpose}</p>

      {item.linkedRequestId?.trackingNumber && (
        <div className="appointment-inline-note">
          <strong>Linked request:</strong>
          <span>{item.linkedRequestId.trackingNumber}</span>
        </div>
      )}

      <div className="appointment-history-actions">
        <button className="button primary btn btn-success" onClick={onOpenDetails} type="button">
          View details
        </button>
        {canManage && (
          <>
            <button className="button ghost btn btn-light" onClick={onOpenReschedule} type="button">
              Reschedule
            </button>
            <button className="button ghost btn btn-light" onClick={onOpenCancel} type="button">
              Cancel
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default function AppointmentListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    serviceId: "",
    search: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getAppointments("citizen", {
          limit: 100,
          status: filters.status || undefined,
          serviceId: filters.serviceId || undefined,
          search: filters.search || undefined,
        });
        setItems(Array.isArray(response.data) ? response.data : []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [filters]);

  const upcomingItems = sortAppointmentsBySchedule(items.filter((item) => isUpcomingAppointment(item)), "asc");
  const historyItems = sortAppointmentsBySchedule(items.filter((item) => !isUpcomingAppointment(item)), "desc");
  const pendingCount = items.filter((item) => item.status === "pending").length;
  const confirmedCount = items.filter((item) => item.status === "confirmed").length;
  const completedCount = items.filter((item) => item.status === "completed").length;

  return (
    <div className="page-stack">
      <PageHeader
        action="Book Appointment"
        description="Review your upcoming visits, office decisions, and completed appointments in one clear history view."
        eyebrow="Citizen Services"
        onAction={() => navigate("/citizen/appointments/create")}
        title="Appointment History"
      />

      <div className="dashboard-mini-stat-grid appointment-stat-grid">
        <StatCard caption="Waiting for office review" icon="calendar" label="Pending" tone="coral" value={pendingCount} />
        <StatCard caption="Confirmed upcoming visits" icon="check" label="Confirmed" tone="blue" value={confirmedCount} />
        <StatCard caption="Finished appointments" icon="file" label="Completed" tone="default" value={completedCount} />
      </div>

      <SearchFilterBar>
        <FormField
          label="Search"
          onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
          placeholder="Service, purpose, or notes"
          value={filters.search}
        />
        <FormField
          label="Service"
          onChange={(event) => setFilters((current) => ({ ...current, serviceId: event.target.value }))}
          options={[{ value: "", label: "All services" }, ...appointmentServices.map((service) => ({ value: service.value, label: service.label }))]}
          type="select"
          value={filters.serviceId}
        />
        <FormField
          label="Status"
          onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
          options={getAppointmentStatusOptions(true)}
          type="select"
          value={filters.status}
        />
      </SearchFilterBar>

      {loading && <LoadingState message="Loading your appointments..." />}
      {error && <ErrorState message={error} />}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          actionLabel="Book Appointment"
          icon="calendar"
          message="Once you reserve an office visit, the full schedule and updates will appear here."
          onAction={() => navigate("/citizen/appointments/create")}
          title="No appointments yet"
        />
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <section className="appointment-section">
            <div className="appointment-section-head">
              <div>
                <p className="eyebrow">Upcoming</p>
                <h2>Your next visits</h2>
                <p>These appointments are still active and may still be changed if the schedule window allows it.</p>
              </div>
            </div>
            {upcomingItems.length > 0 ? (
              <div className="appointment-history-grid">
                {upcomingItems.map((item) => (
                  <AppointmentHistoryCard
                    item={item}
                    key={item._id}
                    onOpenCancel={() => navigate(`/citizen/appointments/${item._id}`, { state: { action: "cancel" } })}
                    onOpenDetails={() => navigate(`/citizen/appointments/${item._id}`)}
                    onOpenReschedule={() => navigate(`/citizen/appointments/${item._id}`, { state: { action: "reschedule" } })}
                  />
                ))}
              </div>
            ) : (
              <EmptyState icon="calendar" message="No active appointments match the current filters." title="No upcoming appointments" />
            )}
          </section>

          <section className="appointment-section">
            <div className="appointment-section-head">
              <div>
                <p className="eyebrow">History</p>
                <h2>Recent activity</h2>
                <p>Completed and cancelled appointments stay here for reference, follow-up, and proof of office action.</p>
              </div>
            </div>
            {historyItems.length > 0 ? (
              <div className="appointment-history-grid">
                {historyItems.map((item) => (
                  <AppointmentHistoryCard
                    item={item}
                    key={item._id}
                    onOpenCancel={() => navigate(`/citizen/appointments/${item._id}`)}
                    onOpenDetails={() => navigate(`/citizen/appointments/${item._id}`)}
                    onOpenReschedule={() => navigate(`/citizen/appointments/${item._id}`)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState icon="file" message="Past and cancelled appointments will appear here once they exist." title="No appointment history yet" />
            )}
          </section>
        </>
      )}
    </div>
  );
}
