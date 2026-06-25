'use client';
import { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      // Redirect based on role
      const userStr = localStorage.getItem('user'); // Ideally from Zustand state
      router.push('/dashboard'); 
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">{error}</div>}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Sign In
        </button>
        
        <p className="mt-6 text-center text-gray-600">
          Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register here</Link>
        </p>
      </form>
    </div>
  );
}
