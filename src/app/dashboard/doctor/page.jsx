'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Calendar, Users, DollarSign, Star, TrendingUp } from 'lucide-react';
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
  Tooltip,
  Legend
} from 'recharts';

export default function DoctorDashboard() {
  const { user } = useAuthStore();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['doctorStats'],
    queryFn: async () => {
      const res = await api.get('/doctors/analytics/stats');
      return res.data;
    }
  });

  useEffect(() => {
    document.title = 'Doctor Dashboard | MediCare Connect';
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
        <p className="text-red-500 font-bold">Please complete your doctor profile setup first to view dashboard stats.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Welcome, Dr. {user?.name}</h1>
        <p className="text-slate-500 mt-1">Here is a summary of your clinical practice performance</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-slate-800 border rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-900/30 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalPatients}</h3>
            <p className="text-xs text-slate-500 font-semibold">Total Patients</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-slate-800 border rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 dark:bg-green-900/30 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">${stats.totalEarnings}</h3>
            <p className="text-xs text-slate-500 font-semibold">Total Revenue</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-slate-800 border rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 dark:bg-amber-900/30 rounded-xl">
            <Star size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.averageRating}</h3>
            <p className="text-xs text-slate-500 font-semibold">Patient Rating ({stats.totalReviews} reviews)</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-slate-800 border rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 rounded-xl">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalAppointments}</h3>
            <p className="text-xs text-slate-500 font-semibold">Consultations</p>
          </div>
        </motion.div>
      </div>

      {/* Recharts Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Revenue Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
              <TrendingUp size={18} className="text-green-500" /> Revenue Growth
            </h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Consultations Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
              <Calendar size={18} className="text-blue-500" /> Consultations Volume
            </h3>
          </div>
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
