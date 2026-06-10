// Run this script once to initialize the database
// Prefer running /app/scripts/init-db.sql directly; this is a fallback.
import { createContactMessagesTable } from '@/lib/db';

async function setup() {
  try {
    await createContactMessagesTable();
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Database setup failed:', error);
  }
}

setup();
