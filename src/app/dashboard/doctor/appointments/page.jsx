'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Calendar, Clock, Video, User, X, Check, FileText } from 'lucide-react';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Appointments() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [selectedMeetingApt, setSelectedMeetingApt] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');

  // Fetch doctor appointments
  const { data: appointmentsRes, isLoading, refetch } = useQuery({
    queryKey: ['doctorAppointments'],
    queryFn: async () => (await api.get('/appointments/doctor/mine')).data
  });

  const appointments = appointmentsRes?.appointments || [];

  useEffect(() => {
    document.title = 'Patient Appointments | MediCare Connect';
  }, []);

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, meetingLink }) => {
      const payload = {};
      if (status) payload.status = status;
      if (meetingLink) payload.meetingLink = meetingLink;
      return api.patch(`/appointments/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorAppointments']);
      refetch();
      setSelectedMeetingApt(null);
      setMeetingLink('');
      toast.success('Appointment updated successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update appointment');
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Appointment Requests</h1>
        <SkeletonCard />
      </div>
    );
  }

  // Filter logic
  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status?.toLowerCase() === filter;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Patient Appointments</h1>
          <p className="text-slate-500 mt-1">Accept requests, manage schedules, and coordinate video consultations</p>
        </div>

        {/* Filter buttons */}
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
          title="No Appointments Found" 
          description={`No patient appointments matching "${filter}" filter.`}
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
                className="bg-white dark:bg-slate-800 border border-slate-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
                        {apt.patientId?.name ? apt.patientId.name.charAt(0) : 'P'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {apt.patientId?.name || 'Patient'}
                        </h3>
                        <p className="text-xs text-slate-500">Gender: {apt.patientId?.gender || 'N/A'} • Phone: {apt.patientId?.phone || 'N/A'}</p>
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
                      <FileText size={16} className="text-slate-400 mt-0.5" />
                      <span>Reason: {apt.reasonForVisit}</span>
                    </div>
                    {apt.meetingLink && (
                      <div className="flex items-center gap-2 text-blue-600 font-medium">
                        <Video size={16} />
                        <a href={apt.meetingLink} target="_blank" className="hover:underline truncate max-w-[200px]">
                          {apt.meetingLink}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50 dark:border-slate-750">
                  {apt.status === 'pending' && (
                    <button
                      onClick={() => updateStatusMutation.mutate({ id: apt._id, status: 'confirmed' })}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <Check size={14} /> Accept Request
                    </button>
                  )}

                  {apt.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedMeetingApt(apt);
                          setMeetingLink(apt.meetingLink || '');
                        }}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <Video size={14} /> Meeting Link
                      </button>

                      <button
                        onClick={() => updateStatusMutation.mutate({ id: apt._id, status: 'completed' })}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Complete Visit
                      </button>
                    </>
                  )}

                  {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                    <button
                      onClick={() => updateStatusMutation.mutate({ id: apt._id, status: 'cancelled' })}
                      className="py-2 px-3 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Reject/Cancel
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Meeting Link Modal */}
      {selectedMeetingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-xl relative border"
          >
            <button 
              onClick={() => setSelectedMeetingApt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Set Consultation Link</h3>
            <p className="text-xs text-slate-500 mb-6">Enter the video consultation room URL (Telehealth call link) for Dr. {user?.name} and {selectedMeetingApt.patientId?.name}.</p>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                updateStatusMutation.mutate({ id: selectedMeetingApt._id, meetingLink });
              }} 
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Meeting Link (Zoom / Google Meet URL)</label>
                <input 
                  type="url"
                  required
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="block w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={updateStatusMutation.isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mt-6 disabled:opacity-50"
              >
                {updateStatusMutation.isLoading ? 'Saving...' : 'Save and Notify Patient'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
