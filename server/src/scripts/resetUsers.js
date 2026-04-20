import connectDB from "../config/db.js";
import User from "../models/User.js";

var SYSTEM_USER_EMAILS = [
  "superadmin@bayanlink.local",
  "municipal.admin@aliaga.gov.ph",
  "barangay.admin@aliaga.gov.ph",
  "citizen@aliaga.gov.ph",
  "driver.staff@aliaga.gov.ph",
  "complaints.staff@aliaga.gov.ph",
];

await connectDB();

console.log("\n🔄 BayanLink User Reset");
console.log("=================================================");

var result = await User.deleteMany({ email: { $in: SYSTEM_USER_EMAILS } });

console.log("✓ Deleted " + result.deletedCount + " system user(s)");

console.log("\n✅ User reset complete!");
console.log("Run 'npm run seed:users' to re-seed users.\n");

process.exit(0);