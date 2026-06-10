'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleReady = () => setVisible(false);
    window.addEventListener('shaderReady', handleReady);

    // Safety timeout: if shader never fires, hide after 3s
    const timer = setTimeout(() => setVisible(false), 3000);

    return () => {
      window.removeEventListener('shaderReady', handleReady);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
            <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted">
              Loading
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
