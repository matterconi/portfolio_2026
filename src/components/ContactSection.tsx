'use client';

import { useState, useRef, type FormEvent, type FocusEvent } from 'react';
import { motion } from 'framer-motion';
import { Download, Send } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import TurnstileWidget, { type TurnstileWidgetHandle } from './TurnstileWidget';
import SuccessModal from './SuccessModal';
import ScrollRevealText from './ScrollRevealText';
import CircularCTA from './CircularCTA';

interface ContactSectionProps {
  locale: string;
  translations: {
    title: string;
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    sendButton: string;
    successMessage: string;
    errorMessage: string;
    downloadCV: string;
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
    revealLine1: string;
    revealLine2: string;
    revealDescription: string;
  };
  turnstileSiteKey: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const fadeSlideUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const INPUT_BASE =
  'w-full border-0 border-b bg-transparent px-0 py-3 text-sm text-white placeholder:text-foreground-subtle focus:outline-none transition-colors duration-200';
const INPUT_NORMAL =
  'border-white/10 focus:border-accent-cyan';
const INPUT_ERROR =
  'border-red-500/60 focus:border-red-400';

export default function ContactSection({
  locale,
  translations,
  turnstileSiteKey,
}: ContactSectionProps) {
  const reducedMotion = useReducedMotion();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [turnstileToken, setTurnstileToken] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = `/cv-${locale}.pdf`;
    link.download = `cv-${locale}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validateName = (value: string): string | undefined => {
    if (!value.trim() || value.trim().length < 2) return translations.nameRequired;
    return undefined;
  };

  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) return translations.emailRequired;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return translations.emailInvalid;
    return undefined;
  };

  const validateMessage = (value: string): string | undefined => {
    if (!value.trim()) return translations.messageRequired;
    if (value.trim().length < 10) return translations.messageMinLength;
    return undefined;
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let error: string | undefined;
    switch (name) {
      case 'name': error = validateName(value); break;
      case 'email': error = validateEmail(value); break;
      case 'message': error = validateMessage(value); break;
    }
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
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

    const errors: FieldErrors = {
      name: validateName(name),
      email: validateEmail(email),
      message: validateMessage(message),
    };

    if (errors.name || errors.email || errors.message) {
      setFieldErrors(errors);
      setStatus('error');
      setErrorMessage(translations.errorMessage);
      return;
    }

    if (!turnstileToken) {
      setStatus('error');
      setErrorMessage(translations.turnstileError);
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, locale, turnstileToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'turnstile_failed') setErrorMessage(translations.turnstileError);
        else if (data.error === 'validation_failed') setErrorMessage(translations.errorMessage);
        else setErrorMessage(translations.serverError);
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
      setErrorMessage(translations.networkError);
      turnstileRef.current?.reset();
      setTurnstileToken('');
    }
  }

  const isSubmitDisabled = status === 'sending';

  return (
    <>
      <section id="contact" className="min-h-screen flex flex-col justify-center py-20">
        <ScrollRevealText lines={[translations.revealLine1, translations.revealLine2]} />
        <p className="text-center text-lg text-foreground-subtle -mt-12 mb-20">{translations.revealDescription}</p>

        <motion.div
          initial={reducedMotion ? false : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-5% 0px' }}
          variants={fadeSlideUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto w-full max-w-2xl"
        >
          <div
            className="rounded-2xl p-px"
            style={{
              background: 'linear-gradient(135deg, rgba(0,255,255,0.25), transparent 50%, rgba(0,255,255,0.12))',
              boxShadow: '0 0 25px rgba(0,255,255,0.08), 0 0 50px rgba(0,255,255,0.05)',
            }}
          >
            <div className="rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] p-6 sm:p-8 lg:p-12">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="mx-auto w-full max-w-md space-y-6"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-xs font-semibold uppercase tracking-widest text-white"
                  >
                    {translations.nameLabel} <span className="text-accent-cyan">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Who's reaching out?"
                    onBlur={handleBlur}
                    className={`${INPUT_BASE} ${fieldErrors.name ? INPUT_ERROR : INPUT_NORMAL}`}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1.5 text-xs text-red-400">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-xs font-semibold uppercase tracking-widest text-white"
                  >
                    {translations.emailLabel} <span className="text-accent-cyan">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Where can we reach you?"
                    onBlur={handleBlur}
                    className={`${INPUT_BASE} ${fieldErrors.email ? INPUT_ERROR : INPUT_NORMAL}`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1.5 text-xs text-red-400">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1 block text-xs font-semibold uppercase tracking-widest text-white"
                  >
                    {translations.messageLabel} <span className="text-accent-cyan">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="What would you like to discuss?"
                    onBlur={handleBlur}
                    className={`${INPUT_BASE} resize-none ${fieldErrors.message ? INPUT_ERROR : INPUT_NORMAL}`}
                  />
                  {fieldErrors.message && (
                    <p className="mt-1.5 text-xs text-red-400">{fieldErrors.message}</p>
                  )}
                </div>

                <div className="py-1">
                  <TurnstileWidget
                    ref={turnstileRef}
                    siteKey={turnstileSiteKey}
                    onVerify={setTurnstileToken}
                  />
                </div>

                <div className="flex flex-col items-center gap-4 pt-2">
                  {status === 'sending' && (
                    <div className="flex h-36 w-36 items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white" />
                    </div>
                  )}
                </div>

                {status === 'error' && errorMessage && (
                  <p className="text-center text-xs text-red-400">{errorMessage}</p>
                )}
              </form>

              <div className="flex flex-col items-center gap-12 mt-8 relative z-10">
                {status !== 'sending' && (
                  <>
                    <CircularCTA
                      label={translations.sendButton}
                      onClick={() => formRef.current?.requestSubmit()}
                      disabled={isSubmitDisabled}
                    >
                      <Send className="h-8 w-8" />
                    </CircularCTA>

                    <div
                      className="rounded-full p-px"
                      style={{
                        background: 'linear-gradient(135deg, #ffffff40, transparent 50%, #ffffff20)',
                        boxShadow: '0 0 25px #ffffff15, 0 0 50px #ffffff0d',
                      }}
                    >
                      <button
                        type="button"
                        onClick={handleDownloadCV}
                        className="inline-flex items-center gap-1.5 rounded-full bg-black/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground-muted transition-colors hover:text-accent-cyan"
                      >
                        <Download className="h-4 w-4" />
                        <span>{translations.downloadCV}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={translations.successModalTitle}
        message={translations.successModalMessage}
      />
    </>
  );
}
