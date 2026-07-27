'use client';

/**
 * Global Error Boundary (Next.js App Router convention)
 * 
 * This component catches unhandled runtime errors in any route segment.
 * It wraps the nearest route in a React Error Boundary, providing a
 * graceful fallback UI instead of a white screen crash.
 * 
 * Key design decisions:
 * - Uses `reset()` from Next.js to attempt re-render without full page reload
 * - Logs error to console (in production, this would go to a service like Sentry)
 * - Styled consistently with the dashboard's glass-panel design system
 */

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, send this to an error reporting service (e.g. Sentry, LogRocket)
    console.error('[ErrorBoundary] Unhandled error caught:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="glass-panel rounded-2xl p-8 max-w-md w-full text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-lg font-bold text-foreground">Something went wrong</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          An unexpected error occurred while rendering this page.
          This has been logged for investigation.
        </p>
        {error.message && (
          <pre className="text-[10px] text-left bg-muted/50 p-3 rounded-xl overflow-x-auto text-muted-foreground font-mono">
            {error.message}
          </pre>
        )}
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-violet text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md shadow-brand-cyan/20"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
