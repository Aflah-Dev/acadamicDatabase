import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../config/pool.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runSeed = async () => {
  const seedFilePath = path.join(__dirname, "seed.sql");

  try {
    console.log("Running seed data...");
    const sql = await fs.readFile(seedFilePath, "utf8");
    await pool.query(sql);
    console.log("Seed completed successfully.");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

runSeed();
