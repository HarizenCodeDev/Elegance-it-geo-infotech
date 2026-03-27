export async function up(knex) {
  const hasResetToken = await knex.schema.hasColumn("users", "reset_token");
  if (!hasResetToken) {
    await knex.schema.table("users", (table) => {
      table.string("reset_token");
      table.datetime("reset_token_expiry");
    });
  }
}

export async function down(knex) {
  await knex.schema.table("users", (table) => {
    table.dropColumn("reset_token");
    table.dropColumn("reset_token_expiry");
  });
}
