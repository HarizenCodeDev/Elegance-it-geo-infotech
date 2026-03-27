import bcrypt from "bcryptjs";

export async function seed(knex) {
  console.log("🌱 Starting database seed...");

  try {
    const existingRoot = await knex("users").where("role", "root").first();
    if (existingRoot) {
      console.log("⚠️  Root user already exists. Skipping seed.");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.DEFAULT_PASSWORD || "admin123",
      12
    );

    const [rootUser] = await knex("users")
      .insert({
        name: process.env.DEFAULT_NAME || "Admin",
        email: process.env.DEFAULT_EMAIL || "admin@elegance.com",
        password: hashedPassword,
        role: "root",
        employee_id: "EMP001",
        department: "Administration",
        designation: "System Administrator",
      })
      .returning("*");

    console.log(`✅ Root user created:`);
    console.log(`   Email: ${rootUser.email}`);
    console.log(`   Password: ${process.env.DEFAULT_PASSWORD || "admin123"}`);
    console.log("\n⚠️  Please change this password after first login!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}