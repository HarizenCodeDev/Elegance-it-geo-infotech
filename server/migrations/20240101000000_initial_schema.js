/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Users table
  await knex.schema.createTable("users", (table) => {
    table.string("id").primary().defaultTo(knex.fn.uuid());
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table.string("role").notNullable().defaultTo("developer");
    table.string("employee_id").unique();
    table.date("dob");
    table.string("gender");
    table.string("marital_status");
    table.string("designation");
    table.string("department");
    table.decimal("salary", 12, 2);
    table.string("profile_image");
    table.string("avatar");
    table.string("attendance_status").defaultTo("Pending");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // Attendance table
  await knex.schema.createTable("attendance", (table) => {
    table.string("id").primary().defaultTo(knex.fn.uuid());
    table.string("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.date("date").notNullable();
    table.string("status").notNullable();
    table.timestamp("check_in_at");
    table.timestamp("check_out_at");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.unique(["user_id", "date"]);
  });

  // Leave table
  await knex.schema.createTable("leaves", (table) => {
    table.string("id").primary().defaultTo(knex.fn.uuid());
    table.string("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.string("type").notNullable();
    table.date("from_date").notNullable();
    table.date("to_date").notNullable();
    table.text("description");
    table.string("status").defaultTo("Pending");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // Announcements table
  await knex.schema.createTable("announcements", (table) => {
    table.string("id").primary().defaultTo(knex.fn.uuid());
    table.string("title").notNullable();
    table.text("message").notNullable();
    table.text("audience_roles").defaultTo("all");
    table.text("audience_departments").defaultTo("{}");
    table.string("created_by").references("id").inTable("users").onDelete("SET NULL");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // Chat messages table
  await knex.schema.createTable("chat_messages", (table) => {
    table.string("id").primary().defaultTo(knex.fn.uuid());
    table.string("from_user").references("id").inTable("users").onDelete("CASCADE");
    table.string("to_user").references("id").inTable("users").onDelete("SET NULL");
    table.string("to_group");
    table.text("text").notNullable();
    table.timestamp("ts").defaultTo(knex.fn.now());
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // Checkin/Checkout logs table
  await knex.schema.createTable("checkin_checkout", (table) => {
    table.string("id").primary().defaultTo(knex.fn.uuid());
    table.string("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.string("type").notNullable();
    table.string("ip_address");
    table.text("location");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // Login logs table
  await knex.schema.createTable("login_logs", (table) => {
    table.string("id").primary().defaultTo(knex.fn.uuid());
    table.string("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.string("ip_address");
    table.text("user_agent");
    table.string("status");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("login_logs");
  await knex.schema.dropTableIfExists("checkin_checkout");
  await knex.schema.dropTableIfExists("chat_messages");
  await knex.schema.dropTableIfExists("announcements");
  await knex.schema.dropTableIfExists("leaves");
  await knex.schema.dropTableIfExists("attendance");
  await knex.schema.dropTableIfExists("users");
}
