# Lib Directory

Utility functions and service configurations for the portfolio.

## Data Loading (`data.ts`)

Provides locale-aware data loading functions that dynamically import JSON content.

### Functions

- `getProjects(locale)` - Returns all projects for the given locale
- `getCourses(locale)` - Returns all courses/certifications
- `getSkills(locale)` - Returns all technical skills
- `getAbout(locale)` - Returns personal info (name, bio, etc.)
- `getSocial(locale)` - Returns social/contact links
- `getPortfolioData(locale)` - Aggregates all of the above into a single `PortfolioData` object

### Usage

```typescript
import { getPortfolioData } from "@lib/data";

// In a Next.js server component
export default async function Page() {
  const data = await getPortfolioData("en");
  return <h1>{data.about.name}</h1>;
}
```

All functions accept `"en"` or `"it"` as the locale parameter.

## Database (`db.ts`)

Wraps `@vercel/postgres` for type-safe database queries. Requires `POSTGRES_URL` environment variable (configured automatically on Vercel).

### Usage

```typescript
import { sql } from "@lib/db";

const result = await sql`SELECT * FROM contact_messages WHERE id = ${id}`;
```

## Database Migration

Run the migration script to create the `contact_messages` table:

```bash
npm run db:migrate
```

This executes `scripts/init-db.sql` which creates the table and indexes. Requires `POSTGRES_URL` to be set in the environment.
