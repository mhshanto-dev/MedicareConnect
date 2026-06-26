'use client';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { CreditCard } from 'lucide-react';
export default function Payments() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Payments</h1>
      <EmptyState icon={CreditCard} title="No Payments" description="None found." />
    </div>
  );
}
