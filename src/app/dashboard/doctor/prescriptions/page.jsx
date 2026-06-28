'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Pill, Plus, Trash2, X, FileText, User, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Prescriptions() {
  const queryClient = useQueryClient();
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Form states
  const [patientId, setPatientId] = useState('');
  const [appointmentId, setAppointmentId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState([
    { name: '', dosage: '', frequency: '', duration: '' }
  ]);

  // Fetch prescriptions written by the doctor
  const { data: prescriptions, isLoading: isPrescriptionsLoading, refetch } = useQuery({
    queryKey: ['doctorPrescriptions'],
    queryFn: async () => (await api.get('/prescriptions')).data
  });

  // Fetch appointments to get a list of patients the doctor has had visits with
  const { data: appointmentsRes, isLoading: isAppointmentsLoading } = useQuery({
    queryKey: ['doctorAppointments'],
    queryFn: async () => (await api.get('/appointments/doctor/mine')).data
  });

  const appointments = appointmentsRes?.appointments || [];

  // Filter completed/confirmed appointments for patient drop-down selection
  const eligibleAppointments = appointments.filter(
    apt => apt.status === 'confirmed' || apt.status === 'completed'
  );

  useEffect(() => {
    document.title = 'Prescriptions | MediCare Connect';
  }, []);

  const addMedicationRow = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const removeMedicationRow = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleMedicationChange = (index, field, value) => {
    const updated = medications.map((med, i) => {
      if (i === index) {
        return { ...med, [field]: value };
      }
      return med;
    });
    setMedications(updated);
  };

  // Write Prescription Mutation
  const createPrescriptionMutation = useMutation({
    mutationFn: async (payload) => {
      return api.post('/prescriptions', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorPrescriptions']);
      refetch();
      setIsWriteOpen(false);
      // Reset form
      setPatientId('');
      setAppointmentId('');
      setDiagnosis('');
      setNotes('');
      setMedications([{ name: '', dosage: '', frequency: '', duration: '' }]);
      toast.success('Prescription created and sent to patient!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to issue prescription');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientId || !appointmentId || !diagnosis) {
      toast.error('Patient, Appointment and Diagnosis are required fields.');
      return;
    }

    const invalidMed = medications.some(m => !m.name || !m.dosage || !m.frequency);
    if (invalidMed) {
      toast.error('Please complete all medication row entries.');
      return;
    }

    createPrescriptionMutation.mutate({
      patientId,
      appointmentId,
      diagnosis,
      notes,
      medications
    });
  };

  if (isPrescriptionsLoading || isAppointmentsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Prescriptions</h1>
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Prescriptions</h1>
          <p className="text-slate-500 mt-1">Issue and manage patient medication prescriptions</p>
        </div>

        <button
          onClick={() => setIsWriteOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-blue-500/20"
        >
          <Plus size={16} /> Write Prescription
        </button>
      </div>

      {!prescriptions || prescriptions.length === 0 ? (
        <EmptyState icon={Pill} title="No Prescriptions Issued" description="You have not written any prescriptions yet." />
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
                  <h4 className="font-bold text-slate-900 dark:text-white">Patient: {pr.patientId?.name || 'Unknown Patient'}</h4>
                  <p className="text-sm text-slate-500 mt-1">Diagnosis: {pr.diagnosis}</p>
                  <p className="text-xs text-slate-400 mt-2">Issued: {new Date(pr.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-semibold text-slate-650">
                  {pr.medications?.length || 0} meds
                </span>
                <ChevronRight size={18} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Write Prescription Drawer/Modal */}
      <AnimatePresence>
        {isWriteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-xl relative border max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsWriteOpen(false)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-650"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Pill className="text-blue-500" /> Write New Prescription
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Select Appointment (which defines the patient) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Select Consultation</label>
                    <select
                      required
                      value={appointmentId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAppointmentId(val);
                        const selectedApt = eligibleAppointments.find(a => a._id === val);
                        if (selectedApt) {
                          setPatientId(selectedApt.patientId?._id || selectedApt.patientId);
                        }
                      }}
                      className="block w-full px-3 py-2.5 border rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Choose Visit --</option>
                      {eligibleAppointments.map((av) => (
                        <option key={av._id} value={av._id}>
                          {av.patientId?.name} - {new Date(av.date).toLocaleDateString()} at {av.time}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Diagnosis</label>
                    <input
                      type="text"
                      required
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Acute Bronchitis"
                      className="block w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Medications List */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Medications List</label>
                    <button
                      type="button"
                      onClick={addMedicationRow}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Medicine
                    </button>
                  </div>

                  <div className="space-y-3">
                    {medications.map((med, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-3 items-end sm:items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 relative">
                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                          <div>
                            <input
                              type="text"
                              required
                              placeholder="Medication Name"
                              value={med.name}
                              onChange={(e) => handleMedicationChange(idx, 'name', e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              required
                              placeholder="Dosage (e.g. 500mg)"
                              value={med.dosage}
                              onChange={(e) => handleMedicationChange(idx, 'dosage', e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              required
                              placeholder="Frequency (e.g. Twice daily)"
                              value={med.frequency}
                              onChange={(e) => handleMedicationChange(idx, 'frequency', e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="Duration (e.g. 7 days)"
                              value={med.duration}
                              onChange={(e) => handleMedicationChange(idx, 'duration', e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {medications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedicationRow(idx)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Instructions / Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Take after meals. Rest well and follow up if symptoms persist."
                    rows={3}
                    className="block w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-6 border-t flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsWriteOpen(false)}
                    className="px-5 py-2.5 border rounded-xl text-sm font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createPrescriptionMutation.isLoading}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-sm"
                  >
                    {createPrescriptionMutation.isLoading ? 'Issuing...' : 'Save & Issue'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-655"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-700">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Pill size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-extrabold">Prescription issued</h3>
                  <p className="text-xs text-slate-500 mt-1">Issued on {new Date(selectedPrescription.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-6 pt-6 text-sm">
                {/* Patient Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-105 rounded-xl flex items-center justify-center font-bold text-slate-700">
                    Pt
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Patient</p>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedPrescription.patientId?.name}</p>
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
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Instructions</p>
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
