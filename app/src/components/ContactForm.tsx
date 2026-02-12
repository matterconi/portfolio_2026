'use client';

import { useState, useRef, type FormEvent, type FocusEvent } from 'react';
import TurnstileWidget, { type TurnstileWidgetHandle } from './TurnstileWidget';
import SuccessModal from './SuccessModal';

interface ContactFormProps {
  locale: string;
  turnstileSiteKey: string;
  labels: {
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    sendButton: string;
    successMessage: string;
    errorMessage: string;
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    messageRequired: string;
    messageMinLength: string;
    turnstileError: string;
    networkError: string;
    serverError: string;
    successModalTitle: string;
    successModalMessage: string;
  };
}

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactForm({ locale, turnstileSiteKey, labels }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Field validation
  const validateName = (value: string): string | undefined => {
    if (!value.trim()) return labels.nameRequired;
    if (value.trim().length < 2) return labels.nameRequired;
    return undefined;
  };

  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) return labels.emailRequired;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return labels.emailInvalid;
    return undefined;
  };

  const validateMessage = (value: string): string | undefined => {
    if (!value.trim()) return labels.messageRequired;
    if (value.trim().length < 10) return labels.messageMinLength;
    return undefined;
  };

  // Handle field blur validation
  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let error: string | undefined;

    switch (name) {
      case 'name':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'message':
        error = validateMessage(value);
        break;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Final validation
    const errors: FieldErrors = {
      name: validateName(name),
      email: validateEmail(email),
      message: validateMessage(message),
    };

    // Check if any errors exist
    if (errors.name || errors.email || errors.message) {
      setFieldErrors(errors);
      setStatus('error');
      setErrorMessage(labels.errorMessage);
      return;
    }

    // Check Turnstile token
    if (!turnstileToken) {
      setStatus('error');
      setErrorMessage(labels.turnstileError);
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          locale,
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'turnstile_failed') {
          setErrorMessage(labels.turnstileError);
        } else if (data.error === 'validation_failed') {
          setErrorMessage(labels.errorMessage);
        } else {
          setErrorMessage(labels.serverError);
        }
        setStatus('error');
        turnstileRef.current?.reset();
        setTurnstileToken('');
        return;
      }

      setStatus('success');
      setShowSuccessModal(true);
      form.reset();
      setFieldErrors({});
      turnstileRef.current?.reset();
      setTurnstileToken('');
    } catch {
      setStatus('error');
      setErrorMessage(labels.networkError);
      turnstileRef.current?.reset();
      setTurnstileToken('');
    }
  }

  const isSubmitDisabled = status === 'sending' || !turnstileToken;

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm text-foreground-muted mb-1">
            {labels.nameLabel}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            onBlur={handleBlur}
            className={`w-full rounded border ${
              fieldErrors.name
                ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                : 'border-border focus:border-accent-green focus:ring-accent-green'
            } bg-background-elevated px-4 py-2 text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1`}
          />
          {fieldErrors.name && (
            <p className="mt-1 text-sm text-red-400">{fieldErrors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm text-foreground-muted mb-1">
            {labels.emailLabel}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onBlur={handleBlur}
            className={`w-full rounded border ${
              fieldErrors.email
                ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                : 'border-border focus:border-accent-green focus:ring-accent-green'
            } bg-background-elevated px-4 py-2 text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1`}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm text-foreground-muted mb-1">
            {labels.messageLabel}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            onBlur={handleBlur}
            className={`w-full rounded border ${
              fieldErrors.message
                ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                : 'border-border focus:border-accent-green focus:ring-accent-green'
            } bg-background-elevated px-4 py-2 text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 resize-none`}
          />
          {fieldErrors.message && (
            <p className="mt-1 text-sm text-red-400">{fieldErrors.message}</p>
          )}
        </div>

        {/* Turnstile Widget */}
        <div className="py-2">
          <TurnstileWidget
            ref={turnstileRef}
            siteKey={turnstileSiteKey}
            onVerify={setTurnstileToken}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="rounded border border-accent-green bg-accent-green-subtle px-6 py-2 text-accent-green font-semibold hover:bg-accent-green hover:text-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {status === 'sending' && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-green"></div>
          )}
          {status === 'sending' ? 'Sending...' : labels.sendButton}
        </button>

        {/* Error Message */}
        {status === 'error' && errorMessage && (
          <p className="text-red-400 text-sm">{errorMessage}</p>
        )}
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={labels.successModalTitle}
        message={labels.successModalMessage}
      />
    </>
  );
}
