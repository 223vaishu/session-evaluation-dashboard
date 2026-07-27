/**
 * Route Loading Skeleton (Next.js App Router convention)
 * 
 * Automatically displayed by Next.js while a route segment is loading.
 * Uses Suspense boundaries under the hood — no manual wiring needed.
 * 
 * The skeleton mimics the dashboard layout shape (header → KPI cards → content grid)
 * so the user perceives structure loading rather than a blank spinner.
 */

export default function Loading() {
  return (
    <div className="p-4 md:p-8 animate-pulse space-y-6 max-w-7xl mx-auto">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-muted rounded-xl" />
          <div className="h-4 w-40 bg-muted/60 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-48 bg-muted rounded-xl" />
          <div className="h-10 w-32 bg-muted rounded-xl" />
        </div>
      </div>

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-panel rounded-2xl p-5 space-y-3">
            <div className="h-4 w-24 bg-muted rounded-lg" />
            <div className="h-8 w-20 bg-muted/80 rounded-lg" />
            <div className="h-3 w-32 bg-muted/50 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Table skeleton */}
          <div className="glass-panel rounded-2xl p-5 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-full bg-muted/60 rounded-lg" />
              </div>
            ))}
          </div>
          {/* Chart skeleton */}
          <div className="glass-panel rounded-2xl h-72" />
        </div>
        {/* Sidebar skeleton */}
        <div className="glass-panel rounded-2xl h-96" />
      </div>
    </div>
  );
}
