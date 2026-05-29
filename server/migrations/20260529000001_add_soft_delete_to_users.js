export async function up(knex) {
  const isSqlite = knex.client.config.client === 'better-sqlite3';

  await knex.schema.alterTable("users", (table) => {
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("deleted_at").nullable();
  });

  if (!isSqlite) {
    await knex.raw('CREATE INDEX idx_users_is_deleted ON users(is_deleted)');
  }
}

export async function down(knex) {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("is_deleted");
    table.dropColumn("deleted_at");
  });
}
