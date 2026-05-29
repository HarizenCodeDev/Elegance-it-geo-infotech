export async function up(knex) {
  const hasCol = await knex.schema.hasColumn("documents", "folder_id");
  if (!hasCol) {
    await knex.schema.alterTable("documents", (table) => {
      table.uuid("folder_id").references("id").inTable("folders").onDelete("SET NULL");
    });
  }
}

export async function down(knex) {
  await knex.schema.alterTable("documents", (table) => {
    table.dropColumn("folder_id");
  });
}
