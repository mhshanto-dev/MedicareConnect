'use client';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { CreditCard, DollarSign, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Payments() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  // Fetch payments
  const { data, isLoading } = useQuery({
    queryKey: ['adminPayments', status, page],
    queryFn: async () => {
      const res = await api.get(`/admin/payments?status=${status}&page=${page}&limit=10`);
      return res.data;
    }
  });

  useEffect(() => {
    document.title = 'Manage Payments | MediCare Connect';
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Manage Payments</h1>
        <SkeletonCard />
      </div>
    );
  }

  const payments = data?.payments || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Manage Payments</h1>
          <p className="text-slate-500 mt-1">Platform billing history, invoices, and Stripe merchant records</p>
        </div>

        {/* Filter */}
        <div className="w-full sm:w-48 relative">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="block w-full px-3 py-2.5 border rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="succeeded">Succeeded</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="No Payments" description="No platform payment history found." />
      ) : (
        <div className="bg-white dark:bg-slate-800 border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 sm:p-6">Stripe / Intent ID</th>
                  <th className="p-4 sm:p-6">Patient</th>
                  <th className="p-4 sm:p-6">Doctor</th>
                  <th className="p-4 sm:p-6">Billing Date</th>
                  <th className="p-4 sm:p-6">Amount</th>
                  <th className="p-4 sm:p-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                {payments.map((p, idx) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-750 transition-colors"
                  >
                    <td className="p-4 sm:p-6 font-mono text-xs text-slate-500 max-w-[150px] truncate" title={p.stripePaymentIntentId}>
                      {p.stripePaymentIntentId || 'Manual / N/A'}
                    </td>
                    <td className="p-4 sm:p-6 font-bold text-slate-900 dark:text-white">
                      {p.patientId?.name || 'Anonymous Patient'}
                    </td>
                    <td className="p-4 sm:p-6 text-slate-700 dark:text-slate-350">
                      Dr. {p.appointmentId?.doctorId?.userId?.name || 'Specialist'}
                    </td>
                    <td className="p-4 sm:p-6 text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 sm:p-6 font-bold text-slate-900 dark:text-white">
                      ${p.amount}
                    </td>
                    <td className="p-4 sm:p-6">
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold capitalize">
                        {p.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex items-center justify-center px-3 py-1 bg-blue-600 text-white rounded font-bold text-xs">
                {page} / {totalPages}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
