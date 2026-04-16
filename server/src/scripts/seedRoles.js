import connectDB from "../config/db.js";
import Role from "../models/Role.js";

const roles = [
  {
    name: "super_admin",
    description: "Can create and view municipalities, edit limited municipality fields, assign municipal admins, and read related audit logs.",
    permissions: ["municipality:create", "municipality:read", "municipality:update_limited", "municipal_admin:assign", "audit:read"],
  },
  {
    name: "municipal_admin",
    description: "Can manage municipality-scoped operations and municipality-wide announcements only within the assigned municipality.",
    permissions: ["municipality_scope:read", "barangay:manage", "request:review", "report:read", "news:municipality_manage"],
  },
  {
    name: "barangay_admin",
    description: "Can manage barangay-scoped residents, requests, complaints, and barangay news only within the assigned barangay.",
    permissions: ["barangay_scope:manage", "resident:verify", "news:barangay_manage"],
  },
  {
    name: "citizen",
    description: "Can manage own profile, submit own transactions, and read scoped municipality and barangay news.",
    permissions: ["profile:self", "request:self", "appointment:self", "complaint:self", "news:scoped_read"],
  },
];

await connectDB();

await Promise.all(
  roles.map((role) =>
    Role.findOneAndUpdate(
      { name: role.name },
      {
        $set: {
          description: role.description,
          permissions: role.permissions,
        },
      },
      { upsert: true, runValidators: true, returnDocument: "after" }
    )
  )
);

console.log(`Seeded ${roles.length} roles.`);
process.exit(0);
