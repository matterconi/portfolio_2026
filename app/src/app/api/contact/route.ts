import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Type definitions
interface ContactFormData {
  name: string;
  email: string;
  message: string;
  turnstileToken: string;
  locale: string;
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

// Environment variables validation
function validateEnvVars(): { valid: boolean; missing?: string[] } {
  const required = [
    'RESEND_API_KEY',
    'TURNSTILE_SECRET_KEY',
    'CONTACT_EMAIL_TO',
    'POSTGRES_URL'
  ];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return { valid: false, missing };
  }

  return { valid: true };
}

// Verify Cloudflare Turnstile token
async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<boolean> {
  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: remoteIp,
        }),
      }
    );

    const data: TurnstileVerifyResponse = await response.json();

    if (!data.success) {
      console.error('Turnstile verification failed:', data['error-codes']);
    }

    return data.success;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
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
      from: process.env.CONTACT_EMAIL_FROM || 'noreply@yourdomain.com',
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
    // Validate environment variables
    const envCheck = validateEnvVars();
    if (!envCheck.valid) {
      console.error('Server configuration error - missing env vars:', envCheck.missing);
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Please contact the administrator.' },
        { status: 500 }
      );
    }

    // Parse and validate request body
    const body: ContactFormData = await request.json();
    const { name, email, message, turnstileToken, locale } = body;

    // Validate required fields
    if (!name || !email || !message || !turnstileToken || !locale) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate locale
    if (locale !== 'en' && locale !== 'it') {
      return NextResponse.json(
        { success: false, error: 'Invalid locale. Must be "en" or "it"' },
        { status: 400 }
      );
    }

    // Extract IP address and user agent
    const ip_address = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
    const user_agent = request.headers.get('user-agent') ?? null;

    // Verify Turnstile token
    const turnstileValid = await verifyTurnstileToken(turnstileToken, ip_address ?? undefined);
    if (!turnstileValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid captcha verification' },
        { status: 400 }
      );
    }

    // Save to database
    let messageId: number | undefined;
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
