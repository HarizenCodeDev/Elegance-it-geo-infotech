import knex from "knex";
import dotenv from "dotenv";
import knexConfig from "../knexfile.js";

dotenv.config();

const environment = process.env.NODE_ENV || "development";
const db = knex(knexConfig[environment]);

export default db;
