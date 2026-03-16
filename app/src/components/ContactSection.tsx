'use client';

import { useState, useRef, type FormEvent, type FocusEvent } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import TurnstileWidget, { type TurnstileWidgetHandle } from './TurnstileWidget';
import SuccessModal from './SuccessModal';
import CVPreviewModal from './CVPreviewModal';
import ScrollRevealText from './ScrollRevealText';


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
    viewCV: string;
    cvPreviewTitle: string;
    closeModal: string;
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
  'w-full rounded-xl border bg-[#0f0a14] px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none transition-shadow duration-200';
const INPUT_NORMAL =
  'border-white/10 focus:border-accent-cyan/60 focus:shadow-[0_0_12px_rgba(0,255,255,0.15)]';
const INPUT_ERROR =
  'border-red-500/60 focus:border-red-400 focus:shadow-[0_0_12px_rgba(255,80,80,0.2)]';

export default function ContactSection({
  locale,
  translations,
  turnstileSiteKey,
}: ContactSectionProps) {
  const reducedMotion = useReducedMotion();
  const [showCVPreview, setShowCVPreview] = useState(false);
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

  const isSubmitDisabled = status === 'sending' || !turnstileToken;

  return (
    <>
      <section id="contact" className="min-h-screen flex flex-col justify-center py-20">
        {/* Scroll Reveal Text — above the card */}
        <ScrollRevealText lines={[translations.revealLine1, translations.revealLine2]} />

        {/* Single glow card */}
        <motion.div
          initial={reducedMotion ? false : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-5% 0px' }}
          variants={fadeSlideUp}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-px"
          style={{
            background: 'linear-gradient(135deg, rgba(0,255,255,0.25), transparent 50%, rgba(0,255,255,0.12))',
            boxShadow: '0 0 25px rgba(0,255,255,0.08), 0 0 50px rgba(0,255,255,0.05)',
          }}
        >
          <div className="rounded-2xl bg-[#0f0a14] p-6 sm:p-8 lg:p-10">
            {/* Two-column layout inside the card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
              {/* Left: Form */}
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-foreground-subtle">
                    {translations.nameLabel}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    onBlur={handleBlur}
                    className={`${INPUT_BASE} ${fieldErrors.name ? INPUT_ERROR : INPUT_NORMAL}`}
                  />
                  {fieldErrors.name && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-foreground-subtle">
                    {translations.emailLabel}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    onBlur={handleBlur}
                    className={`${INPUT_BASE} ${fieldErrors.email ? INPUT_ERROR : INPUT_NORMAL}`}
                  />
                  {fieldErrors.email && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-foreground-subtle">
                    {translations.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    onBlur={handleBlur}
                    className={`${INPUT_BASE} resize-none ${fieldErrors.message ? INPUT_ERROR : INPUT_NORMAL}`}
                  />
                  {fieldErrors.message && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.message}</p>}
                </div>

                <div className="py-1">
                  <TurnstileWidget ref={turnstileRef} siteKey={turnstileSiteKey} onVerify={setTurnstileToken} />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="w-full rounded-xl border border-accent-cyan bg-accent-cyan-subtle px-6 py-3 text-sm font-semibold uppercase tracking-wider text-accent-cyan transition-all duration-200 hover:bg-accent-cyan hover:text-[#0f0a14] hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'sending' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />}
                  {status === 'sending' ? 'Sending...' : translations.sendButton}
                </button>

                {status === 'error' && errorMessage && (
                  <p className="text-red-400 text-xs text-center">{errorMessage}</p>
                )}
              </form>

              {/* Right: CV preview */}
              <div className="flex flex-col gap-3">
                  <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-white">
                    <object
                      data={`/cv-${locale}.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                      type="application/pdf"
                      className="pointer-events-none w-full"
                      style={{ height: '340px' }}
                      aria-label="CV Preview"
                    >
                      <div className="flex h-85 items-center justify-center bg-background-subtle">
                        <span className="text-sm text-foreground-subtle">PDF preview not available</span>
                      </div>
                    </object>
                  </div>

                  {/* CV buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCVPreview(true)}
                      className="flex-1 rounded-xl border border-accent-cyan bg-accent-cyan-subtle px-4 py-2.5 text-xs text-accent-cyan font-semibold uppercase tracking-wider hover:bg-accent-cyan hover:text-[#0f0a14] hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-200"
                    >
                      {translations.viewCV}
                    </button>
                    <button
                      onClick={handleDownloadCV}
                      className="flex-1 rounded-xl border border-accent-green bg-accent-green-subtle px-4 py-2.5 text-xs text-accent-green font-semibold uppercase tracking-wider hover:bg-accent-green hover:text-[#0f0a14] hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all duration-200 inline-flex items-center justify-center gap-2"
                    >
                      <span>{translations.downloadCV}</span>
                      <span>↓</span>
                    </button>
                  </div>
                </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Modals */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={translations.successModalTitle}
        message={translations.successModalMessage}
      />
      <CVPreviewModal
        isOpen={showCVPreview}
        onClose={() => setShowCVPreview(false)}
        locale={locale}
        title={translations.cvPreviewTitle}
        downloadLabel={translations.downloadCV}
        closeLabel={translations.closeModal}
      />
    </>
  );
}
