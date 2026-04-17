import connectDB from "../config/db.js";
import Municipality from "../models/Municipality.js";
import User from "../models/User.js";

const defaultPassword = process.env.SEED_PORTAL_USER_PASSWORD || "PortalTest123!";
const defaultBarangayId = process.env.SEED_TEST_BARANGAY_ID || "barangay-poblacion";

await connectDB();

const municipality =
  (await Municipality.findOne({ code: "ALIAGA-NE", deletedAt: null }).lean()) ||
  (await Municipality.findOne({ deletedAt: null }).sort({ createdAt: 1 }).lean());

if (!municipality) {
  console.error("No municipality found. Run npm run seed:municipalities --prefix server first.");
  process.exit(1);
}

const users = [
  {
    email: process.env.SEED_MUNICIPAL_ADMIN_EMAIL || "municipal.admin@bayanlink.local",
    fullName: "Municipal Admin",
    role: "municipal_admin",
    municipalityId: municipality._id,
    barangayId: "",
  },
  {
    email: process.env.SEED_BARANGAY_ADMIN_EMAIL || "barangay.admin@bayanlink.local",
    fullName: "Barangay Admin",
    role: "barangay_admin",
    municipalityId: municipality._id,
    barangayId: defaultBarangayId,
  },
  {
    email: process.env.SEED_CITIZEN_EMAIL || "citizen@bayanlink.local",
    fullName: "Juan Citizen",
    role: "citizen",
    municipalityId: municipality._id,
    barangayId: defaultBarangayId,
  },
];

for (const user of users) {
  await User.findOneAndUpdate(
    { email: user.email },
    {
      $set: {
        ...user,
        password: defaultPassword,
        phone: "+63 900 000 0000",
        status: "active",
        failedLoginCount: 0,
        lockUntil: null,
      },
    },
    {
      upsert: true,
      runValidators: true,
      returnDocument: "after",
    }
  );
}

console.log(`Seeded ${users.length} portal test users for ${municipality.name}.`);
console.log(`Password for all test users: ${defaultPassword}`);
process.exit(0);
