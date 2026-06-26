'use client';
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

function DashboardContent() {
  const { user, isAuthenticated, checkAuth, syncGoogleSession, isLoading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const isGoogleCallback = searchParams.get('google') === 'true';

    const init = async () => {
      if (isGoogleCallback && !syncing) {
        setSyncing(true);
        const result = await syncGoogleSession();
        setSyncing(false);
        if (!result.success) {
          router.push('/login');
          return;
        }
      } else {
        await checkAuth();
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!isLoading && !syncing) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (user?.role === 'doctor') {
        router.push('/dashboard/doctor');
      } else {
        router.push('/dashboard/patient');
      }
    }
  }, [isLoading, isAuthenticated, user, router, syncing]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}

export default function DashboardRedirect() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><p>Loading...</p></div>}>
      <DashboardContent />
    </Suspense>
  );
}
