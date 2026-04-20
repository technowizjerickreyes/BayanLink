import connectDB from "../config/db.js";
import Municipality from "../models/Municipality.js";
import User from "../models/User.js";

const DEFAULT_PASSWORD = "BayanLink123!";

const SYSTEM_USER_EMAILS = [
  "superadmin@bayanlink.local",
  "municipal.admin@aliaga.gov.ph",
  "barangay.admin@aliaga.gov.ph",
  "citizen@aliaga.gov.ph",
  "driver.staff@aliaga.gov.ph",
  "complaints.staff@aliaga.gov.ph",
];

await connectDB();

console.log("\n📦 BayanLink User Seeder");
console.log("=================================================");

let municipality = await Municipality.findOne({ status: "active", deletedAt: null });

if (!municipality) {
  console.log("Creating default municipality...");
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
  console.log("✓ Created municipality: " + municipality.name);
} else {
  console.log("✓ Using municipality: " + municipality.name);
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

const hashedPassword = await User.hashPassword(DEFAULT_PASSWORD);

console.log("\nSeeding users...\n");

for (const userData of users) {
  await User.findOneAndUpdate(
    { email: userData.email },
    {
      $set: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        fullName: userData.fullName,
        role: userData.role,
        municipalityId: userData.municipalityId,
        barangayId: userData.barangayId,
        affiliate: userData.affiliate,
        status: userData.status,
        phone: "+63 900 000 0000",
        failedLoginCount: 0,
        lockUntil: null,
      },
      $setOnInsert: {
        password: hashedPassword,
      },
    },
    { upsert: true, runValidators: false }
  );
  console.log("✓ " + userData.email + " (" + userData.role + ")");
}

console.log("\n=================================================");
console.log("✅ User seeding complete!");
console.log("=================================================");
console.log("\n📋 Seeded Users:");
console.log("-------------------------------------------------");

for (const u of users) {
  var rolePad = u.role + "                 ";
  console.log("  " + rolePad.substring(0, 18) + " | " + u.email);
}

console.log("-------------------------------------------------");
console.log("  Password: " + DEFAULT_PASSWORD);
console.log("=================================================\n");

process.exit(0);