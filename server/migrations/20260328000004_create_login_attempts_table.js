export async function up(knex) {
  await knex.schema.createTable("login_attempts", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("email", 255);
    table.string("ip_address", 50).notNullable();
    table.string("user_agent", 500);
    table.string("attempt_type", 20).defaultTo("password");
    table.boolean("success").defaultTo(false);
    table.string("failure_reason", 100);
    table.string("location", 255);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.index(["email", "created_at"]);
    table.index(["ip_address", "created_at"]);
    table.index("created_at");
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("login_attempts");
}
