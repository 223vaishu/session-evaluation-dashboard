/**
 * Custom 404 Page (Next.js App Router convention)
 * 
 * Displayed when a user navigates to a route that doesn't exist.
 * Provides a branded error page with navigation back to the dashboard.
 */

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        <p className="text-7xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet bg-clip-text text-transparent">
          404
        </p>
        <h1 className="text-xl font-bold text-foreground">
          Page not found
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Check the URL or head back to the dashboard.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-violet text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md shadow-brand-cyan/20"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
