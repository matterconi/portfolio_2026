# Contact API Implementation Guide

## Overview

The contact form API provides secure message submission with Cloudflare Turnstile verification and email delivery via Resend. All submissions are logged to Vercel Postgres with metadata tracking and email delivery status.

## Architecture

### Request Flow

1. **Client Submission** → POST `/api/contact` with contact data and Turnstile token
2. **Validation** → Server validates all required fields and email format
3. **Anti-Spam** → Cloudflare Turnstile token verification (server-side)
4. **Database** → Store message with metadata (IP, user agent, locale)
5. **Email** → Send via Resend to configured recipient
6. **Status Update** → Update database with email delivery status
7. **Response** → Return success/error to client

### Database Schema

```sql
CREATE TABLE contact_messages (
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

CREATE INDEX idx_created_at ON contact_messages(created_at DESC);
CREATE INDEX idx_email_sent ON contact_messages(email_sent);
```

## Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_URL` | Vercel Postgres connection string | `postgresql://user:pass@host/db` |
| `RESEND_API_KEY` | Resend API key for email sending | `re_xxx...` |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key | `0x4xxx...` |
| `CONTACT_EMAIL_TO` | Recipient email for submissions | `admin@example.com` |
| `CONTACT_EMAIL_FROM` | Sender email (optional) | `noreply@yourdomain.com` |

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install resend
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in all required values
   - Ensure Resend sender domain is verified

3. **Run Database Migration**
   ```bash
   npm run db:migrate
   ```

4. **Verify Configuration**
   - Check that all env vars are set
   - Test Turnstile token generation on frontend
   - Confirm Resend domain verification

## API Contract

### Request

**Endpoint:** `POST /api/contact`

**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'm interested in your services.",
  "turnstileToken": "0.xxxxx...",
  "locale": "en"
}
```

**Field Validation:**
- `name`: Required, non-empty string
- `email`: Required, valid email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- `message`: Required, non-empty string
- `turnstileToken`: Required, valid Turnstile token
- `locale`: Required, must be `"en"` or `"it"`

### Response

**Success (200):**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Invalid email format"
}
```

**Captcha Error (400):**
```json
{
  "success": false,
  "error": "Invalid captcha verification"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "error": "Failed to send message. Please try again."
}
```

## Security & Rate Limiting

### Anti-Spam Protection

1. **Primary: Cloudflare Turnstile**
   - Server-side token verification
   - Prevents automated bot submissions
   - Validates IP address against token

2. **Secondary: Vercel Built-in Rate Limiting**
   - Automatic protection by Vercel Edge Network
   - No additional configuration needed

3. **Database Audit Trail**
   - All submissions logged with IP and user agent
   - Enables pattern analysis for abuse detection
   - Supports manual review if needed

### Future Enhancements

- Per-IP throttling (if abuse patterns emerge)
- Email notification for high submission rates
- Admin dashboard for message review

## Testing

### Manual Testing Checklist

#### Valid Submission
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message",
    "turnstileToken": "VALID_TOKEN_HERE",
    "locale": "en"
  }'
```
**Expected:** 200 response, email received, database record created

#### Missing Fields
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com"
  }'
```
**Expected:** 400 "All fields are required"

#### Invalid Email
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "message": "Test",
    "turnstileToken": "TOKEN",
    "locale": "en"
  }'
```
**Expected:** 400 "Invalid email format"

#### Invalid Locale
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test",
    "turnstileToken": "TOKEN",
    "locale": "fr"
  }'
```
**Expected:** 400 "Invalid locale. Must be 'en' or 'it'"

#### Invalid Turnstile Token
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test",
    "turnstileToken": "INVALID_TOKEN",
    "locale": "en"
  }'
```
**Expected:** 400 "Invalid captcha verification"

### Database Verification

After successful submission, verify database record:

```sql
SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 1;
```

**Expected fields:**
- `id`: Auto-generated
- `name`, `email`, `message`, `locale`: As submitted
- `ip_address`: Client IP from headers
- `user_agent`: Client user agent
- `created_at`: Timestamp
- `email_sent`: `true` if email succeeded
- `email_sent_at`: Timestamp if email succeeded
- `email_error`: `null` if email succeeded, error message if failed

### Email Verification

1. Check recipient inbox for email
2. Verify email contains:
   - Sender name and email
   - Message content
   - Locale indicator
   - Timestamp
3. Confirm "from" address matches configuration

## Troubleshooting

### Email Not Sending

1. **Check Resend API Key**
   - Verify key is valid and not expired
   - Check API usage limits

2. **Verify Sender Domain**
   - Domain must be verified in Resend dashboard
   - Update `CONTACT_EMAIL_FROM` if needed

3. **Review Logs**
   - Check server logs for email errors
   - Look for specific Resend error messages

### Turnstile Verification Failing

1. **Verify Secret Key**
   - Ensure `TURNSTILE_SECRET_KEY` matches dashboard
   - Check for typos or whitespace

2. **Check Token Freshness**
   - Tokens expire after short period
   - Frontend must generate new token per submission

3. **Review IP Matching**
   - Ensure IP extraction from headers is correct
   - Test with and without IP parameter

### Database Errors

1. **Connection Issues**
   - Verify `POSTGRES_URL` is correct
   - Check database is accessible from server

2. **Migration Status**
   - Ensure table exists: `npm run db:migrate`
   - Verify indexes are created

3. **Type Mismatches**
   - Check data types match schema
   - Review `ContactMessage` interface alignment

## Maintenance

### Monitoring

- Track `email_sent = false` records for delivery issues
- Monitor Turnstile failure rates for abuse patterns
- Review database growth and consider archival strategy

### Routine Tasks

- Rotate Resend API keys periodically
- Review and clean old contact messages
- Update Turnstile configuration if abuse increases

## Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Cloudflare Turnstile Docs](https://developers.cloudflare.com/turnstile/)
- [Vercel Postgres Guide](https://vercel.com/docs/storage/vercel-postgres)
