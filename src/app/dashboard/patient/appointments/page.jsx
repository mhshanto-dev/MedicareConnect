'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import toast from 'react-hot-toast';

export default function Appointments() {
  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ['patient-appointments'],
    queryFn: async () => {
      const res = await api.get('/appointments');
      return res.data;
    }
  });

  const handleCancel = async (id) => {
    try {
      // In a real app we'd call a DELETE or PATCH endpoint
      await api.delete(`/appointments/${id}`);
      toast.success('Appointment cancelled successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Appointments</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-600">Doctor</th>
              <th className="p-4 font-semibold text-gray-600">Date & Time</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments?.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-gray-500">No appointments found.</td></tr>
            ) : (
              appointments?.map((app) => (
                <tr key={app._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">{app.doctorId?.userId?.name || 'Dr. Specialist'}</td>
                  <td className="p-4 text-gray-600">{new Date(app.date).toLocaleDateString()} at {app.time}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${app.status === 'scheduled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {app.status || 'Scheduled'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleCancel(app._id)} className="text-red-600 hover:text-red-800 font-medium transition">Cancel</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
