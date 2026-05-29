export async function up(knex) {
  const isSqlite = knex.client.config.client === 'better-sqlite3';

  await knex.schema.createTable("salary_slips", (table) => {
    if (isSqlite) {
      table.string("id", 36).primary();
    } else {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    }
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.uuid("payroll_id").references("id").inTable("payroll").onDelete("SET NULL");
    table.decimal("basic_pay", 12, 2).defaultTo(0);
    table.decimal("allowances", 12, 2).defaultTo(0);
    table.decimal("deductions", 12, 2).defaultTo(0);
    table.decimal("net_pay", 12, 2).defaultTo(0);
    table.string("month", 7).notNullable();
    table.integer("year").notNullable();
    table.timestamp("generated_at").defaultTo(knex.fn.now());
    table.timestamp("downloaded_at");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.index(["user_id", "year", "month"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("salary_slips");
}
