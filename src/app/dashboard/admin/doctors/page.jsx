'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { ShieldAlert, Check, X, Search, FileText, Star } from 'lucide-react';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ManageDoctors() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all'); // all, verified, pending
  const [page, setPage] = useState(1);

  // Fetch Doctors list
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminDoctors', filter, page],
    queryFn: async () => {
      let verifiedParam = '';
      if (filter === 'verified') verifiedParam = '&verified=true';
      if (filter === 'pending') verifiedParam = '&verified=false';
      
      const res = await api.get(`/admin/doctors?page=${page}&limit=10${verifiedParam}`);
      return res.data;
    }
  });

  useEffect(() => {
    document.title = 'Manage Doctors | MediCare Connect';
  }, []);

  // Verify Doctor Mutation
  const verifyMutation = useMutation({
    mutationFn: async (id) => {
      return api.patch(`/admin/doctors/${id}/verify`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminDoctors']);
      refetch();
      toast.success('Doctor verified successfully');
    },
    onError: () => {
      toast.error('Failed to verify doctor');
    }
  });

  // Reject Doctor Mutation
  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      return api.patch(`/admin/doctors/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminDoctors']);
      refetch();
      toast.success('Doctor status set to unverified');
    },
    onError: () => {
      toast.error('Failed to reject doctor');
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Manage Doctors</h1>
        <SkeletonCard />
      </div>
    );
  }

  const doctors = data?.doctors || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Manage Doctors</h1>
          <p className="text-slate-500 mt-1">Review physician medical credentials and manage platform verifications</p>
        </div>

        {/* Verification Filters */}
        <div className="flex bg-white dark:bg-slate-800 p-1 border rounded-xl shadow-sm text-xs font-semibold gap-1">
          {['all', 'verified', 'pending'].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {doctors.length === 0 ? (
        <EmptyState icon={ShieldAlert} title="No Doctors Found" description={`No doctor records match the verification status filter.`} />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {doctors.map((doc) => (
              <motion.div
                layout
                key={doc._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-slate-800 border border-slate-150 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0">
                    {doc.userId?.name ? doc.userId.name.charAt(0).toUpperCase() : 'D'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                        Dr. {doc.userId?.name || 'Physician'}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        doc.isVerified ? 'bg-green-105 text-green-700' : 'bg-amber-100 text-amber-705'
                      }`}>
                        {doc.isVerified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                    <p className="text-xs text-blue-605 font-bold mt-1">{doc.specialty} • {doc.experience} Years Exp</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Email: {doc.userId?.email || 'N/A'}</p>
                    {doc.qualifications && doc.qualifications.length > 0 && (
                      <p className="text-xs text-slate-450 dark:text-slate-400 mt-1">Credentials: <span className="font-medium">{doc.qualifications.join(', ')}</span></p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700">
                  {!doc.isVerified ? (
                    <button
                      onClick={() => verifyMutation.mutate(doc._id)}
                      disabled={verifyMutation.isLoading}
                      className="flex-1 md:flex-initial flex items-center justify-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-green-500/10"
                    >
                      <Check size={14} /> Approve Doctor
                    </button>
                  ) : (
                    <button
                      onClick={() => rejectMutation.mutate(doc._id)}
                      disabled={rejectMutation.isLoading}
                      className="flex-1 md:flex-initial flex items-center justify-center gap-1 px-4 py-2 border border-red-200 hover:bg-rose-50 text-red-600 rounded-xl text-xs font-bold transition-all"
                    >
                      <X size={14} /> Revoke/Reject
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
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
  );
}
