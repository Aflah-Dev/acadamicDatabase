import { pool} from "./pool.js";

export const testConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✓ PostgreSQL connected:", result.rows[0].now);
  } catch (error) {
    console.error("✗ Database connection failed:", error.message);
    process.exit(1);
  }
};