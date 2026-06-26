'use client';

import useAuthStore from '@/store/useAuthStore';
import { Calendar, Clock, FileText, User, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PatientDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { title: 'Upcoming Appointments', value: '2', icon: <Calendar className="w-6 h-6 text-primary-500" /> },
    { title: 'Past Consultations', value: '5', icon: <Clock className="w-6 h-6 text-secondary-500" /> },
    { title: 'Prescriptions', value: '3', icon: <FileText className="w-6 h-6 text-accent-500" /> },
  ];

  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Sarah Wilson', specialty: 'Cardiologist', date: 'Tomorrow', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, doctor: 'Dr. James Lee', specialty: 'Dermatologist', date: 'Oct 25, 2024', time: '2:30 PM', status: 'Pending' },
  ];

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Patient Dashboard</h1>
          <p className="text-slate-600">Welcome back, {user?.name || 'Patient'}! Here is an overview of your health journey.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between"
            >
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
              </div>
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Upcoming Appointments */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Upcoming Appointments</h2>
                <Link href="/dashboard/patient/appointments" className="text-primary-600 text-sm font-medium hover:text-primary-700">View All</Link>
              </div>
              
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="p-4 border border-slate-100 rounded-xl hover:border-primary-100 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center font-bold text-lg">
                        {apt.doctor.charAt(4)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{apt.doctor}</h4>
                        <p className="text-sm text-slate-500">{apt.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-slate-600 text-right">
                        <p className="font-semibold text-slate-900">{apt.date}</p>
                        <p>{apt.time}</p>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Summary</h2>
              
              <div className="flex flex-col items-center text-center mb-6 border-b border-slate-100 pb-6">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <User size={40} />
                </div>
                <h3 className="font-bold text-lg text-slate-900">{user?.name || 'John Doe'}</h3>
                <p className="text-slate-500 text-sm">{user?.email || 'patient@example.com'}</p>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Blood Group</span>
                  <span className="font-medium text-slate-900 text-right">O+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Height</span>
                  <span className="font-medium text-slate-900 text-right">175 cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Weight</span>
                  <span className="font-medium text-slate-900 text-right">70 kg</span>
                </div>
              </div>
              
              <button className="w-full mt-6 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}