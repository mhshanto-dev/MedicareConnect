'use client';
export function SkeletonCard({ className = '' }) {
  return (
    <div className={`animate-pulse bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 ${className}`}>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-3 w-3/4"></div>
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-2 w-1/2"></div>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
    </div>
  );
}
