'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../store/useAuthStore';

export default function DashboardRedirect() {
  const { user, isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role === 'admin') {
        router.push('/admin/analytics');
      } else if (user?.role === 'doctor') {
        router.push('/doctor/schedule');
      } else {
        router.push('/patient/appointments');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  return <div className="min-h-[50vh] flex items-center justify-center">Redirecting to your dashboard...</div>;
}
