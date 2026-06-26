'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Calendar, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Appointments() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const res = await api.get('/appointments');
      return res.data;
    }
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => api.patch(`/appointments/${id}`, { status: 'cancelled' }),
    onSuccess: () => {
      toast.success('Appointment cancelled successfully');
      queryClient.invalidateQueries(['appointments']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  });

  if (isLoading) return <SkeletonCard className="h-64" />;

  const filtered = appointments?.filter(apt => {
    const doctorName = apt.doctorId?.userId?.name?.toLowerCase() || '';
    const matchesSearch = doctorName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || apt.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold dark:text-white">My Appointments</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search doctors..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
        >
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Calendar} title="No Appointments Found" description="Try adjusting your filters or book a new appointment." />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 text-slate-500">
                <tr>
                  <th className="p-4 font-medium">Doctor</th>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Reason</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map(apt => (
                  <tr key={apt._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{apt.doctorId?.userId?.name || 'Dr. Unknown'}</div>
                      <div className="text-xs text-slate-500">{apt.doctorId?.specialty || 'Specialist'}</div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <div>{new Date(apt.date).toLocaleDateString()}</div>
                      <div className="text-sm">{apt.time}</div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 truncate max-w-[150px]">{apt.reasonForVisit}</td>
                    <td className="p-4">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {(apt.status === 'pending' || apt.status === 'confirmed') && (
                        <button 
                          onClick={() => {
                            if(window.confirm('Are you sure you want to cancel this appointment?')) {
                              cancelMutation.mutate(apt._id);
                            }
                          }}
                          disabled={cancelMutation.isPending}
                          className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
