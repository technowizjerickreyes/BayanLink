import connectDB from "../config/db.js";
import Appointment from "../models/Appointment.js";
import ComplaintReport from "../models/ComplaintReport.js";
import DocumentRequest from "../models/DocumentRequest.js";
import DocumentRequestTimeline from "../models/DocumentRequestTimeline.js";
import Notification from "../models/Notification.js";
import Municipality from "../models/Municipality.js";
import User from "../models/User.js";

await connectDB();

const municipalEmail = process.env.SEED_MUNICIPAL_ADMIN_EMAIL || "municipal.admin@bayanlink.local";
const barangayEmail = process.env.SEED_BARANGAY_ADMIN_EMAIL || "barangay.admin@bayanlink.local";
const citizenEmail = process.env.SEED_CITIZEN_EMAIL || "citizen@bayanlink.local";

const [municipalAdmin, barangayAdmin, citizen] = await Promise.all([
  User.findOne({ email: municipalEmail }).lean(),
  User.findOne({ email: barangayEmail }).lean(),
  User.findOne({ email: citizenEmail }).lean(),
]);

if (!municipalAdmin || !barangayAdmin || !citizen) {
  console.error("Seed portal users are required. Run npm run seed:portal-users first.");
  process.exit(1);
}

const municipality = await Municipality.findById(citizen.municipalityId).lean();

if (!municipality) {
  console.error("Citizen municipality was not found.");
  process.exit(1);
}

const appointment = await Appointment.findOneAndUpdate(
  { citizenId: citizen._id, serviceId: "document_release", date: new Date("2026-05-02T00:00:00.000Z"), timeSlot: "10:00" },
  {
    $set: {
      citizenId: citizen._id,
      serviceId: "document_release",
      serviceName: "Document Release",
      municipalityId: citizen.municipalityId,
      barangayId: "",
      scope: "municipality",
      date: new Date("2026-05-02T00:00:00.000Z"),
      timeSlot: "10:00",
      endTimeSlot: "10:30",
      status: "confirmed",
      purpose: "Pickup for approved clearance",
      notes: "Seeded Phase 1 appointment",
      createdByRole: "citizen",
      history: [
        {
          status: "pending",
          remarks: "Appointment requested online.",
          changedByUserId: citizen._id,
          changedByRole: "citizen",
          changedAt: new Date("2026-04-20T08:00:00.000Z"),
        },
        {
          status: "confirmed",
          remarks: "Appointment approved for release window.",
          changedByUserId: municipalAdmin._id,
          changedByRole: "municipal_admin",
          changedAt: new Date("2026-04-21T09:00:00.000Z"),
        },
      ],
    },
  },
  { upsert: true, new: true, runValidators: true }
);

const documentRequest = await DocumentRequest.findOneAndUpdate(
  { trackingNumber: "DOC-SEED-0001" },
  {
    $set: {
      scope: "barangay",
      requestType: "barangay_clearance",
      serviceName: "Barangay Clearance",
      citizenId: citizen._id,
      municipalityId: citizen.municipalityId,
      barangayId: citizen.barangayId,
      submittedData: {
        fullName: `${citizen.firstName} ${citizen.lastName}`,
        purpose: "Employment requirement",
        deliveryPreference: "pickup",
      },
      attachments: [],
      trackingNumber: "DOC-SEED-0001",
      status: "for_pickup",
      remarks: "Bring one valid ID upon pickup.",
      assignedTo: barangayAdmin._id,
      paymentStatus: "not_applicable",
      appointmentId: appointment._id,
      pickupSchedule: new Date("2026-05-02T10:00:00.000Z"),
      reviewedAt: new Date("2026-04-21T09:00:00.000Z"),
    },
  },
  { upsert: true, new: true, runValidators: true }
);

await DocumentRequestTimeline.deleteMany({ requestId: documentRequest._id });
await DocumentRequestTimeline.insertMany([
  {
    requestId: documentRequest._id,
    actorUserId: citizen._id,
    actorRole: "citizen",
    fromStatus: null,
    toStatus: "pending",
    remarks: "Request submitted online.",
    visibility: "public",
    createdAt: new Date("2026-04-20T08:00:00.000Z"),
  },
  {
    requestId: documentRequest._id,
    actorUserId: barangayAdmin._id,
    actorRole: "barangay_admin",
    fromStatus: "pending",
    toStatus: "approved",
    remarks: "Verified residence and supporting details.",
    visibility: "public",
    createdAt: new Date("2026-04-21T09:00:00.000Z"),
  },
  {
    requestId: documentRequest._id,
    actorUserId: barangayAdmin._id,
    actorRole: "barangay_admin",
    fromStatus: "approved",
    toStatus: "for_pickup",
    remarks: "Ready for pickup on the confirmed release slot.",
    visibility: "public",
    createdAt: new Date("2026-04-22T09:30:00.000Z"),
  },
]);

const complaint = await ComplaintReport.findOneAndUpdate(
  { trackingNumber: "CMP-SEED-0001" },
  {
    $set: {
      citizenId: citizen._id,
      municipalityId: citizen.municipalityId,
      barangayId: citizen.barangayId,
      category: "streetlight",
      title: "Streetlight outage near covered court",
      description: "Two consecutive lamps are out beside the covered court and the nearby waiting shed.",
      attachments: [],
      location: {
        address: "Covered Court Road, Poblacion",
        barangayId: citizen.barangayId,
        landmark: "Across the barangay covered court",
        latitude: null,
        longitude: null,
      },
      status: "under_review",
      priority: "medium",
      assignedOffice: "Engineering Office",
      trackingNumber: "CMP-SEED-0001",
      timeline: [
        {
          status: "submitted",
          remarks: "Complaint submitted online.",
          actorUserId: citizen._id,
          actorRole: "citizen",
          createdAt: new Date("2026-04-19T07:15:00.000Z"),
        },
        {
          status: "under_review",
          remarks: "Forwarded for inspection and repair scheduling.",
          actorUserId: municipalAdmin._id,
          actorRole: "municipal_admin",
          createdAt: new Date("2026-04-19T10:00:00.000Z"),
        },
      ],
    },
  },
  { upsert: true, new: true, runValidators: true }
);

await Notification.deleteMany({
  userId: citizen._id,
  entityId: { $in: [documentRequest._id, appointment._id, complaint._id] },
});

await Notification.insertMany([
  {
    userId: citizen._id,
    role: "citizen",
    municipalityId: citizen.municipalityId,
    barangayId: citizen.barangayId,
    type: "document_request",
    title: "Document request ready for pickup",
    message: "Barangay Clearance is now ready for pickup on the scheduled appointment.",
    link: `/citizen/document-requests/${documentRequest._id}`,
    entityType: "document_request",
    entityId: documentRequest._id,
    readAt: null,
    createdAt: new Date("2026-04-22T09:35:00.000Z"),
  },
  {
    userId: citizen._id,
    role: "citizen",
    municipalityId: citizen.municipalityId,
    barangayId: citizen.barangayId,
    type: "appointment",
    title: "Appointment confirmed",
    message: "Your document release appointment has been confirmed.",
    link: "/citizen/appointments",
    entityType: "appointment",
    entityId: appointment._id,
    readAt: null,
    createdAt: new Date("2026-04-21T09:05:00.000Z"),
  },
  {
    userId: citizen._id,
    role: "citizen",
    municipalityId: citizen.municipalityId,
    barangayId: citizen.barangayId,
    type: "complaint",
    title: "Complaint under review",
    message: "Your streetlight report has been endorsed for inspection.",
    link: `/citizen/complaints/${complaint._id}`,
    entityType: "complaint",
    entityId: complaint._id,
    readAt: null,
    createdAt: new Date("2026-04-19T10:05:00.000Z"),
  },
]);

console.log(`Seeded Phase 1 sample records for ${citizen.firstName} ${citizen.lastName} in ${municipality.name}.`);
process.exit(0);
