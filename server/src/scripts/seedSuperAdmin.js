import connectDB from "../config/db.js";
import User from "../models/User.js";

const email = process.env.SEED_SUPER_ADMIN_EMAIL;
const password = process.env.SEED_SUPER_ADMIN_PASSWORD;
const fullName = process.env.SEED_SUPER_ADMIN_FULL_NAME || "BayanLink Super Admin";

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
  password,
  fullName,
  role: "super_admin",
  status: "active",
  municipalityId: null,
  barangayId: "",
});

console.log(`Created Super Admin: ${user.email}`);
process.exit(0);
