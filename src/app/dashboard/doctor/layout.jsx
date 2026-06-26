'use client';
import Sidebar from '@/components/Sidebar';
import { Calendar, Star, User, Pill, BarChart, LayoutDashboard, Clock } from 'lucide-react';
import RoleRoute from '@/components/RoleRoute';

const doctorLinks = [
  { href: '/dashboard/doctor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/doctor/profile', label: 'Profile', icon: User },
  { href: '/dashboard/doctor/schedule', label: 'Schedule', icon: Clock },
  { href: '/dashboard/doctor/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/doctor/prescriptions', label: 'Prescriptions', icon: Pill },
  { href: '/dashboard/doctor/reviews', label: 'Reviews', icon: Star },
  { href: '/dashboard/doctor/analytics', label: 'Analytics', icon: BarChart },
];

export default function DoctorLayout({ children }) {
  return (
    <RoleRoute allowedRoles={['doctor']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar links={doctorLinks} role="doctor" />
        <main className="flex-1 p-8 overflow-y-auto max-h-screen">
          {children}
        </main>
      </div>
    </RoleRoute>
  );
}
