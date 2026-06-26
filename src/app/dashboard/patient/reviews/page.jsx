'use client';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Star } from 'lucide-react';

export default function Reviews() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Reviews</h1>
      <EmptyState icon={Star} title="No Reviews" description="You haven't written any reviews yet." />
    </div>
  );
}
