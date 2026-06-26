'use client';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import useAuthStore from '@/store/useAuthStore';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SkeletonCard />
      </div>
    </div>
  );
}
