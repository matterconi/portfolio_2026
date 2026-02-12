'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CVPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  title: string;
  downloadLabel: string;
  closeLabel: string;
}

export default function CVPreviewModal({
  isOpen,
  onClose,
  locale,
  title,
  downloadLabel,
  closeLabel,
}: CVPreviewModalProps) {
  const reducedMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(true);
  const cvPath = `/cv-${locale}.pdf`;

  // Reset loading state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = cvPath;
    link.download = `cv-${locale}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={reducedMotion ? { scale: 1 } : { scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl h-[80vh] rounded-lg border border-accent-cyan bg-background-elevated shadow-[0_0_30px_rgba(0,255,255,0.2)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-accent-cyan">{title}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="rounded border border-accent-green bg-accent-green-subtle px-4 py-1.5 text-sm text-accent-green font-semibold hover:bg-accent-green hover:text-background transition-colors"
                >
                  {downloadLabel} ↓
                </button>
                <button
                  onClick={onClose}
                  className="text-foreground-subtle hover:text-accent-cyan transition-colors p-1"
                  aria-label="Close modal"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 5L5 15M5 5l10 10" />
                  </svg>
                </button>
              </div>
            </div>

            {/* PDF Iframe */}
            <div className="flex-1 relative overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background-elevated">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan"></div>
                </div>
              )}
              <iframe
                src={cvPath}
                className="w-full h-full"
                title={title}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border flex justify-end">
              <button
                onClick={onClose}
                className="rounded border border-border px-4 py-2 text-sm text-foreground-muted hover:border-accent-cyan hover:text-accent-cyan transition-colors"
              >
                {closeLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
