/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Users table
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
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
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id");
    table.date("date").notNullable();
    table.string("status").notNullable();
    table.timestamp("check_in_at");
    table.timestamp("check_out_at");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.unique(["user_id", "date"]);
  });
  
  await knex.schema.raw('ALTER TABLE attendance ADD CONSTRAINT attendance_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');

  // Leave table
  await knex.schema.createTable("leaves", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id");
    table.string("type").notNullable();
    table.date("from_date").notNullable();
    table.date("to_date").notNullable();
    table.text("description");
    table.string("status").defaultTo("Pending");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
  
  await knex.schema.raw('ALTER TABLE leaves ADD CONSTRAINT leaves_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');

  // Announcements table
  await knex.schema.createTable("announcements", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("title").notNullable();
    table.text("message").notNullable();
    table.text("audience_roles").defaultTo("all");
    table.text("audience_departments").defaultTo("{}");
    table.uuid("created_by");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
  
  await knex.schema.raw('ALTER TABLE announcements ADD CONSTRAINT announcements_created_by_foreign FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL');

  // Chat messages table
  await knex.schema.createTable("chat_messages", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("from_user");
    table.uuid("to_user");
    table.string("to_group");
    table.text("text").notNullable();
    table.timestamp("ts").defaultTo(knex.fn.now());
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
  
  await knex.schema.raw('ALTER TABLE chat_messages ADD CONSTRAINT chat_messages_from_user_foreign FOREIGN KEY (from_user) REFERENCES users(id) ON DELETE CASCADE');
  await knex.schema.raw('ALTER TABLE chat_messages ADD CONSTRAINT chat_messages_to_user_foreign FOREIGN KEY (to_user) REFERENCES users(id) ON DELETE SET NULL');

  // Checkin/Checkout logs table
  await knex.schema.createTable("checkin_checkout", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id");
    table.string("type").notNullable();
    table.string("ip_address");
    table.text("location");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
  
  await knex.schema.raw('ALTER TABLE checkin_checkout ADD CONSTRAINT checkin_checkout_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');

  // Login logs table
  await knex.schema.createTable("login_logs", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id");
    table.string("ip_address");
    table.text("user_agent");
    table.string("status");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
  
  await knex.schema.raw('ALTER TABLE login_logs ADD CONSTRAINT login_logs_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
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
