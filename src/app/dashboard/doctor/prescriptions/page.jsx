'use client';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { FileText } from 'lucide-react';
export default function Prescriptions() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Prescriptions</h1>
      <EmptyState icon={FileText} title="No Prescriptions" description="None written." />
    </div>
  );
}
