'use client';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Users } from 'lucide-react';
export default function ManageUsers() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Users</h1>
      <EmptyState icon={Users} title="No Users" description="None found." />
    </div>
  );
}
