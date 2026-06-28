'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Users, UserCheck, Calendar, DollarSign, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => (await api.get('/admin/stats')).data
  });

  useEffect(() => {
    document.title = 'Admin Panel | MediCare Connect';
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-200 rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="h-80 bg-slate-200 rounded-3xl animate-pulse"></div>
          <div className="h-80 bg-slate-200 rounded-3xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-red-200">
        <p className="text-red-500 font-bold">Failed to load platform stats. Ensure you are logged in as an administrator.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Greetings */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Control Center</h1>
        <p className="text-slate-500 mt-1">Platform-wide activity and transactional performance overview</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-slate-800 border rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-900/30 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalUsers}</h3>
            <p className="text-xs text-slate-500 font-semibold">Total Accounts</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-slate-800 border rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 dark:bg-green-900/30 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">${stats.totalRevenue}</h3>
            <p className="text-xs text-slate-500 font-semibold">Platform Revenue</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-slate-800 border rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 dark:bg-rose-900/30 rounded-xl">
            <UserCheck size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pendingDoctors}</h3>
            <p className="text-xs text-slate-500 font-semibold">Pending Verifications</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-slate-800 border rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 rounded-xl">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalAppointments}</h3>
            <p className="text-xs text-slate-500 font-semibold">Total Bookings</p>
          </div>
        </motion.div>
      </div>

      {/* Pending verification alert */}
      {stats.pendingDoctors > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-3xl flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="flex items-center gap-3 text-sm">
            <ShieldCheck size={24} className="text-amber-500 flex-shrink-0" />
            <div>
              <p className="font-bold">Doctor Verification Required</p>
              <p className="text-amber-600 mt-0.5">There are {stats.pendingDoctors} new doctors awaiting platform review before they can consult.</p>
            </div>
          </div>
          <Link href="/dashboard/admin/doctors" className="bg-amber-550 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors self-start sm:self-auto">
            Review Credentials
          </Link>
        </div>
      )}

      {/* Analytics Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border shadow-sm">
          <h3 className="font-bold text-slate-805 dark:text-white text-lg mb-6 flex items-center gap-2">
            <DollarSign className="text-green-500" size={18} /> Platform Billing Analytics
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdminRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" name="Total Revenue ($)" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorAdminRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-6 flex items-center gap-2">
            <Calendar className="text-blue-500" size={18} /> Appointment booking trends
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyAppointments} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip />
                <Bar dataKey="count" name="Appointments" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
