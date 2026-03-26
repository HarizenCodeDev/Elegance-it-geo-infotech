/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Leave balances table
  await knex.schema.createTable("leave_balances", (table) => {
    table.string("id").primary().defaultTo(knex.fn.uuid());
    table.string("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.string("leave_type").notNullable(); // annual, sick, casual, etc.
    table.integer("total_days").notNullable().defaultTo(0);
    table.integer("used_days").notNullable().defaultTo(0);
    table.integer("pending_days").notNullable().defaultTo(0);
    table.integer("year").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.unique(["user_id", "leave_type", "year"]);
  });

  // Notifications table
  await knex.schema.createTable("notifications", (table) => {
    table.string("id").primary().defaultTo(knex.fn.uuid());
    table.string("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.string("title").notNullable();
    table.text("message").notNullable();
    table.string("type").defaultTo("info"); // info, success, warning, error
    table.boolean("is_read").defaultTo(false);
    table.string("link");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // Holidays table
  await knex.schema.createTable("holidays", (table) => {
    table.string("id").primary().defaultTo(knex.fn.uuid());
    table.string("name").notNullable();
    table.date("date").notNullable();
    table.string("type").defaultTo("public"); // public, company, optional
    table.text("description");
    table.integer("year").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // Documents table
  await knex.schema.createTable("documents", (table) => {
    table.string("id").primary().defaultTo(knex.fn.uuid());
    table.string("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.string("name").notNullable();
    table.string("type").notNullable(); // contract, id_proof, certificate, other
    table.string("file_url").notNullable();
    table.text("description");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("documents");
  await knex.schema.dropTableIfExists("holidays");
  await knex.schema.dropTableIfExists("notifications");
  await knex.schema.dropTableIfExists("leave_balances");
}
