import connectDB from "../config/db.js";
import User from "../models/User.js";

const email = process.env.SEED_SUPER_ADMIN_EMAIL;
const password = process.env.SEED_SUPER_ADMIN_PASSWORD;
const firstName = process.env.SEED_SUPER_ADMIN_FIRST_NAME || "BayanLink";
const lastName = process.env.SEED_SUPER_ADMIN_LAST_NAME || "Super Admin";

if (!email || !password) {
  console.error("SEED_SUPER_ADMIN_EMAIL and SEED_SUPER_ADMIN_PASSWORD are required.");
  process.exit(1);
}

await connectDB();

const existing = await User.findOne({ email });

if (existing) {
  console.log(`Super Admin already exists: ${email}`);
  process.exit(0);
}

const user = await User.create({
  email,
  passwordHash: await User.hashPassword(password),
  firstName,
  lastName,
  role: "super_admin",
  status: "active",
  municipalityId: null,
  barangayId: "",
});

console.log(`Created Super Admin: ${user.email}`);
process.exit(0);
