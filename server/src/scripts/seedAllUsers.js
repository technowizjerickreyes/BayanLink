import connectDB from "../config/db.js";
import bcrypt from "bcryptjs";
import Municipality from "../models/Municipality.js";
import User from "../models/User.js";
import Role from "../models/Role.js";

const PASSWORD_HASH_ROUNDS = 12;

await connectDB();

console.log("Seeding roles...");
await Role.findOneAndUpdate(
  { name: "super_admin" },
  { name: "super_admin", description: "Super Admin", permissions: [], upsert: true }
);
await Role.findOneAndUpdate(
  { name: "municipal_admin" },
  { name: "municipal_admin", description: "Municipal Admin", permissions: [], upsert: true }
);
await Role.findOneAndUpdate(
  { name: "barangay_admin" },
  { name: "barangay_admin", description: "Barangay Admin", permissions: [], upsert: true }
);
await Role.findOneAndUpdate(
  { name: "citizen" },
  { name: "citizen", description: "Citizen", permissions: [], upsert: true }
);
console.log("Roles seeded.");

console.log("Seeding municipality...");
const municipality = await Municipality.findOne({ deletedAt: null });
if (!municipality) {
  console.log("Creating sample municipality...");
  const newMun = await Municipality.create({
    name: "Aliaga",
    code: "ALIAGA-NE",
    region: "Region III",
    province: "Nueva Ecija",
    status: "active"
  });
  console.log(`Created municipality: ${newMul.name}`);
}
const mun = await Municipality.findOne({ deletedAt: null });
console.log(`Using municipality: ${mun.name}`);

const defaultPassword = "password";
const barangayId = "barangay-poblacion";

console.log("\nSeeding users with password 'password' (hashed)...");

const users = [
  {
    email: "superadmin@bayanlink.local",
    fullName: "BayanLink Super Admin",
    role: "super_admin",
    municipalityId: null,
    barangayId: "",
    status: "active"
  },
  {
    email: "municipal.admin@bayanlink.local",
    fullName: "Municipal Admin",
    role: "municipal_admin",
    municipalityId: mun._id,
    barangayId: "",
    status: "active"
  },
  {
    email: "barangay.admin@bayanlink.local",
    fullName: "Barangay Admin",
    role: "barangay_admin",
    municipalityId: mun._id,
    barangayId: barangayId,
    status: "active"
  },
  {
    email: "citizen@bayanlink.local",
    fullName: "Juan Citizen",
    role: "citizen",
    municipalityId: mun._id,
    barangayId: barangayId,
    status: "active"
  }
];

for (const userData of users) {
  const existing = await User.findOne({ email: userData.email });
  if (existing) {
    await User.findByIdAndDelete(existing._id);
  }
  const hashedPassword = await bcrypt.hash(defaultPassword, PASSWORD_HASH_ROUNDS);
  const user = await User.create({
    ...userData,
    password: hashedPassword,
    phone: "+63 900 000 0000"
  });
  console.log(`Created: ${user.email} (${user.role})`);
}

console.log("\nAll users seeded successfully!");
console.log("Password for all users: password");
process.exit(0);