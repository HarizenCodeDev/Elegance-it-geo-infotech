/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Attendance indexes
  await knex.raw("CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON attendance(user_id, date)");
  await knex.raw("CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date)");

  // Leaves indexes
  await knex.raw("CREATE INDEX IF NOT EXISTS idx_leaves_user_status ON leaves(user_id, status)");
  await knex.raw("CREATE INDEX IF NOT EXISTS idx_leaves_dates ON leaves(from_date, to_date)");

  // Notifications indexes
  await knex.raw("CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read)");

  // Chat messages indexes
  await knex.raw("CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(from_user, to_user)");
  await knex.raw("CREATE INDEX IF NOT EXISTS idx_chat_messages_group ON chat_messages(to_group, ts)");

  // Users indexes
  await knex.raw("CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)");
  await knex.raw("CREATE INDEX IF NOT EXISTS idx_users_department ON users(department)");
  await knex.raw("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)");

  // Login logs indexes
  await knex.raw("CREATE INDEX IF NOT EXISTS idx_login_logs_user ON login_logs(user_id, created_at)");

  // Checkin checkout indexes
  await knex.raw("CREATE INDEX IF NOT EXISTS idx_checkin_user_date ON checkin_checkout(user_id, created_at)");

  // Activity log table
  await knex.schema.createTable("activity_logs", (table) => {
    table.string("id").primary().defaultTo(knex.fn.uuid());
    table.string("user_id").references("id").inTable("users").onDelete("SET NULL");
    table.string("action").notNullable(); // created, updated, deleted, approved, rejected, login, logout
    table.string("module").notNullable(); // employee, leave, attendance, announcement, etc.
    table.string("target_id"); // ID of the affected record
    table.text("details"); // JSON string with additional details
    table.string("ip_address");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.index(["user_id", "created_at"]);
    table.index(["module", "action"]);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("activity_logs");
  await knex.raw("DROP INDEX IF EXISTS idx_attendance_user_date");
  await knex.raw("DROP INDEX IF EXISTS idx_attendance_date");
  await knex.raw("DROP INDEX IF EXISTS idx_leaves_user_status");
  await knex.raw("DROP INDEX IF EXISTS idx_leaves_dates");
  await knex.raw("DROP INDEX IF EXISTS idx_notifications_user_read");
  await knex.raw("DROP INDEX IF EXISTS idx_chat_messages_user");
  await knex.raw("DROP INDEX IF EXISTS idx_chat_messages_group");
  await knex.raw("DROP INDEX IF EXISTS idx_users_role");
  await knex.raw("DROP INDEX IF EXISTS idx_users_department");
  await knex.raw("DROP INDEX IF EXISTS idx_users_email");
  await knex.raw("DROP INDEX IF EXISTS idx_login_logs_user");
  await knex.raw("DROP INDEX IF EXISTS idx_checkin_user_date");
}
