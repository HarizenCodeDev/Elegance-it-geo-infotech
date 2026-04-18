import knex from "knex";
import dotenv from "dotenv";
import knexConfig from "../knexfile.js";

dotenv.config();

const connectionString = process.env.DATABASE_URL || process.env.DB_URL;

// Use knexConfig for Supabase connection
if (connectionString && connectionString.includes("supabase.co")) {
  const environment = process.env.NODE_ENV || "production";
  const finalConfig = knexConfig[environment];
  const db = knex(finalConfig);
  export default db;
} else {
  const environment = process.env.NODE_ENV || "development";
  const db = knex(knexConfig[environment]);
  export default db;
}