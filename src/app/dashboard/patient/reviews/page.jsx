'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Star, Trash2, Edit3, MessageSquare, X, Calendar, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Reviews() {
  const queryClient = useQueryClient();
  const [editingReview, setEditingReview] = useState(null);
  const [writingReview, setWritingReview] = useState(null); // Appointment details

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch Patient Reviews
  const { data: reviews, isLoading: isReviewsLoading, refetch: refetchReviews } = useQuery({
    queryKey: ['myReviews'],
    queryFn: async () => (await api.get('/reviews')).data
  });

  // Fetch Patient Appointments to find unreviewed completed ones
  const { data: appointments, isLoading: isAppointmentsLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => (await api.get('/appointments')).data
  });

  useEffect(() => {
    document.title = 'My Reviews | MediCare Connect';
  }, []);

  // Write Review Mutation
  const writeReviewMutation = useMutation({
    mutationFn: async ({ doctorId, appointmentId, rating, comment }) => {
      return api.post('/reviews', { doctorId, appointmentId, rating, comment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myReviews']);
      refetchReviews();
      setWritingReview(null);
      setComment('');
      setRating(5);
      toast.success('Review submitted successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  });

  // Edit Review Mutation
  const editReviewMutation = useMutation({
    mutationFn: async ({ id, rating, comment }) => {
      return api.put(`/reviews/${id}`, { rating, comment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myReviews']);
      refetchReviews();
      setEditingReview(null);
      setComment('');
      setRating(5);
      toast.success('Review updated successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update review');
    }
  });

  // Delete Review Mutation
  const deleteReviewMutation = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myReviews']);
      refetchReviews();
      toast.success('Review deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete review');
    }
  });

  if (isReviewsLoading || isAppointmentsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Reviews</h1>
        <SkeletonCard />
      </div>
    );
  }

  // Find unreviewed completed appointments
  const reviewedAppointmentIds = reviews?.map(r => r.appointmentId?._id || r.appointmentId) || [];
  const unreviewedCompletedAppointments = appointments?.filter(apt => 
    apt.status === 'completed' && !reviewedAppointmentIds.includes(apt._id)
  ) || [];

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this review?')) {
      deleteReviewMutation.mutate(id);
    }
  };

  const handleWriteSubmit = (e) => {
    e.preventDefault();
    if (!comment) {
      toast.error('Please add a comment');
      return;
    }
    writeReviewMutation.mutate({
      doctorId: writingReview.doctorId?._id || writingReview.doctorId,
      appointmentId: writingReview._id,
      rating,
      comment
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!comment) {
      toast.error('Please add a comment');
      return;
    }
    editReviewMutation.mutate({
      id: editingReview._id,
      rating,
      comment
    });
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Reviews</h1>
        <p className="text-slate-500 mt-1">Share your feedback and manage reviews for your consultations</p>
      </div>

      {/* Completed Pending Review Section */}
      {unreviewedCompletedAppointments.length > 0 && (
        <div className="bg-gradient-to-r from-teal-500 to-emerald-400 rounded-3xl p-6 text-white shadow-sm">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
            <MessageSquare size={20} /> Pending Reviews
          </h2>
          <p className="text-sm text-teal-50">You have completed consultations waiting for your feedback. Reviews help other patients select the right doctor!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {unreviewedCompletedAppointments.map((apt) => (
              <div key={apt._id} className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold">Dr. {apt.doctorId?.userId?.name || 'Specialist'}</h4>
                  <p className="text-xs text-teal-100 mt-1">{new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                </div>
                <button
                  onClick={() => {
                    setWritingReview(apt);
                    setRating(5);
                    setComment('');
                  }}
                  className="px-4 py-2 bg-white text-teal-650 hover:bg-teal-50 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Write Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Reviews List */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Submitted Reviews</h2>
        {!reviews || reviews.length === 0 ? (
          <EmptyState icon={Star} title="No Reviews Submitted" description="You haven't written any reviews yet." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-150 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        Dr. {r.doctorId?.userId?.name || 'Specialist'}
                      </h4>
                      <p className="text-xs text-slate-400">Reviewed on {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed whitespace-pre-line italic">
                    "{r.comment}"
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
                  <button
                    onClick={() => {
                      setEditingReview(r);
                      setRating(r.rating);
                      setComment(r.comment);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-650 rounded-xl text-xs font-semibold hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      {writingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-xl relative border"
          >
            <button onClick={() => setWritingReview(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-650">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Write feedback</h3>
            <p className="text-xs text-slate-500 mb-6">Review for consultation with Dr. {writingReview.doctorId?.userId?.name} on {new Date(writingReview.date).toLocaleDateString()}.</p>

            <form onSubmit={handleWriteSubmit} className="space-y-4">
              {/* Rating Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 rounded transition-colors text-slate-200 hover:text-yellow-400"
                    >
                      <Star
                        size={28}
                        className={`${
                          star <= (hoverRating || rating) ? 'text-yellow-400 fill-current' : 'text-slate-205 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Comment</label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience with this doctor..."
                  rows={4}
                  className="block w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={writeReviewMutation.isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mt-6 disabled:opacity-50"
              >
                {writeReviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-xl relative border"
          >
            <button onClick={() => setEditingReview(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-650">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Edit Review</h3>
            <p className="text-xs text-slate-500 mb-6">Review for Dr. {editingReview.doctorId?.userId?.name}.</p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Rating Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 rounded transition-colors text-slate-205 dark:text-slate-700 hover:text-yellow-400"
                    >
                      <Star
                        size={28}
                        className={`${
                          star <= (hoverRating || rating) ? 'text-yellow-400 fill-current' : 'text-slate-205 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Comment</label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience with this doctor..."
                  rows={4}
                  className="block w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={editReviewMutation.isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mt-6 disabled:opacity-50"
              >
                {editReviewMutation.isLoading ? 'Updating...' : 'Update Review'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
