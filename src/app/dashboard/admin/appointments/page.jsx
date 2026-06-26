'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Calendar, Search, Users } from 'lucide-react';

export default function AdminAppointments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['adminAppointments', page, statusFilter, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit });
      if (statusFilter !== 'All') params.append('status', statusFilter.toLowerCase());
      if (searchTerm) params.append('search', searchTerm);
      const res = await api.get(`/appointments/admin/all?${params.toString()}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  if (isLoading) return <SkeletonCard className="h-64" />;

  const appointments = data?.appointments || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6 max-w-7xl">
      <h1 className="text-3xl font-bold dark:text-white">All Platform Appointments</h1>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search reason for visit..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
        >
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {appointments.length === 0 ? (
        <EmptyState icon={Calendar} title="No Appointments Found" description="No appointments exist on the platform matching these filters." />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 text-slate-500">
                <tr>
                  <th className="p-4 font-medium">Patient</th>
                  <th className="p-4 font-medium">Doctor</th>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {appointments.map(apt => (
                  <tr key={apt._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{apt.patientId?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{apt.patientId?.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{apt.doctorId?.userId?.name || 'Dr. Unknown'}</div>
                      <div className="text-xs text-slate-500">{apt.doctorId?.specialty}</div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <div>{new Date(apt.date).toLocaleDateString()}</div>
                      <div className="text-sm">{apt.time}</div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={apt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-400">Page {page} of {totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
