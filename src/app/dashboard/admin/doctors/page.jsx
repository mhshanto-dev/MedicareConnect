'use client';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Users } from 'lucide-react';
export default function ManageDoctors() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Doctors</h1>
      <EmptyState icon={Users} title="No Doctors" description="None found." />
    </div>
  );
}
