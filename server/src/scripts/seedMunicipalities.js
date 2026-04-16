import connectDB from "../config/db.js";
import Municipality from "../models/Municipality.js";
import User from "../models/User.js";

const actorEmail = process.env.SEED_SUPER_ADMIN_EMAIL;

if (!actorEmail) {
  console.error("SEED_SUPER_ADMIN_EMAIL is required so createdBy can be assigned.");
  process.exit(1);
}

await connectDB();

const actor = await User.findOne({ email: actorEmail, role: "super_admin" }).lean();

if (!actor) {
  console.error(`Super Admin not found for ${actorEmail}. Run npm run seed:super-admin first.`);
  process.exit(1);
}

const municipalities = [
  {
    code: "ALIAGA-NE",
    name: "Aliaga",
    province: "Nueva Ecija",
    region: "Region III",
    officialEmail: "info@aliaga.gov.ph",
    officialContactNumber: "+63 44 000 0000",
    officeAddress: "Municipal Hall, Aliaga, Nueva Ecija",
    logoUrl: "",
    status: "active",
  },
  {
    code: "CABANATUAN-NE",
    name: "Cabanatuan City",
    province: "Nueva Ecija",
    region: "Region III",
    officialEmail: "info@cabanatuan.gov.ph",
    officialContactNumber: "+63 44 111 1111",
    officeAddress: "City Hall Compound, Cabanatuan City, Nueva Ecija",
    logoUrl: "",
    status: "active",
  },
];

for (const municipality of municipalities) {
  const { code, name, province, region, officialEmail, officialContactNumber, officeAddress, logoUrl, status } = municipality;

  await Municipality.findOneAndUpdate(
    { code },
    {
      $setOnInsert: {
        code,
        name,
        province,
        region,
        createdBy: actor._id,
      },
      $set: {
        officialEmail,
        officialContactNumber,
        officeAddress,
        logoUrl,
        status,
        updatedBy: actor._id,
      },
    },
    { upsert: true, runValidators: true, returnDocument: "after" }
  );
}

console.log(`Seeded ${municipalities.length} sample municipalities.`);
process.exit(0);
