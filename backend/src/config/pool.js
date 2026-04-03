import { Pool } from "pg";
import { env } from "./env.js";

if (!env.DB_URI) {
  throw new Error("DATABASE_URL must be defined in .env");
}

export const pool = new Pool({
  connectionString: env.DB_URI,

  // Neon requires SSL
  ssl: {
    rejectUnauthorized: false,
  },

  // Pool settings
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});
