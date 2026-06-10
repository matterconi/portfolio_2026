import { sql } from "@vercel/postgres";
import { readFileSync } from "fs";
import { join } from "path";

/** Run database migrations by executing the init-db.sql schema file. */
export async function migrate() {
  console.log("Starting database migration...");

  try {
    const schemaPath = join(__dirname, "init-db.sql");
    const schema = readFileSync(schemaPath, "utf-8");

    await sql.query(schema);

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
