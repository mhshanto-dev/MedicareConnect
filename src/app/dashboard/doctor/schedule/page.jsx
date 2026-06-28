'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Clock, Plus, Trash2, Calendar, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Schedule() {
  const queryClient = useQueryClient();
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  // Fetch current doctor profile (including availability)
  const { data: doctor, isLoading, refetch } = useQuery({
    queryKey: ['myDoctorProfile'],
    queryFn: async () => (await api.get('/doctors/profile/me')).data
  });

  useEffect(() => {
    document.title = 'My Schedule | MediCare Connect';
  }, []);

  // Update Profile/Schedule Mutation
  const updateScheduleMutation = useMutation({
    mutationFn: async (availability) => {
      return api.put('/doctors/profile/me', { availability });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myDoctorProfile']);
      refetch();
      toast.success('Schedule updated successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update schedule');
    }
  });

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!startTime || !endTime) {
      toast.error('Start and End times are required');
      return;
    }

    const currentAvailability = doctor?.availability || [];
    
    // Check if slot already exists
    const duplicate = currentAvailability.some(
      slot => slot.day === day && slot.startTime === startTime && slot.endTime === endTime
    );

    if (duplicate) {
      toast.error('This availability slot already exists.');
      return;
    }

    const updated = [...currentAvailability, { day, startTime, endTime }];
    updateScheduleMutation.mutate(updated);
  };

  const handleRemoveSlot = (index) => {
    const currentAvailability = doctor?.availability || [];
    const updated = currentAvailability.filter((_, i) => i !== index);
    updateScheduleMutation.mutate(updated);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Schedule</h1>
        <SkeletonCard />
      </div>
    );
  }

  const availability = doctor?.availability || [];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Schedule</h1>
        <p className="text-slate-500 mt-1">Configure your weekly consulting hours and calendar availability slots</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Slot Form */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border shadow-sm h-fit">
          <h3 className="text-lg font-bold text-slate-905 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="text-blue-500" size={18} /> Add Time Slot
          </h3>
          <form onSubmit={handleAddSlot} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Day of Week</label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="block w-full px-3 py-2.5 border rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="block w-full px-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="block w-full px-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={updateScheduleMutation.isLoading}
              className="w-full flex justify-center items-center gap-1.5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 mt-6"
            >
              <Plus size={16} /> Add Slot
            </button>
          </form>
        </div>

        {/* Slots List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Availability Slots</h3>
          {availability.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No Slots Configured"
              description="Patients cannot book consultations until you add at least one availability slot."
            />
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border shadow-sm divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden">
              <AnimatePresence mode="popLayout">
                {availability.map((slot, index) => (
                  <motion.div
                    layout
                    key={slot._id || index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="p-4 sm:p-6 flex justify-between items-center hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm">
                        {slot.day.slice(0, 3)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{slot.day}</h4>
                        <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">Time: {slot.startTime} to {slot.endTime}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveSlot(index)}
                      disabled={updateScheduleMutation.isLoading}
                      className="p-2 border border-slate-205 hover:bg-red-50 hover:text-red-650 hover:border-red-250 text-slate-400 rounded-xl transition-all"
                      title="Delete Slot"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
