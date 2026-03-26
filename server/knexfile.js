import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    client: "better-sqlite3",
    connection: {
      filename: "./data/elegance.db",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./migrations",
      extension: "js",
    },
    seeds: {
      directory: "./seeds",
      extension: "js",
    },
  },
  production: {
    client: "pg",
    connection: process.env.DB_URL,
    ssl: { rejectUnauthorized: false },
    migrations: {
      directory: "./migrations",
      extension: "js",
    },
  },
};
