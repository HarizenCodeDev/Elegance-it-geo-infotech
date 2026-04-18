import knex from "knex";
import dotenv from "dotenv";
import knexConfig from "../knexfile.js";

dotenv.config();

const env = process.env.NODE_ENV || "production";
const db = knex(knexConfig[env]);

export default db;