import knex from "knex";
import dotenv from "dotenv";
import { URL } from "url";

dotenv.config();

const environment = process.env.NODE_ENV || "development";

const getConnection = () => {
  if (process.env.DB_URL) {
    try {
      const dbUrl = new URL(process.env.DB_URL);
      return {
        host: dbUrl.hostname,
        port: dbUrl.port || 5432,
        database: dbUrl.pathname.replace("/", ""),
        user: dbUrl.username,
        password: dbUrl.password,
        ssl: { rejectUnauthorized: false },
      };
    } catch (e) {
      return process.env.DB_URL;
    }
  }
  return {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "elegance_ems",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
  };
};

const config = {
  development: {
    client: "pg",
    connection: getConnection(),
    pool: {
      min: 2,
      max: 10,
    },
    ssl: { rejectUnauthorized: false },
  },
  production: {
    client: "pg",
    connection: getConnection(),
    pool: {
      min: 2,
      max: 10,
    },
    ssl: { rejectUnauthorized: false },
  },
};

const db = knex(config[environment]);

export default db;
