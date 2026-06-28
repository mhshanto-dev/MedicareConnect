'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
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
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Calendar, DollarSign, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function DoctorAnalytics() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['doctorStats'],
    queryFn: async () => (await api.get('/doctors/analytics/stats')).data
  });

  useEffect(() => {
    document.title = 'Analytics | MediCare Connect';
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-red-200">
        <p className="text-red-500 font-bold">Unable to load analytics. Please set up your doctor profile first.</p>
      </div>
    );
  }

  // Build appointment status breakdown for pie chart
  const statusData = [
    { name: 'Completed', value: stats.completedAppointments || 0 },
    { name: 'Pending', value: (stats.totalAppointments || 0) - (stats.completedAppointments || 0) },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Practice Analytics</h1>
        <p className="text-slate-500 mt-1">Detailed performance metrics for your clinical practice</p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: stats.totalPatients, icon: Calendar, color: 'blue', prefix: '' },
          { label: 'Total Earnings', value: stats.totalEarnings, icon: DollarSign, color: 'green', prefix: '$' },
          { label: 'Avg Rating', value: stats.averageRating, icon: Star, color: 'amber', prefix: '' },
          { label: 'Consultations', value: stats.totalAppointments, icon: TrendingUp, color: 'indigo', prefix: '' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border shadow-sm"
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {kpi.prefix}{kpi.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue AreaChart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-6 flex items-center gap-2">
            <DollarSign size={18} className="text-green-500" /> Monthly Revenue
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="aRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#aRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consultations BarChart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-6 flex items-center gap-2">
            <Calendar size={18} className="text-blue-500" /> Monthly Consultations
          </h3>
          <div className="h-64">
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

        {/* Status Pie Chart */}
        {statusData.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-6">Appointment Status Breakdown</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Performance Summary */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-6">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Appointments</span>
              <span className="font-bold text-slate-900 dark:text-white">{stats.totalAppointments}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</span>
              <span className="font-bold text-green-600">{stats.completedAppointments}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Patients</span>
              <span className="font-bold text-slate-900 dark:text-white">{stats.totalPatients}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Patient Reviews</span>
              <span className="font-bold text-slate-900 dark:text-white">{stats.totalReviews}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Average Rating</span>
              <span className="font-bold text-amber-500 flex items-center gap-1">
                <Star size={14} className="fill-current" /> {stats.averageRating}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
