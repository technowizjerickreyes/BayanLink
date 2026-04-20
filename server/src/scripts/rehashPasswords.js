import connectDB from "../config/db.js";
import User from "../models/User.js";

const BCRYPT_PREFIX = "$2";

function isBcryptHash(password) {
  if (!password || typeof password !== "string") return false;
  if (!password.startsWith(BCRYPT_PREFIX)) return false;
  var parts = password.split("$");
  if (parts.length !== 4) return false;
  var algorithm = parts[1];
  return ["a", "b"].includes(algorithm);
}

await connectDB();

console.log("\n🔍 Scanning all users for plain text passwords...\n");

var users = await User.find({}).select("+password").lean();

var fixedCount = 0;
var skippedCount = 0;
var errorCount = 0;

for (var i = 0; i < users.length; i++) {
  var user = users[i];
  try {
    var plainPassword = user.password;

    if (!plainPassword) {
      console.log("⚠️  Skipped: " + user.email + " (no password)");
      skippedCount++;
      continue;
    }

    var alreadyHashed = isBcryptHash(plainPassword);

    if (alreadyHashed) {
      console.log("✓  Skipped (already hashed): " + user.email);
      skippedCount++;
    } else {
      await User.updateOne(
        { _id: user._id },
        { password: plainPassword }
      );
      console.log("🔧 Fixed: " + user.email + " (plain text -> hashed)");
      fixedCount++;
    }
  } catch (err) {
    console.log("❌ Error processing " + user.email + ": " + err.message);
    errorCount++;
  }
}

console.log("\n========================================");
console.log("📊 Password Hash Check Complete");
console.log("========================================");
console.log("   Fixed (hashed):     " + fixedCount);
console.log("   Skipped (safe):     " + skippedCount);
console.log("   Errors:             " + errorCount);
console.log("   Total processed:    " + users.length);
console.log("========================================\n");

if (fixedCount > 0) {
  console.log("✅ Done! Plain text passwords have been hashed.");
} else {
  console.log("✅ Done! All passwords are already hashed.");
}

process.exit(0);