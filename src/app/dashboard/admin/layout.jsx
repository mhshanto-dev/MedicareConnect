'use client';
import Sidebar from '@/components/Sidebar';
import { Calendar, CreditCard, Users, UserCog, BarChart, LayoutDashboard, FileText } from 'lucide-react';
import RoleRoute from '@/components/RoleRoute';

const adminLinks = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/admin/users', label: 'Users', icon: Users },
  { href: '/dashboard/admin/doctors', label: 'Doctors', icon: UserCog },
  { href: '/dashboard/admin/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart },
  { href: '/dashboard/admin/reports', label: 'Reports', icon: FileText },
];

export default function AdminLayout({ children }) {
  return (
    <RoleRoute allowedRoles={['admin']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar links={adminLinks} role="admin" />
        <main className="flex-1 p-8 overflow-y-auto max-h-screen">
          {children}
        </main>
      </div>
    </RoleRoute>
  );
}
