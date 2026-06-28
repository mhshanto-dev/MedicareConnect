'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { CreditCard, Calendar, ArrowUpRight, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Payments() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['myPayments'],
    queryFn: async () => (await api.get('/payments')).data
  });

  useEffect(() => {
    document.title = 'Payment History | MediCare Connect';
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Payments</h1>
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Payment History</h1>
        <p className="text-slate-500 mt-1">Review your consultation billing and Stripe transaction records</p>
      </div>

      {!payments || payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="No Payments" description="No payment history found." />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 sm:p-6">Transaction / Stripe ID</th>
                  <th className="p-4 sm:p-6">Doctor</th>
                  <th className="p-4 sm:p-6">Date</th>
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
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="p-4 sm:p-6 font-mono text-xs text-slate-500 max-w-[120px] truncate" title={p.stripePaymentIntentId}>
                      {p.stripePaymentIntentId || 'Manual / N/A'}
                    </td>
                    <td className="p-4 sm:p-6 font-bold text-slate-800 dark:text-white">
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
        </div>
      )}
    </div>
  );
}
