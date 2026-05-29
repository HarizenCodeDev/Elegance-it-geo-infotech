export async function up(knex) {
  const isSqlite = knex.client.config.client === 'better-sqlite3';

  await knex.schema.createTable("onboarding_tasks", (table) => {
    if (isSqlite) {
      table.string("id", 36).primary();
    } else {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    }
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("task_name", 255).notNullable();
    table.text("description");
    table.uuid("assigned_to").references("id").inTable("users").onDelete("SET NULL");
    table.string("status", 50).defaultTo("pending");
    table.date("due_date");
    table.timestamp("completed_at");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.index(["user_id", "status"]);
  });

  await knex.schema.createTable("onboarding_checklist", (table) => {
    if (isSqlite) {
      table.string("id", 36).primary();
    } else {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    }
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("item", 255).notNullable();
    table.boolean("is_completed").defaultTo(false);
    table.timestamp("completed_at");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.index("user_id");
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("onboarding_checklist");
  await knex.schema.dropTableIfExists("onboarding_tasks");
}
