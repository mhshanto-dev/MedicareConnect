'use client';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Heart, Trash2, Calendar, Star, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Favorites() {
  const queryClient = useQueryClient();

  const { data: favorites, isLoading, refetch } = useQuery({
    queryKey: ['myFavorites'],
    queryFn: async () => (await api.get('/users/favorites')).data
  });

  useEffect(() => {
    document.title = 'Saved Doctors | MediCare Connect';
  }, []);

  const removeFavoriteMutation = useMutation({
    mutationFn: async (doctorId) => {
      return api.delete(`/users/favorites/${doctorId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myFavorites']);
      refetch();
      toast.success('Removed doctor from favorites');
    },
    onError: () => {
      toast.error('Failed to remove doctor');
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Saved Doctors</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Saved Doctors</h1>
        <p className="text-slate-500 mt-1">Keep track of your preferred healthcare professionals</p>
      </div>

      {!favorites || favorites.length === 0 ? (
        <EmptyState 
          icon={Heart} 
          title="No Saved Doctors" 
          description="You haven't saved any doctors to your favorites list yet." 
          action={
            <Link href="/find-doctors" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-sm">
              Discover Doctors
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {favorites.map((doc) => (
              <motion.div
                layout
                key={doc._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-800 border border-slate-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0">
                      {doc.userId?.name ? doc.userId.name.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        Dr. {doc.userId?.name}
                      </h3>
                      <p className="text-xs text-blue-600 font-semibold mt-0.5">{doc.specialty}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="font-bold text-slate-800">4.8</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
                    {doc.bio || 'No biography details provided.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <Link
                    href={`/find-doctors/${doc._id}`}
                    className="flex-1 text-center py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Book Visit
                  </Link>

                  <button
                    onClick={() => removeFavoriteMutation.mutate(doc._id)}
                    disabled={removeFavoriteMutation.isLoading}
                    title="Remove Favorite"
                    className="p-2 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-250 text-slate-400 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
