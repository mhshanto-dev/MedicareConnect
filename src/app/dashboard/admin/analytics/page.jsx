'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart2, TrendingUp, Users } from 'lucide-react';

const COLORS = ['#0EA5E9', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Analytics() {
  // Fetch admin stats (for charts)
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => (await api.get('/admin/stats')).data
  });

  // Fetch doctors to aggregate specialties
  const { data: doctorsData, isLoading: isDoctorsLoading } = useQuery({
    queryKey: ['adminDoctorsAll'],
    queryFn: async () => (await api.get('/admin/doctors?limit=100')).data
  });

  useEffect(() => {
    document.title = 'Platform Analytics | MediCare Connect';
  }, []);

  if (isStatsLoading || isDoctorsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <SkeletonCard />
      </div>
    );
  }

  const doctors = doctorsData?.doctors || [];
  
  // Aggregate specialties
  const specialtyCounts = {};
  doctors.forEach(doc => {
    if (doc.specialty) {
      specialtyCounts[doc.specialty] = (specialtyCounts[doc.specialty] || 0) + 1;
    }
  });

  const pieData = Object.entries(specialtyCounts).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Platform Analytics</h1>
        <p className="text-slate-500 mt-1">Deep-dive charting of medicare network, registration volume, and consulting revenue</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Specialty distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-4">Doctor Specialties</h3>
          {pieData.length > 0 ? (
            <div className="h-64 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{doctors.length}</span>
                <span className="text-xs text-slate-450 uppercase">Doctors</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-20">No doctor records registered.</p>
          )}

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs mt-4 pt-4 border-t">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-slate-600 dark:text-slate-350 truncate">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-500" /> Revenue & Booking Trends
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.revenueChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Earnings ($)" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
