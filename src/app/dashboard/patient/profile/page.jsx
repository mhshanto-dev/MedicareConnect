'use client';
import { useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuthStore();
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700">
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>
    </div>
  );
}
