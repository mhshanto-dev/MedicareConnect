'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Search, Filter, Shield, User, AlertCircle, ArrowUpDown } from 'lucide-react';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);

  // Fetch Users
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminUsers', search, role, page],
    queryFn: async () => {
      const res = await api.get(`/admin/users?search=${search}&role=${role}&page=${page}&limit=10`);
      return res.data;
    }
  });

  useEffect(() => {
    document.title = 'Manage Users | MediCare Connect';
  }, []);

  // Toggle Status Mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async (id) => {
      return api.patch(`/admin/users/${id}/status`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      refetch();
      toast.success('User status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update user status');
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <SkeletonCard />
      </div>
    );
  }

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Manage Users</h1>
        <p className="text-slate-500 mt-1">Review accounts, roles, and toggle access states across the platform</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="block w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div className="w-full sm:w-48 relative">
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="block w-full px-3 py-2.5 border rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
          >
            <option value="">All Roles</option>
            <option value="patient">Patients</option>
            <option value="doctor">Doctors</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {users.length === 0 ? (
        <EmptyState icon={User} title="No Users Found" description="Try adjusting your filters or query search." />
      ) : (
        <div className="bg-white dark:bg-slate-800 border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 sm:p-6">User details</th>
                  <th className="p-4 sm:p-6">Role</th>
                  <th className="p-4 sm:p-6">Joined Date</th>
                  <th className="p-4 sm:p-6">Status</th>
                  <th className="p-4 sm:p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                <AnimatePresence mode="popLayout">
                  {users.map((u, idx) => (
                    <motion.tr
                      layout
                      key={u._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-750 transition-colors"
                    >
                      <td className="p-4 sm:p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-base flex-shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 sm:p-6 font-semibold text-slate-700 dark:text-slate-300 capitalize">
                        {u.role}
                      </td>
                      <td className="p-4 sm:p-6 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 sm:p-6">
                        <StatusBadge status={u.status} />
                      </td>
                      <td className="p-4 sm:p-6 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => toggleStatusMutation.mutate(u._id)}
                            disabled={toggleStatusMutation.isLoading}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              u.status === 'active'
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex items-center justify-center px-3 py-1 bg-blue-600 text-white rounded font-bold text-xs">
                {page} / {totalPages}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
