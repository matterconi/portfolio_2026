import { sql } from '@vercel/postgres';
import { ContactMessage } from '@data/types';

// Initialize database table (run once via migration or setup script)
export async function createContactMessagesTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      locale VARCHAR(2) NOT NULL,
      ip_address VARCHAR(45),
      user_agent TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      email_sent BOOLEAN DEFAULT FALSE,
      email_sent_at TIMESTAMP,
      email_error TEXT
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_created_at ON contact_messages(created_at DESC);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_email_sent ON contact_messages(email_sent);`;
}

// Insert a new contact message
export async function saveContactMessage(
  message: Omit<ContactMessage, 'id' | 'created_at' | 'email_sent' | 'email_sent_at' | 'email_error'>
): Promise<ContactMessage> {
  const result = await sql`
    INSERT INTO contact_messages (name, email, message, locale, ip_address, user_agent)
    VALUES (${message.name}, ${message.email}, ${message.message}, ${message.locale}, ${message.ip_address ?? null}, ${message.user_agent ?? null})
    RETURNING *;
  `;

  return result.rows[0] as ContactMessage;
}

// Fetch all contact messages (for admin view, if needed later)
export async function getAllContactMessages(): Promise<ContactMessage[]> {
  const result = await sql`
    SELECT * FROM contact_messages
    ORDER BY created_at DESC;
  `;

  return result.rows as ContactMessage[];
}

// Update email status after sending attempt
export async function updateEmailStatus(
  messageId: number,
  sent: boolean,
  error?: string
): Promise<ContactMessage> {
  const result = await sql`
    UPDATE contact_messages
    SET
      email_sent = ${sent},
      email_sent_at = ${sent ? sql`NOW()` : null},
      email_error = ${error ?? null}
    WHERE id = ${messageId}
    RETURNING *;
  `;

  return result.rows[0] as ContactMessage;
}
