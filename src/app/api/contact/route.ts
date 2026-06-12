import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Type definitions
interface ContactFormData {
  name: string;
  email: string;
  message: string;
  turnstileToken: string;
  locale: string;
  formStartedAt?: number;
}

interface ContactAPIResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MIN_SUBMIT_TIME_MS = 1500;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_LINKS_IN_MESSAGE = 3;
const rateLimitStore = new Map<string, number[]>();

// Environment variables validation
function validateEnvVars(): { valid: boolean; missing?: string[] } {
  const required = [
    'RESEND_API_KEY',
    'CONTACT_EMAIL_TO',
  ];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return { valid: false, missing };
  }

  return { valid: true };
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function countLinks(value: string): number {
  return value.match(/https?:\/\/|www\./gi)?.length ?? 0;
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recentRequests = (rateLimitStore.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitStore.set(ip, recentRequests);
    return true;
  }

  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);
  return false;
}

// Verify Cloudflare Turnstile token
async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<{ success: boolean; error?: string }> {
  if (process.env.NODE_ENV !== 'production') {
    return { success: true };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return { success: false, error: 'Turnstile secret is not configured' };
  }

  if (!token) {
    return { success: false, error: 'Missing challenge token' };
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret,
          response: token,
          remoteip: remoteIp,
        }),
      }
    );

    const data: TurnstileVerifyResponse | null = await response.json().catch(() => null);

    if (!response.ok || !data?.success) {
      console.error('Turnstile verification failed:', data?.['error-codes']);
      return { success: false, error: 'Challenge verification failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return { success: false, error: 'Challenge verification failed' };
  }
}

// Send contact email via Resend
async function sendContactEmail(
  name: string,
  email: string,
  message: string,
  locale: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const timestamp = new Date().toISOString();

    const emailBody = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Locale: ${locale.toUpperCase()}
Timestamp: ${timestamp}

Message:
${message}

---
This message was sent via the portfolio contact form.
    `.trim();

    await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL_TO!,
      subject: `New Contact Form Submission - ${locale.toUpperCase()}`,
      text: emailBody,
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Email sending error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ContactAPIResponse>> {
  try {
    // Parse and validate request body
    const body: ContactFormData = await request.json();
    const name = normalizeString(body.name);
    const email = normalizeString(body.email).toLowerCase();
    const message = normalizeString(body.message);
    const turnstileToken = normalizeString(body.turnstileToken);
    const locale = normalizeString(body.locale);

    // Extract IP address and user agent
    const ip_address = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
    const user_agent = request.headers.get('user-agent') ?? null;
    const rateLimitKey = ip_address ?? 'unknown';

    // Validate required fields
    if (!name || !email || !message || !locale) {
      return NextResponse.json(
        { success: false, error: 'validation_failed' },
        { status: 400 }
      );
    }

    if (typeof body.formStartedAt === 'number' && Date.now() - body.formStartedAt < MIN_SUBMIT_TIME_MS) {
      return NextResponse.json(
        { success: false, error: 'validation_failed' },
        { status: 400 }
      );
    }

    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    if (
      name.length > MAX_NAME_LENGTH ||
      email.length > MAX_EMAIL_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH ||
      countLinks(message) > MAX_LINKS_IN_MESSAGE
    ) {
      return NextResponse.json(
        { success: false, error: 'validation_failed' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'validation_failed' },
        { status: 400 }
      );
    }

    // Validate locale
    if (locale !== 'en' && locale !== 'it') {
      return NextResponse.json(
        { success: false, error: 'validation_failed' },
        { status: 400 }
      );
    }

    const turnstileResult = await verifyTurnstileToken(turnstileToken, ip_address ?? undefined);
    if (!turnstileResult.success) {
      return NextResponse.json(
        { success: false, error: turnstileResult.error ?? 'Challenge verification failed' },
        { status: 400 }
      );
    }

    // Validate environment variables only after the anti-spam and Turnstile checks pass.
    const envCheck = validateEnvVars();
    if (!envCheck.valid) {
      console.error('Server configuration error - missing env vars:', envCheck.missing);
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Please contact the administrator.' },
        { status: 500 }
      );
    }

    // Save to database (optional – skip if no DB configured)
    let messageId: number | undefined;
    if (process.env.POSTGRES_URL) {
      try {
        const { saveContactMessage } = await import('@/lib/db');
        const savedMessage = await saveContactMessage({
          name,
          email,
          message,
          locale,
          ip_address,
          user_agent,
        });
        messageId = savedMessage.id;
      } catch (dbError) {
        console.error('Database insert error:', dbError);
        // Continue to email sending - database is secondary
      }
    }

    // Send email via Resend
    const emailResult = await sendContactEmail(name, email, message, locale);

    // Update email status in database if we have a message ID
    if (messageId) {
      try {
        const { updateEmailStatus } = await import('@/lib/db');
        await updateEmailStatus(
          messageId,
          emailResult.success,
          emailResult.error
        );
      } catch (updateError) {
        console.error('Failed to update email status:', updateError);
        // Don't fail the request if status update fails
      }
    }

    // Return response based on email result
    if (emailResult.success) {
      return NextResponse.json(
        { success: true, message: 'Message sent successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
