'use client';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Bell, Check, Trash2, MailOpen, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Notifications() {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get('/notifications')).data
  });

  useEffect(() => {
    document.title = 'My Notifications | MediCare Connect';
  }, []);

  // Mark all read mutation
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      return api.patch('/notifications/mark-all-read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      refetch();
      toast.success('All notifications marked as read');
    },
    onError: () => {
      toast.error('Failed to mark notifications as read');
    }
  });

  // Mark single read mutation
  const markReadMutation = useMutation({
    mutationFn: async (id) => {
      return api.patch(`/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      refetch();
    },
    onError: () => {
      toast.error('Failed to update notification');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      refetch();
      toast.success('Notification deleted');
    },
    onError: () => {
      toast.error('Failed to delete notification');
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <SkeletonCard />
      </div>
    );
  }

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-slate-500 mt-1">You have {unreadCount} unread notifications</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllReadMutation.mutate()}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors"
          >
            <Check size={14} />
            Mark all read
          </button>
        )}
      </div>

      {!notifications || notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No Notifications" description="You are all caught up!" />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border shadow-sm divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {notifications.map((n) => (
              <motion.div
                layout
                key={n._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`p-6 flex justify-between items-start gap-4 transition-colors ${
                  !n.isRead ? 'bg-slate-50/55 dark:bg-slate-900/10' : ''
                }`}
              >
                <div className="flex gap-4">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 mt-0.5 ${
                    !n.isRead 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-700'
                  }`}>
                    {!n.isRead ? <Mail size={18} /> : <MailOpen size={18} />}
                  </div>
                  <div>
                    <h4 className={`font-bold text-slate-900 dark:text-white ${!n.isRead ? 'font-extrabold' : ''}`}>
                      {n.title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-350 text-sm mt-1">{n.message}</p>
                    <span className="text-xs text-slate-400 mt-2 block">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1">
                  {!n.isRead && (
                    <button
                      onClick={() => markReadMutation.mutate(n._id)}
                      title="Mark as read"
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(n._id)}
                    title="Delete notification"
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
