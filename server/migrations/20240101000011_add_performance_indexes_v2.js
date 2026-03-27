export async function up(knex) {
  await knex.schema.alterTable("attendance", (table) => {
    table.index(["user_id", "date"]);
    table.index(["date"]);
    table.index(["status"]);
  });

  await knex.schema.alterTable("leaves", (table) => {
    table.index(["user_id", "status"]);
    table.index(["status"]);
    table.index(["from_date"]);
    table.index(["to_date"]);
  });

  await knex.schema.alterTable("leave_balances", (table) => {
    table.index(["user_id", "leave_type", "year"]);
  });

  await knex.schema.alterTable("checkin_checkout", (table) => {
    table.index(["user_id", "type"]);
    table.index(["created_at"]);
  });

  await knex.schema.alterTable("chat_messages", (table) => {
    table.index(["from_user"]);
    table.index(["to_user"]);
    table.index(["to_group"]);
    table.index(["created_at"]);
  });

  await knex.schema.alterTable("chat_groups", (table) => {
    table.index(["created_by"]);
  });

  await knex.schema.alterTable("notifications", (table) => {
    table.index(["user_id", "is_read"]);
    table.index(["created_at"]);
  });

  await knex.schema.alterTable("login_logs", (table) => {
    table.index(["user_id"]);
    table.index(["created_at"]);
  });

  await knex.schema.alterTable("activity_logs", (table) => {
    table.index(["user_id"]);
    table.index(["module"]);
    table.index(["action"]);
    table.index(["created_at"]);
  });

  await knex.schema.alterTable("announcements", (table) => {
    table.index(["created_by"]);
    table.index(["created_at"]);
  });

  await knex.schema.alterTable("holidays", (table) => {
    table.index(["date"]);
  });
}

export async function down(knex) {
  await knex.schema.alterTable("attendance", (table) => {
    table.dropIndex(["user_id", "date"]);
    table.dropIndex(["date"]);
    table.dropIndex(["status"]);
  });

  await knex.schema.alterTable("leaves", (table) => {
    table.dropIndex(["user_id", "status"]);
    table.dropIndex(["status"]);
    table.dropIndex(["from_date"]);
    table.dropIndex(["to_date"]);
  });

  await knex.schema.alterTable("leave_balances", (table) => {
    table.dropIndex(["user_id", "leave_type", "year"]);
  });

  await knex.schema.alterTable("checkin_checkout", (table) => {
    table.dropIndex(["user_id", "type"]);
    table.dropIndex(["created_at"]);
  });

  await knex.schema.alterTable("chat_messages", (table) => {
    table.dropIndex(["from_user"]);
    table.dropIndex(["to_user"]);
    table.dropIndex(["to_group"]);
    table.dropIndex(["created_at"]);
  });

  await knex.schema.alterTable("chat_groups", (table) => {
    table.dropIndex(["created_by"]);
  });

  await knex.schema.alterTable("notifications", (table) => {
    table.dropIndex(["user_id", "is_read"]);
    table.dropIndex(["created_at"]);
  });

  await knex.schema.alterTable("login_logs", (table) => {
    table.dropIndex(["user_id"]);
    table.dropIndex(["created_at"]);
  });

  await knex.schema.alterTable("activity_logs", (table) => {
    table.dropIndex(["user_id"]);
    table.dropIndex(["module"]);
    table.dropIndex(["action"]);
    table.dropIndex(["created_at"]);
  });

  await knex.schema.alterTable("announcements", (table) => {
    table.dropIndex(["created_by"]);
    table.dropIndex(["created_at"]);
  });

  await knex.schema.alterTable("holidays", (table) => {
    table.dropIndex(["date"]);
  });
}
