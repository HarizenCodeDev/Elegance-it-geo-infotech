export async function up(knex) {
  await knex.schema.createTable("password_history", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.uuid("reset_by").references("id").inTable("users").onDelete("SET NULL");
    table.string("password_hash", 255).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.index("user_id");
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("password_history");
}
