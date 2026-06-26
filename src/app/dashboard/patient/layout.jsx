'use client';
import Sidebar from '@/components/Sidebar';
import { Calendar, CreditCard, Star, User, Pill, Heart, Bell, LayoutDashboard } from 'lucide-react';
import RoleRoute from '@/components/RoleRoute';

const patientLinks = [
  { href: '/dashboard/patient', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/patient/profile', label: 'Profile', icon: User },
  { href: '/dashboard/patient/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/patient/payments', label: 'Payments', icon: CreditCard },
  { href: '/dashboard/patient/reviews', label: 'Reviews', icon: Star },
  { href: '/dashboard/patient/prescriptions', label: 'Prescriptions', icon: Pill },
  { href: '/dashboard/patient/favorites', label: 'Favorites', icon: Heart },
  { href: '/dashboard/patient/notifications', label: 'Notifications', icon: Bell },
];

export default function PatientLayout({ children }) {
  return (
    <RoleRoute allowedRoles={['patient']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar links={patientLinks} role="patient" />
        <main className="flex-1 p-8 overflow-y-auto max-h-screen">
          {children}
        </main>
      </div>
    </RoleRoute>
  );
}
