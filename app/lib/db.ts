import { sql } from "@vercel/postgres";

/**
 * Database wrapper for type-safe Vercel Postgres queries.
 *
 * Usage:
 * ```ts
 * import { db } from "@/lib/db";
 * const result = await db.query("SELECT * FROM contact_messages");
 * ```
 *
 * The `sql` template literal from @vercel/postgres handles connection
 * pooling and parameterized queries automatically.
 */
export const db = {
  /** Execute a raw SQL query using the Vercel Postgres connection pool. */
  query: sql,
};

export { sql };
