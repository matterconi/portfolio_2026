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

CREATE INDEX IF NOT EXISTS idx_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_sent ON contact_messages(email_sent);
