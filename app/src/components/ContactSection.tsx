'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import ContactForm from './ContactForm';
import CVPreviewModal from './CVPreviewModal';
import type { SocialLinks } from '@data/types';

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
    socialLinks: string;
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
  };
  socialLinks: SocialLinks;
  turnstileSiteKey: string;
}

const fadeSlideUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function ContactSection({
  locale,
  translations,
  socialLinks,
  turnstileSiteKey,
}: ContactSectionProps) {
  const reducedMotion = useReducedMotion();
  const [showCVPreview, setShowCVPreview] = useState(false);

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = `/cv-${locale}.pdf`;
    link.download = `cv-${locale}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <section id="contact" className="min-h-screen flex flex-col justify-center py-20">
        {/* Section Title */}
        <motion.h2
          initial={reducedMotion ? false : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-10% 0px' }}
          variants={fadeSlideUp}
          transition={{ duration: 0.5 }}
          className="mb-8 text-2xl font-semibold text-accent-cyan"
        >
          {translations.title}
        </motion.h2>

        {/* Two-column layout */}
        <motion.div
          initial={reducedMotion ? false : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-5% 0px' }}
          variants={fadeSlideUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Left Column: Contact Form */}
          <div>
            <ContactForm
              locale={locale}
              turnstileSiteKey={turnstileSiteKey}
              labels={{
                nameLabel: translations.nameLabel,
                emailLabel: translations.emailLabel,
                messageLabel: translations.messageLabel,
                sendButton: translations.sendButton,
                successMessage: translations.successMessage,
                errorMessage: translations.errorMessage,
                nameRequired: translations.nameRequired,
                emailRequired: translations.emailRequired,
                emailInvalid: translations.emailInvalid,
                messageRequired: translations.messageRequired,
                messageMinLength: translations.messageMinLength,
                turnstileError: translations.turnstileError,
                networkError: translations.networkError,
                serverError: translations.serverError,
                successModalTitle: translations.successModalTitle,
                successModalMessage: translations.successModalMessage,
              }}
            />
          </div>

          {/* Right Column: Social Links & CV */}
          <div className="space-y-8">
            {/* Social Links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground-subtle">
                {translations.socialLinks}
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-border px-4 py-2 text-sm text-foreground-muted hover:border-accent-green hover:text-accent-green transition-colors inline-flex items-center justify-between"
                >
                  <span>GitHub</span>
                  <span>↗</span>
                </a>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-border px-4 py-2 text-sm text-foreground-muted hover:border-accent-green hover:text-accent-green transition-colors inline-flex items-center justify-between"
                >
                  <span>LinkedIn</span>
                  <span>↗</span>
                </a>
                <a
                  href={`mailto:${socialLinks.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-border px-4 py-2 text-sm text-foreground-muted hover:border-accent-green hover:text-accent-green transition-colors inline-flex items-center justify-between"
                >
                  <span>Email</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            {/* CV Controls */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground-subtle">
                CV
              </h3>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowCVPreview(true)}
                  className="rounded border border-accent-cyan bg-accent-cyan-subtle px-4 py-2 text-sm text-accent-cyan font-semibold hover:bg-accent-cyan hover:text-background transition-colors"
                >
                  {translations.viewCV}
                </button>
                <button
                  onClick={handleDownloadCV}
                  className="rounded border border-accent-green bg-accent-green-subtle px-4 py-2 text-sm text-accent-green font-semibold hover:bg-accent-green hover:text-background transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span>{translations.downloadCV}</span>
                  <span>↓</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CV Preview Modal */}
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
