'use client';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import api from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';
import { Calendar, FileText, Bell, Heart, CreditCard, Star, Clock, Plus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import Link from 'next/link';

export default function PatientDashboard() {
  const { user } = useAuthStore();

  // Fetch real statistics & list by retrieving user records
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['patientDashboard'],
    queryFn: async () => {
      const [appointmentsRes, prescriptionsRes, notificationsRes, favoritesRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/prescriptions').catch(() => ({ data: [] })),
        api.get('/notifications').catch(() => ({ data: [] })),
        api.get('/users/favorites').catch(() => ({ data: [] })),
      ]);

      const appointments = appointmentsRes.data || [];
      const prescriptions = prescriptionsRes.data || [];
      const notifications = notificationsRes.data || [];
      const favorites = favoritesRes.data || [];

      const upcoming = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed');
      const unreadNotifications = notifications.filter(n => !n.isRead).length;

      return {
        appointments,
        upcoming,
        prescriptions,
        favoritesCount: favorites.length,
        unreadNotifications,
      };
    }
  });

  useEffect(() => {
    document.title = 'Patient Dashboard | MediCare Connect';
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 h-64 bg-slate-200 dark:bg-slate-700 rounded-3xl animate-pulse"></div>
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-3xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const data = dashboardData || { appointments: [], upcoming: [], prescriptions: [], favoritesCount: 0, unreadNotifications: 0 };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-sky-500 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold">Welcome back, {user?.name}!</h1>
          <p className="text-blue-100 mt-2 max-w-md">Your health is our priority. You have {data.upcoming.length} upcoming appointments scheduled.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/find-doctors" className="inline-flex items-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-sm text-sm">
              <Plus size={16} /> Book Appointment
            </Link>
            <Link href="/dashboard/patient/notifications" className="inline-flex items-center gap-2 bg-blue-700/30 text-white border border-blue-400/30 px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700/50 transition-colors text-sm">
              <Bell size={16} /> Notifications ({data.unreadNotifications})
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Heart size={180} className="stroke-white" />
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{data.upcoming.length}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Upcoming Visits</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 rounded-xl">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{data.prescriptions.length}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Prescriptions</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 rounded-xl">
            <Heart size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{data.favoritesCount}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Saved Doctors</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-xl">
            <CreditCard size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{data.appointments.filter(a => a.paymentStatus === 'paid').length}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Paid Invoices</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Appointments</h2>
            <Link href="/dashboard/patient/appointments" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
            {data.upcoming.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {data.upcoming.slice(0, 3).map((apt) => (
                  <div key={apt._id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
                        {apt.doctorId?.userId?.name ? apt.doctorId.userId.name.charAt(0) : 'D'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Dr. {apt.doctorId?.userId?.name || 'Specialist'}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{apt.doctorId?.specialty || 'General Practitioner'}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-450 font-medium">
                          <Clock size={12} />
                          <span>{new Date(apt.date).toLocaleDateString()} at {apt.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={apt.status} />
                      {apt.meetingLink && apt.status === 'confirmed' && (
                        <a href={apt.meetingLink} target="_blank" className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition font-semibold">Join Call</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <Calendar className="mx-auto text-slate-300 mb-3" size={40} />
                <p className="font-medium">No upcoming appointments</p>
                <Link href="/find-doctors" className="mt-3 inline-block text-sm text-blue-600 font-bold hover:underline">Find a doctor now</Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Prescription List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Prescriptions</h2>
            <Link href="/dashboard/patient/prescriptions" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
            {data.prescriptions.length > 0 ? (
              <div className="space-y-4">
                {data.prescriptions.slice(0, 3).map((pr) => (
                  <div key={pr._id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">Diagnosis: {pr.diagnosis}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">By Dr. {pr.doctorId?.userId?.name || 'Specialist'}</p>
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded-md font-semibold">
                      {pr.medications?.length || 0} meds
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <FileText className="mx-auto text-slate-300 mb-3" size={40} />
                <p className="font-medium">No prescriptions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
