'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Calendar, Clock, Search, X, Edit3, Trash2, Video } from 'lucide-react';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Appointments() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [editTarget, setEditTarget] = useState(null);
  
  // Reschedule/Edit state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [aptStatus, setAptStatus] = useState('pending');

  // Fetch Appointments
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminAppointments', search, status, page],
    queryFn: async () => {
      const res = await api.get(`/admin/appointments?search=${search}&status=${status}&page=${page}&limit=10`);
      return res.data;
    }
  });

  useEffect(() => {
    document.title = 'Manage Appointments | MediCare Connect';
  }, []);

  // Update Appointment Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, status, date, time, meetingLink }) => {
      return api.patch(`/appointments/${id}`, { status, date, time, meetingLink });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminAppointments']);
      refetch();
      setEditTarget(null);
      toast.success('Appointment updated successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update appointment');
    }
  });

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      id: editTarget._id,
      status: aptStatus,
      date,
      time,
      meetingLink
    });
  };

  const handleCancelDirect = (id) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      updateMutation.mutate({ id, status: 'cancelled' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Manage Appointments</h1>
        <SkeletonCard />
      </div>
    );
  }

  const appointments = data?.appointments || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Manage Appointments</h1>
        <p className="text-slate-500 mt-1">Platform-wide patient-doctor consultation coordinator and scheduler</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search appointments by visit reason..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="block w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {appointments.length === 0 ? (
        <EmptyState icon={Calendar} title="No Appointments Found" description="Try adjusting your query or filter." />
      ) : (
        <div className="bg-white dark:bg-slate-800 border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 sm:p-6">Patient</th>
                  <th className="p-4 sm:p-6">Doctor</th>
                  <th className="p-4 sm:p-6">Date & Time</th>
                  <th className="p-4 sm:p-6">Status</th>
                  <th className="p-4 sm:p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                <AnimatePresence mode="popLayout">
                  {appointments.map((apt) => (
                    <motion.tr
                      layout
                      key={apt._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-750 transition-colors"
                    >
                      <td className="p-4 sm:p-6 font-bold text-slate-905 dark:text-white">
                        {apt.patientId?.name || 'Anonymous Patient'}
                      </td>
                      <td className="p-4 sm:p-6 font-semibold text-slate-750 dark:text-slate-300">
                        Dr. {apt.doctorId?.userId?.name || 'Specialist'}
                      </td>
                      <td className="p-4 sm:p-6 text-slate-500 font-medium">
                        {new Date(apt.date).toLocaleDateString()} at {apt.time}
                      </td>
                      <td className="p-4 sm:p-6">
                        <StatusBadge status={apt.status} />
                      </td>
                      <td className="p-4 sm:p-6 text-right flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditTarget(apt);
                            setAptStatus(apt.status);
                            setDate(apt.date.split('T')[0]);
                            setTime(apt.time);
                            setMeetingLink(apt.meetingLink || '');
                          }}
                          className="p-2 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-350"
                          title="Edit Appointment"
                        >
                          <Edit3 size={16} />
                        </button>
                        {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                          <button
                            onClick={() => handleCancelDirect(apt._id)}
                            className="p-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Cancel Appointment"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
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

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-xl relative border"
          >
            <button onClick={() => setEditTarget(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-655">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Edit Appointment Details</h3>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                <select
                  value={aptStatus}
                  onChange={(e) => setAptStatus(e.target.value)}
                  className="block w-full px-3 py-2.5 border rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Time</label>
                <input
                  type="text"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="block w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Meeting Call URL</label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="block w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={updateMutation.isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mt-6 disabled:opacity-50"
              >
                {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
