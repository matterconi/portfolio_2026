'use client';

import { useCallback, useEffect, useImperativeHandle, useRef, forwardRef } from 'react';

interface TurnstileWidgetProps {
  siteKey?: string;
  onError: (message: string) => void;
}

export interface TurnstileWidgetHandle {
  execute: () => Promise<string>;
  reset: () => void;
}

interface PendingTokenRequest {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
  timeoutId: number;
}

const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script';
const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TOKEN_WAIT_TIMEOUT_MS = 30_000;

const TurnstileWidget = forwardRef<TurnstileWidgetHandle, TurnstileWidgetProps>(
  ({ siteKey, onError }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const pendingTokenRequestRef = useRef<PendingTokenRequest | null>(null);
    const currentTokenRef = useRef('');
    const onErrorRef = useRef(onError);

    useEffect(() => {
      onErrorRef.current = onError;
    }, [onError]);

    const removeTurnstileWidget = useCallback(() => {
      currentTokenRef.current = '';

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }

      widgetIdRef.current = null;
    }, []);

    const rejectPendingTurnstile = useCallback((message: string) => {
      currentTokenRef.current = '';
      onErrorRef.current(message);

      const pending = pendingTokenRequestRef.current;
      if (!pending) return;

      window.clearTimeout(pending.timeoutId);
      pendingTokenRequestRef.current = null;
      pending.reject(new Error(message));
    }, []);

    const renderTurnstileWidget = useCallback(() => {
      if (!siteKey || !containerRef.current || widgetIdRef.current) {
        return widgetIdRef.current;
      }

      const turnstile = window.turnstile;
      if (!turnstile) return null;

      widgetIdRef.current = turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'dark',
        execution: 'render',
        'response-field': false,
        callback: (token: string) => {
          currentTokenRef.current = token;
          const pending = pendingTokenRequestRef.current;
          if (!pending) return;

          window.clearTimeout(pending.timeoutId);
          pendingTokenRequestRef.current = null;
          pending.resolve(token);
        },
        'expired-callback': () => {
          rejectPendingTurnstile('Security check expired. Please try again.');
        },
        'error-callback': (code?: string) => {
          console.warn('Turnstile error-callback:', code);
          rejectPendingTurnstile('Security check failed. Please try again.');
          removeTurnstileWidget();
          return true;
        },
        'timeout-callback': () => {
          rejectPendingTurnstile('Security check timed out. Please try again.');
          removeTurnstileWidget();
        },
      });

      return widgetIdRef.current;
    }, [rejectPendingTurnstile, removeTurnstileWidget, siteKey]);

    const resetTurnstileWidget = useCallback(() => {
      const pending = pendingTokenRequestRef.current;
      if (pending) {
        window.clearTimeout(pending.timeoutId);
        pendingTokenRequestRef.current = null;
      }

      removeTurnstileWidget();
    }, [removeTurnstileWidget]);

    const executeTurnstileChallenge = useCallback(async () => {
      if (!siteKey) return '';

      let widgetId = widgetIdRef.current;

      if (!window.turnstile || !widgetId) {
        widgetId = renderTurnstileWidget();
      }

      if (!window.turnstile || !widgetId) {
        throw new Error('Security check is still loading. Please try again.');
      }

      if (currentTokenRef.current) {
        return currentTokenRef.current;
      }

      return new Promise<string>((resolve, reject) => {
        const timeoutId = window.setTimeout(() => {
          currentTokenRef.current = '';
          pendingTokenRequestRef.current = null;
          removeTurnstileWidget();
          reject(new Error('Security check timed out. Please try again.'));
        }, TOKEN_WAIT_TIMEOUT_MS);

        pendingTokenRequestRef.current = {
          resolve,
          reject,
          timeoutId,
        };
      });
    }, [removeTurnstileWidget, renderTurnstileWidget, siteKey]);

    useImperativeHandle(ref, () => ({
      execute: executeTurnstileChallenge,
      reset: resetTurnstileWidget,
    }), [executeTurnstileChallenge, resetTurnstileWidget]);

    useEffect(() => {
      if (!siteKey) return;

      if (window.turnstile) {
        renderTurnstileWidget();
        return;
      }

      const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
      const script = existingScript ?? document.createElement('script');

      const handleLoad = () => {
        renderTurnstileWidget();
      };

      script.addEventListener('load', handleLoad);

      if (!existingScript) {
        script.id = TURNSTILE_SCRIPT_ID;
        script.src = TURNSTILE_SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      return () => {
        script.removeEventListener('load', handleLoad);
      };
    }, [renderTurnstileWidget, siteKey]);

    useEffect(() => {
      return () => {
        const pending = pendingTokenRequestRef.current;
        if (pending) {
          window.clearTimeout(pending.timeoutId);
          pendingTokenRequestRef.current = null;
        }

        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
    }, []);

    return <div ref={containerRef} aria-label="Security check" className="mb-4 flex justify-center" />;
  }
);

TurnstileWidget.displayName = 'TurnstileWidget';

export default TurnstileWidget;

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        theme: 'dark' | 'light' | 'auto';
        execution: 'execute' | 'render';
        'response-field': boolean;
        callback: (token: string) => void;
        'expired-callback': () => void;
        'error-callback': (code?: string) => boolean;
        'timeout-callback': () => void;
      }) => string;
      execute: (widgetId: string) => void;
      getResponse?: (widgetId: string) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}
