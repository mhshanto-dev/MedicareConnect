'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';
import { Calendar, FileText, Bell, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';

export default function PatientDashboard() {
  const { user } = useAuthStore();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['patientStats'],
    queryFn: async () => {
      // Mocked for now until backend is fully ready
      return { totalAppointments: 5, upcomingAppointments: 2, totalPrescriptions: 3, unreadNotifications: 1 };
    }
  });

  if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-4 gap-6"><SkeletonCard/><SkeletonCard/><SkeletonCard/><SkeletonCard/></div>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold dark:text-white">Welcome back, {user?.name}</h1>
        <p className="text-slate-500">Here is your health overview for {new Date().toLocaleDateString()}</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <Calendar className="text-primary-500 mb-2" size={24}/>
          <h3 className="text-2xl font-bold">{stats?.upcomingAppointments || 0}</h3>
          <p className="text-sm text-slate-500">Upcoming Appointments</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <FileText className="text-secondary-500 mb-2" size={24}/>
          <h3 className="text-2xl font-bold">{stats?.totalPrescriptions || 0}</h3>
          <p className="text-sm text-slate-500">Prescriptions</p>
        </div>
      </div>
      <EmptyState icon={Calendar} title="No recent activity" description="You have no recent appointments." />
    </div>
  );
}
