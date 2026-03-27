export async function up(knex) {
  const hasParentId = await knex.schema.hasColumn("checkin_checkout", "parent_id");
  if (!hasParentId) {
    await knex.schema.table("checkin_checkout", (table) => {
      table.uuid("parent_id");
    });
  }

  const hasNote = await knex.schema.hasColumn("checkin_checkout", "note");
  if (!hasNote) {
    await knex.schema.table("checkin_checkout", (table) => {
      table.text("note");
    });
  }
}

export async function down(knex) {
  await knex.schema.table("checkin_checkout", (table) => {
    table.dropColumn("parent_id");
    table.dropColumn("note");
  });
}
