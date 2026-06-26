'use client';
export function StatusBadge({ status }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  };
  const color = colors[status?.toLowerCase()] || colors.pending;
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${color}`}>
      {status}
    </span>
  );
}
