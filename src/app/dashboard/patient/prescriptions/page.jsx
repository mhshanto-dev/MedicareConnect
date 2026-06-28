'use client';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Pill, User, Calendar, FileText, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Prescriptions() {
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const { data: prescriptions, isLoading } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: async () => (await api.get('/prescriptions')).data
  });

  useEffect(() => {
    document.title = 'My Prescriptions | MediCare Connect';
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Prescriptions</h1>
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Prescriptions</h1>
        <p className="text-slate-500 mt-1">View and access medical prescriptions written by your doctors</p>
      </div>

      {!prescriptions || prescriptions.length === 0 ? (
        <EmptyState icon={Pill} title="No Prescriptions" description="You have no written prescriptions." />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border shadow-sm divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden">
          {prescriptions.map((pr) => (
            <div 
              key={pr._id} 
              onClick={() => setSelectedPrescription(pr)}
              className="p-6 flex justify-between items-center hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <div className="flex gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl flex-shrink-0">
                  <Pill size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Diagnosis: {pr.diagnosis}</h4>
                  <p className="text-sm text-slate-500 mt-1">Prescribed by Dr. {pr.doctorId?.userId?.name || 'Specialist'}</p>
                  <p className="text-xs text-slate-400 mt-2">Date: {new Date(pr.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-semibold text-slate-650">
                  {pr.medications?.length || 0} Medications
                </span>
                <ChevronRight size={18} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prescription Detail Modal */}
      <AnimatePresence>
        {selectedPrescription && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl relative border"
            >
              <button 
                onClick={() => setSelectedPrescription(null)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-650"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-700">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Pill size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Prescription Details</h3>
                  <p className="text-xs text-slate-500 mt-1">Issued on {new Date(selectedPrescription.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-6 pt-6 text-sm">
                {/* Doctor Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-700">
                    Dr
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Prescribing Doctor</p>
                    <p className="font-bold text-slate-900 dark:text-white">Dr. {selectedPrescription.doctorId?.userId?.name}</p>
                  </div>
                </div>

                {/* Diagnosis */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Diagnosis</p>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-800 dark:text-white">{selectedPrescription.diagnosis}</p>
                  </div>
                </div>

                {/* Medications List */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Medications</p>
                  <div className="space-y-2">
                    {selectedPrescription.medications?.map((med, idx) => (
                      <div key={idx} className="p-3 bg-blue-50/30 dark:bg-blue-900/10 rounded-xl border border-blue-100/30 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">{med.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Dosage: {med.dosage} • Frequency: {med.frequency}</p>
                        </div>
                        <span className="text-xs font-semibold bg-blue-100/50 text-blue-700 px-2.5 py-1 rounded-md">
                          {med.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedPrescription.notes && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Doctor Notes</p>
                    <p className="text-slate-655 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl leading-relaxed whitespace-pre-line italic">
                      "{selectedPrescription.notes}"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
