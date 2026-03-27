export async function up(knex) {
  const hasColumn = await knex.schema.hasColumn("users", "two_factor_enabled");
  if (!hasColumn) {
    await knex.schema.table("users", (table) => {
      table.boolean("two_factor_enabled").defaultTo(false);
      table.string("two_factor_secret");
      table.string("google_id");
      table.string("github_id");
    });
  }
}

export async function down(knex) {
  await knex.schema.table("users", (table) => {
    table.dropColumn("two_factor_enabled");
    table.dropColumn("two_factor_secret");
    table.dropColumn("google_id");
    table.dropColumn("github_id");
  });
}
