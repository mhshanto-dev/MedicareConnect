'use client';

import useAuthStore from '@/store/useAuthStore';
import { Calendar, Users, DollarSign, Activity, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DoctorDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { title: 'Total Patients', value: '1,245', icon: <Users className="w-6 h-6 text-primary-500" /> },
    { title: 'Today\'s Appointments', value: '8', icon: <Calendar className="w-6 h-6 text-secondary-500" /> },
    { title: 'Revenue (Month)', value: '$12,450', icon: <DollarSign className="w-6 h-6 text-accent-500" /> },
  ];

  const todayAppointments = [
    { id: 1, patient: 'Sarah Johnson', time: '09:00 AM', type: 'Checkup', status: 'Completed' },
    { id: 2, patient: 'Michael Chen', time: '10:30 AM', type: 'Follow-up', status: 'In Progress' },
    { id: 3, patient: 'Emma Williams', time: '01:00 PM', type: 'Consultation', status: 'Waiting' },
    { id: 4, patient: 'David Smith', time: '03:15 PM', type: 'Checkup', status: 'Upcoming' },
  ];

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Doctor Dashboard</h1>
            <p className="text-slate-600">Welcome back, Dr. {user?.name || 'Doctor'}! Here is your daily summary.</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            <Settings size={18} />
            Manage Availability
          </button>
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
          {/* Main Content - Today's Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Today's Schedule</h2>
                <span className="text-sm font-medium bg-primary-50 text-primary-600 px-3 py-1 rounded-full">{todayAppointments.length} Appointments</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                      <th className="px-6 py-4 font-medium">Patient Name</th>
                      <th className="px-6 py-4 font-medium">Time</th>
                      <th className="px-6 py-4 font-medium">Type</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAppointments.map((apt) => (
                      <tr key={apt.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{apt.patient}</td>
                        <td className="px-6 py-4 text-slate-600">{apt.time}</td>
                        <td className="px-6 py-4 text-slate-600">{apt.type}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            apt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            apt.status === 'In Progress' ? 'bg-primary-100 text-primary-700' :
                            apt.status === 'Waiting' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-primary-600 font-medium hover:text-primary-700 text-sm">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all group">
                  <span className="font-medium text-slate-700 group-hover:text-primary-700">Write Prescription</span>
                  <Activity size={18} className="text-slate-400 group-hover:text-primary-600" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all group">
                  <span className="font-medium text-slate-700 group-hover:text-primary-700">View Patient Records</span>
                  <Users size={18} className="text-slate-400 group-hover:text-primary-600" />
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Updates</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">New appointment booked</p>
                    <p className="text-xs text-slate-500">Alex Jones for tomorrow at 2 PM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-secondary-500 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Lab results available</p>
                    <p className="text-xs text-slate-500">Sarah Johnson's blood test results are ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}