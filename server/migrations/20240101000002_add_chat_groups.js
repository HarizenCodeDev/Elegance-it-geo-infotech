/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("chat_groups", (table) => {
    table.string("id").primary().defaultTo(knex.fn.uuid());
    table.string("name").notNullable();
    table.text("description");
    table.string("created_by").references("id").inTable("users").onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("chat_groups");
}
