import connectDB from "../config/db.js";
import Municipality from "../models/Municipality.js";
import User from "../models/User.js";

const DEFAULT_PASSWORD = "BayanLink123!";

await connectDB();

console.log("Checking for municipality...");
let municipality = await Municipality.findOne({ status: "active", deletedAt: null });

if (!municipality) {
  console.log("No active municipality found. Creating default municipality...");
  municipality = await Municipality.create({
    code: "ALIAGA-NE",
    name: "Aliaga",
    province: "Nueva Ecija",
    region: "Region III",
    officialEmail: "info@aliaga.gov.ph",
    officialContactNumber: "+63 44 000 0000",
    officeAddress: "Municipal Hall, Aliaga, Nueva Ecija",
    status: "active",
  });
  console.log(`Created municipality: ${municipality.name}`);
} else {
  console.log(`Using municipality: ${municipality.name} (${municipality._id})`);
}

const users = [
  {
    email: "superadmin@bayanlink.local",
    firstName: "BayanLink",
    lastName: "Super Admin",
    fullName: "BayanLink Super Admin",
    role: "super_admin",
    municipalityId: null,
    barangayId: "",
    affiliate: "System Administration",
    status: "active",
  },
  {
    email: "municipal.admin@aliaga.gov.ph",
    firstName: "Maria",
    lastName: "Santos",
    fullName: "Maria Santos",
    role: "municipal_admin",
    municipalityId: municipality._id,
    barangayId: "",
    affiliate: "Municipal Government of Aliaga",
    status: "active",
  },
  {
    email: "barangay.admin@aliaga.gov.ph",
    firstName: "Juan",
    lastName: "Dela Cruz",
    fullName: "Juan Dela Cruz",
    role: "barangay_admin",
    municipalityId: municipality._id,
    barangayId: "poblacion",
    affiliate: "Barangay Poblacion",
    status: "active",
  },
  {
    email: "citizen@aliaga.gov.ph",
    firstName: "Pedro",
    lastName: "Garcia",
    fullName: "Pedro Garcia",
    role: "citizen",
    municipalityId: municipality._id,
    barangayId: "poblacion",
    affiliate: "Resident of Barangay Poblacion",
    status: "active",
  },
  {
    email: "driver.staff@aliaga.gov.ph",
    firstName: "Roberto",
    lastName: "Torres",
    fullName: "Roberto Torres",
    role: "municipal_admin",
    municipalityId: municipality._id,
    barangayId: "",
    affiliate: "TODA and Driver Registry Unit",
    status: "active",
  },
  {
    email: "complaints.staff@aliaga.gov.ph",
    firstName: "Carmen",
    lastName: "Bautista",
    fullName: "Carmen Bautista",
    role: "municipal_admin",
    municipalityId: municipality._id,
    barangayId: "",
    affiliate: "Municipal Complaints Desk",
    status: "active",
  },
];

console.log("\nSeeding users...");

for (const userData of users) {
  const existing = await User.findOne({ email: userData.email });

  if (existing) {
    existing.firstName = userData.firstName;
    existing.lastName = userData.lastName;
    existing.fullName = userData.fullName;
    existing.role = userData.role;
    existing.municipalityId = userData.municipalityId;
    existing.barangayId = userData.barangayId;
    existing.affiliate = userData.affiliate;
    existing.status = userData.status;
    existing.password = DEFAULT_PASSWORD;
    existing.phone = "+63 900 000 0000";
    existing.failedLoginCount = 0;
    existing.lockUntil = null;
    await existing.save();
    console.log(`Updated: ${existing.email} (${existing.role})`);
  } else {
    const user = await User.create({
      ...userData,
      password: DEFAULT_PASSWORD,
      phone: "+63 900 000 0000",
    });
    console.log(`Created: ${user.email} (${user.role})`);
  }
}

console.log("\n========================================");
console.log("All default users seeded successfully!");
console.log("========================================");
console.log("Email                    | Password");
console.log("-------------------------|------------------");
for (const u of users) {
  console.log(`${u.email.padEnd(24)} | ${DEFAULT_PASSWORD}`);
}
console.log("========================================");
console.log("\nNote: All passwords will be hashed automatically by the User model pre-save hook.");

process.exit(0);