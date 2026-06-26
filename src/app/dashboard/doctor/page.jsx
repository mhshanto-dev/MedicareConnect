'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Calendar } from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold dark:text-white">Welcome, Dr. {user?.name}</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SkeletonCard />
      </div>
    </div>
  );
}
