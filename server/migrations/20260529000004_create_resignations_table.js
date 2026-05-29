export async function up(knex) {
  const isSqlite = knex.client.config.client === 'better-sqlite3';

  await knex.schema.createTable("resignations", (table) => {
    if (isSqlite) {
      table.string("id", 36).primary();
    } else {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    }
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.text("reason").notNullable();
    table.date("last_working_day").notNullable();
    table.string("status", 50).defaultTo("Pending");
    table.uuid("approved_by").references("id").inTable("users").onDelete("SET NULL");
    table.timestamp("approved_at");
    table.text("admin_notes");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.index(["user_id", "status"]);
  });

  if (!isSqlite) {
    await knex.raw('CREATE INDEX resignations_status ON resignations(status)');
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("resignations");
}
