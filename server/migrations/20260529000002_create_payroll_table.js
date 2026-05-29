export async function up(knex) {
  const isSqlite = knex.client.config.client === 'better-sqlite3';

  await knex.schema.createTable("payroll", (table) => {
    if (isSqlite) {
      table.string("id", 36).primary();
    } else {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    }
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.decimal("basic_pay", 12, 2).defaultTo(0);
    table.decimal("allowances", 12, 2).defaultTo(0);
    table.decimal("deductions", 12, 2).defaultTo(0);
    table.decimal("net_pay", 12, 2).defaultTo(0);
    table.date("pay_period_start").notNullable();
    table.date("pay_period_end").notNullable();
    table.date("payment_date");
    table.string("status", 50).defaultTo("draft");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.index(["user_id", "pay_period_start"]);
  });

  if (!isSqlite) {
    await knex.raw('CREATE INDEX payroll_status ON payroll(status)');
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("payroll");
}
