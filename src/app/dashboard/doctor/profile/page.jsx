'use client';
import useAuthStore from '@/store/useAuthStore';
export default function Profile() {
  const { user } = useAuthStore();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Doctor Profile</h1>
      <p>Dr. {user?.name}</p>
    </div>
  );
}
