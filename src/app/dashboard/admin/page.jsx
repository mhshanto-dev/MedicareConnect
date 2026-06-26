'use client';

import useAuthStore from '@/store/useAuthStore';
import { Users, UserPlus, Activity, Database, Shield, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { title: 'Total Users', value: '15,245', icon: <Users className="w-6 h-6 text-primary-500" /> },
    { title: 'New Doctors (Pending)', value: '12', icon: <UserPlus className="w-6 h-6 text-secondary-500" /> },
    { title: 'Platform Health', value: '99.9%', icon: <Activity className="w-6 h-6 text-accent-500" /> },
  ];

  const recentActivity = [
    { id: 1, action: 'New Doctor Registration', details: 'Dr. Alan Smith applied for verification.', time: '10 mins ago', type: 'warning' },
    { id: 2, action: 'System Backup', details: 'Daily database backup completed successfully.', time: '2 hours ago', type: 'success' },
    { id: 3, action: 'User Reported', details: 'A patient reported an issue with booking.', time: '5 hours ago', type: 'error' },
  ];

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
            <p className="text-slate-600">Welcome, {user?.name || 'Admin'}. Manage platform operations and users.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> System Online
            </span>
          </div>
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
          
          {/* Main Content - Quick Links & Overview */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Management Modules</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left group">
                  <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary-700">Verify Doctors</h3>
                    <p className="text-xs text-slate-500 mt-1">Review 12 pending applications</p>
                  </div>
                </button>
                <button className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left group">
                  <div className="w-10 h-10 bg-secondary-100 text-secondary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary-700">Manage Users</h3>
                    <p className="text-xs text-slate-500 mt-1">View and edit patient accounts</p>
                  </div>
                </button>
                <button className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left group">
                  <div className="w-10 h-10 bg-accent-100 text-accent-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary-700">System Logs</h3>
                    <p className="text-xs text-slate-500 mt-1">Monitor platform activity</p>
                  </div>
                </button>
                <button className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left group">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary-700">Support Tickets</h3>
                    <p className="text-xs text-slate-500 mt-1">3 unresolved issues</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="relative pl-6 border-l-2 border-slate-100 pb-2 last:border-0">
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${
                      activity.type === 'warning' ? 'bg-yellow-400' :
                      activity.type === 'success' ? 'bg-green-400' :
                      'bg-red-400'
                    }`}></div>
                    <p className="font-semibold text-slate-900 text-sm mb-1">{activity.action}</p>
                    <p className="text-slate-600 text-sm mb-2">{activity.details}</p>
                    <p className="text-xs text-slate-400 font-medium">{activity.time}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 text-primary-600 font-medium text-sm hover:text-primary-700 transition-colors">
                View All Activity
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}