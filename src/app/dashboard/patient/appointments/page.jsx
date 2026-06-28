'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Calendar, Clock, CreditCard, AlertCircle, X, ChevronRight, Check } from 'lucide-react';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';
import StripeCheckout from '@/components/StripeCheckout';
import toast from 'react-hot-toast';

export default function Appointments() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [payTarget, setPayTarget] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // Fetch appointments
  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => (await api.get('/appointments')).data
  });

  useEffect(() => {
    document.title = 'My Appointments | MediCare Connect';
  }, []);

  // Cancel Mutation
  const cancelMutation = useMutation({
    mutationFn: async (id) => {
      return api.patch(`/appointments/${id}`, { status: 'cancelled' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      refetch();
      toast.success('Appointment cancelled successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to cancel appointment');
    }
  });

  // Reschedule Mutation
  const rescheduleMutation = useMutation({
    mutationFn: async ({ id, date, time }) => {
      return api.patch(`/appointments/${id}`, { date, time });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      refetch();
      setRescheduleTarget(null);
      toast.success('Appointment rescheduled successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to reschedule appointment');
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">My Appointments</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Filter logic
  const filteredAppointments = appointments?.filter(apt => {
    if (filter === 'all') return true;
    return apt.status?.toLowerCase() === filter;
  }) || [];

  const handleCancel = (id) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      cancelMutation.mutate(id);
    }
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!newDate || !newTime) {
      toast.error('Please enter a new date and time');
      return;
    }
    rescheduleMutation.mutate({
      id: rescheduleTarget._id,
      date: newDate,
      time: newTime
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Appointments</h1>
          <p className="text-slate-500 mt-1">Manage and track your doctor appointments</p>
        </div>

        {/* Filters */}
        <div className="flex bg-white dark:bg-slate-800 p-1 border rounded-xl shadow-sm text-xs font-semibold gap-1">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <EmptyState 
          icon={Calendar} 
          title="No Appointments" 
          description={filter === 'all' ? "You haven't booked any appointments yet." : `No appointments matching "${filter}" filter.`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAppointments.map((apt) => (
              <motion.div
                layout
                key={apt._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-slate-800 border border-slate-250/30 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
                        {apt.doctorId?.userId?.name ? apt.doctorId.userId.name.charAt(0) : 'D'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          Dr. {apt.doctorId?.userId?.name || 'Specialist'}
                        </h3>
                        <p className="text-xs text-slate-500">{apt.doctorId?.specialty || 'General Practitioner'}</p>
                      </div>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>

                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-350 border-t border-slate-100 dark:border-slate-700 pt-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-slate-400" />
                      <span>{new Date(apt.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-400" />
                      <span>{apt.time}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-slate-400 mt-0.5" />
                      <span>Reason: {apt.reasonForVisit}</span>
                    </div>
                    {apt.paymentStatus && (
                      <div className="flex items-center gap-2 font-medium">
                        <CreditCard size={16} className="text-slate-400" />
                        <span>Payment: </span>
                        <span className={`px-2 py-0.5 rounded text-xs capitalize ${
                          apt.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-150 text-red-700'
                        }`}>
                          {apt.paymentStatus}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50 dark:border-slate-750">
                  {apt.status === 'confirmed' && apt.meetingLink && (
                    <a
                      href={apt.meetingLink}
                      target="_blank"
                      className="flex-1 text-center py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
                    >
                      Join Meeting
                    </a>
                  )}

                  {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                    <>
                      {apt.paymentStatus !== 'paid' && (
                        <button
                          onClick={() => setPayTarget(apt)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <CreditCard size={14} /> Pay Now
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          setRescheduleTarget(apt);
                          setNewDate(apt.date.split('T')[0]);
                          setNewTime(apt.time);
                        }}
                        className="py-2 px-3 border border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Reschedule
                      </button>

                      <button
                        onClick={() => handleCancel(apt._id)}
                        disabled={cancelMutation.isLoading}
                        className="py-2 px-3 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-xl relative border"
          >
            <button 
              onClick={() => setRescheduleTarget(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Reschedule Appointment</h3>
            <p className="text-sm text-slate-500 mb-6">Select a new date and time for your consultation with Dr. {rescheduleTarget.doctorId?.userId?.name}.</p>
            
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">New Date</label>
                <input 
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="block w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">New Time</label>
                <input 
                  type="text"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g. 10:00 AM"
                  className="block w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={rescheduleMutation.isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mt-6 disabled:opacity-50"
              >
                {rescheduleMutation.isLoading ? 'Rescheduling...' : 'Confirm Reschedule'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Payment Modal */}
      {payTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-xl relative border"
          >
            <button 
              onClick={() => setPayTarget(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Complete Payment</h3>
            <p className="text-sm text-slate-500 mb-6">Pay consultation fee of <strong>${payTarget.doctorId?.consultationFee || 50}</strong> for your visit with Dr. {payTarget.doctorId?.userId?.name}.</p>
            
            <StripeCheckout
              amount={payTarget.doctorId?.consultationFee || 50}
              appointmentId={payTarget._id}
              onSuccess={() => {
                setPayTarget(null);
                refetch();
              }}
              onCancel={() => setPayTarget(null)}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
