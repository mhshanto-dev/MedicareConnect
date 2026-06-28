'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { FileText, Printer, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Reports() {
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => (await api.get('/admin/stats')).data
  });

  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ['adminUsersAll'],
    queryFn: async () => (await api.get('/admin/users?limit=100')).data
  });

  const { data: appointmentsData, isLoading: isAppointmentsLoading } = useQuery({
    queryKey: ['adminAppointmentsAll'],
    queryFn: async () => (await api.get('/admin/appointments?limit=100')).data
  });

  useEffect(() => {
    document.title = 'System Reports | MediCare Connect';
  }, []);

  if (isStatsLoading || isUsersLoading || isAppointmentsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        <SkeletonCard />
      </div>
    );
  }

  const users = usersData?.users || [];
  const appointments = appointmentsData?.appointments || [];

  const activeUsersCount = users.filter(u => u.status === 'active').length;
  const suspendedUsersCount = users.filter(u => u.status === 'inactive').length;

  const paidAppointmentsCount = appointments.filter(a => a.paymentStatus === 'paid').length;
  const completedAppointmentsCount = appointments.filter(a => a.status === 'completed').length;
  const cancelledAppointmentsCount = appointments.filter(a => a.status === 'cancelled').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto printable-section">
      <div className="flex justify-between items-start gap-4 non-printable">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Platform System Reports</h1>
          <p className="text-slate-500 mt-1">Generate and print clinical database statistics and user registration activity</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 border rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white shadow-sm"
          >
            <Printer size={14} /> Print Report
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border shadow-sm space-y-8 text-slate-800">
        
        {/* Document Header */}
        <div className="flex justify-between items-start border-b pb-6">
          <div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">MEDICARE CONNECT</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Platform Operations & Database Status Report</p>
          </div>
          <div className="text-right text-xs text-slate-500 font-medium">
            <p>Generated: {new Date().toLocaleDateString()}</p>
            <p>Time: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
            <FileText size={18} className="text-blue-500" /> Executive Summary
          </h3>
          <p className="text-sm leading-relaxed text-slate-655">
            This operational review document summarizes registration volumes, consultation billing revenue, and schedule statuses for the healthcare SaaS portal. Currently, the database records <strong>{stats?.totalUsers}</strong> registered users and <strong>{stats?.totalDoctors}</strong> medical practitioners.
          </p>
        </div>

        {/* Detailed Metrics Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Operational Analytics Breakdown</h3>
          <div className="border rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Indicator Metric</th>
                  <th className="p-4 text-right">Database Value</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-4 font-medium">Total Registered Platform Users</td>
                  <td className="p-4 text-right font-bold text-slate-900">{stats?.totalUsers}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium pl-8 text-slate-500">Active User Accounts</td>
                  <td className="p-4 text-right text-slate-700">{activeUsersCount}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium pl-8 text-slate-500">Suspended / Inactive Accounts</td>
                  <td className="p-4 text-right text-slate-700">{suspendedUsersCount}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Total Medical Doctors</td>
                  <td className="p-4 text-right font-bold text-slate-900">{stats?.totalDoctors}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium pl-8 text-slate-500">Verified Practitioners</td>
                  <td className="p-4 text-right text-slate-750">{stats?.totalDoctors - stats?.pendingDoctors}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium pl-8 text-slate-500">Practitioners Awaiting Verification</td>
                  <td className="p-4 text-right text-slate-750">{stats?.pendingDoctors}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Total Booking Invoices Issued</td>
                  <td className="p-4 text-right font-bold text-slate-900">{stats?.totalAppointments}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium pl-8 text-slate-500">Completed consultations</td>
                  <td className="p-4 text-right text-slate-700">{completedAppointmentsCount}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium pl-8 text-slate-500">Cancelled consultations</td>
                  <td className="p-4 text-right text-slate-700">{cancelledAppointmentsCount}</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="p-4 text-slate-900">Total Consultation Payments Processed</td>
                  <td className="p-4 text-right text-slate-900">${stats?.totalRevenue}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t text-center text-xs text-slate-400">
          <p>Confidential Internal Report - MediCare Connect Administration Control. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}
