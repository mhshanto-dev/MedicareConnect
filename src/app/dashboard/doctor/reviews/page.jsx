'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Reviews() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['doctorReviews'],
    queryFn: async () => (await api.get('/reviews')).data
  });

  useEffect(() => {
    document.title = 'Patient Reviews | MediCare Connect';
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Reviews</h1>
        <SkeletonCard />
      </div>
    );
  }

  const averageRating = reviews?.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Patient Reviews</h1>
          <p className="text-slate-500 mt-1">Read feedback from consultations with your patients</p>
        </div>

        {reviews?.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-100 text-sm">
            <Star className="text-amber-500 fill-current" size={20} />
            <span className="font-bold text-amber-800">{averageRating} / 5.0 Rating</span>
            <span className="text-amber-600">({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      {!reviews || reviews.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No Reviews Yet" description="You haven't received any reviews yet." />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reviews.map((r, idx) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-150 p-6 shadow-sm flex flex-col justify-between"
            >
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-700">
                    {r.patientId?.name ? r.patientId.name.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{r.patientId?.name || 'Anonymous Patient'}</h4>
                    <p className="text-xs text-slate-400">Consultation Date: {new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400 fill-current' : 'text-slate-205'}`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-slate-655 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line italic">
                "{r.comment}"
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
