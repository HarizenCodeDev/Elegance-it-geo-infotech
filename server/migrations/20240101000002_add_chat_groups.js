/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("chat_groups", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name").notNullable();
    table.text("description");
    table.uuid("created_by");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
  
  await knex.schema.raw('ALTER TABLE chat_groups ADD CONSTRAINT chat_groups_created_by_foreign FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE');
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("chat_groups");
}
