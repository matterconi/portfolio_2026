'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

let moduleLoaded = false;

function isAlreadyLoaded() {
  return moduleLoaded;
}

function markLoaded() {
  moduleLoaded = true;
  try { document.cookie = 'pageLoaderSeen=1; path=/; samesite=lax'; } catch {}
}

function clearLoadedCookie() {
  try { document.cookie = 'pageLoaderSeen=; path=/; max-age=0; samesite=lax'; } catch {}
}

export default function PageLoader({ initiallyVisible = true }: { initiallyVisible?: boolean }) {
  const [visible, setVisible] = useState(() => initiallyVisible && !isAlreadyLoaded());

  useEffect(() => {
    window.addEventListener('pagehide', clearLoadedCookie);
    return () => window.removeEventListener('pagehide', clearLoadedCookie);
  }, []);

  useEffect(() => {
    if (isAlreadyLoaded()) return;

    const done = () => {
      markLoaded();
      setVisible(false);
    };

    window.addEventListener('shaderReady', done);
    const timer = setTimeout(done, 3000);

    return () => {
      window.removeEventListener('shaderReady', done);
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
          className="fixed inset-0 z-9999 flex items-center justify-center bg-background"
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
