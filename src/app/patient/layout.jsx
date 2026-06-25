'use client';
import Sidebar from '../../components/Sidebar';
import { Calendar, CreditCard, Star } from 'lucide-react';
import RoleRoute from '../../components/RoleRoute';

const patientLinks = [
  { href: '/patient/appointments', label: 'Appointments', icon: Calendar },
  { href: '/patient/payments', label: 'Payments', icon: CreditCard },
  { href: '/patient/reviews', label: 'Reviews', icon: Star },
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
