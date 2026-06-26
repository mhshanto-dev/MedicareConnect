'use client';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Heart } from 'lucide-react';

export default function Favorites() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Favorite Doctors</h1>
      <EmptyState icon={Heart} title="No Favorites" description="You haven't saved any doctors yet." />
    </div>
  );
}
