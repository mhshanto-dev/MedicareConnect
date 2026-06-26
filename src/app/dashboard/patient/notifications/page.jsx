'use client';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Bell } from 'lucide-react';

export default function Notifications() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notifications</h1>
      <EmptyState icon={Bell} title="No Notifications" description="You are all caught up!" />
    </div>
  );
}
