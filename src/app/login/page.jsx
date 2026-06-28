'use client';

import { useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Heart, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';

const floatingIconVariants = {
  animate: (i) => ({
    y: [0, -12, 0],
    transition: {
      duration: 3 + i * 0.5,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: i * 0.4,
    },
  }),
};

const featureItems = [
  {
    icon: Stethoscope,
    title: 'Expert Doctors',
    desc: 'Connect with 500+ verified specialists',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your health data is fully encrypted',
  },
  {
    icon: Heart,
    title: 'Instant Booking',
    desc: 'Schedule appointments in seconds',
  },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleLogin } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      toast.success('Welcome back!');
      router.push('/dashboard');
    } else {
      toast.error(res.error || 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch (err) {
      toast.error('Google login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex" style={{ background: '#F0F9FF' }}>
      {/* ── Left Panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden w-[52%]"
        style={{
          background: 'linear-gradient(135deg, #0EA5E9 0%, #0369A1 40%, #14B8A6 100%)',
        }}
      >
        {/* Background decorative circles */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'rgba(255,255,255,0.3)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10 translate-x-1/3 translate-y-1/3"
          style={{ background: 'rgba(255,255,255,0.5)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'rgba(255,255,255,0.4)' }}
        />

        {/* Top logo area */}
        <div className="relative z-10 p-10">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}
            >
              <span className="text-white font-bold text-2xl leading-none">+</span>
            </div>
            <span className="text-white text-2xl font-extrabold tracking-tight">
              MediCare<span className="font-light opacity-80"> Connect</span>
            </span>
          </Link>
        </div>

        {/* Centre content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-white font-extrabold text-4xl leading-tight mb-4">
              Your health,<br />
              <span style={{ color: 'rgba(255,255,255,0.75)' }}>our priority.</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm">
              Sign in and access world-class healthcare — anywhere, anytime.
            </p>
          </motion.div>

          {/* Feature cards */}
          <div className="mt-10 space-y-4">
            {featureItems.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                variants={floatingIconVariants}
                animate="animate"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
                className="flex items-center gap-4 rounded-2xl px-5 py-4"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                >
                  <item.icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-white/60 text-xs mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 p-10">
          <p className="text-white/50 text-xs">
            © 2026 MediCare Connect · All rights reserved
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: '#0EA5E9' }}
              >
                <span className="text-white font-bold text-xl leading-none">+</span>
              </div>
              <span
                className="text-2xl font-extrabold"
                style={{
                  background: 'linear-gradient(135deg, #0EA5E9, #14B8A6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                MediCare
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2
              className="text-3xl font-extrabold mb-2"
              style={{ color: '#0F172A' }}
            >
              Welcome back
            </h2>
            <p style={{ color: '#64748B' }} className="text-sm">
              Sign in to your{' '}
              <span
                className="font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #0EA5E9, #14B8A6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                MediCare Connect
              </span>{' '}
              account
            </p>
          </div>

          {/* Form card */}
          <div
            className="rounded-3xl p-8 shadow-2xl"
            style={{
              background: '#FFFFFF',
              boxShadow: '0 25px 60px rgba(14,165,233,0.10)',
              border: '1px solid rgba(14,165,233,0.1)',
            }}
          >
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: '#334155' }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={17} style={{ color: '#94A3B8' }} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                    style={{
                      border: '1.5px solid #E2E8F0',
                      color: '#0F172A',
                      background: '#F8FAFC',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0EA5E9';
                      e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.12)';
                      e.target.style.background = '#FFFFFF';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = '#F8FAFC';
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: '#334155' }}
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={17} style={{ color: '#94A3B8' }} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm outline-none transition-all"
                    style={{
                      border: '1.5px solid #E2E8F0',
                      color: '#0F172A',
                      background: '#F8FAFC',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0EA5E9';
                      e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.12)';
                      e.target.style.background = '#FFFFFF';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = '#F8FAFC';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    style={{ color: '#94A3B8' }}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <a
                    href="#"
                    className="text-xs font-medium transition-colors"
                    style={{ color: '#0EA5E9' }}
                    onMouseOver={(e) => (e.target.style.color = '#0369A1')}
                    onMouseOut={(e) => (e.target.style.color = '#0EA5E9')}
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)',
                  boxShadow: '0 8px 24px rgba(14,165,233,0.35)',
                }}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ background: '#E2E8F0' }} />
              <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>
                Or continue with
              </span>
              <div className="flex-1 h-px" style={{ background: '#E2E8F0' }} />
            </div>

            {/* Google */}
            <motion.button
              onClick={handleGoogleLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                border: '1.5px solid #E2E8F0',
                color: '#334155',
                background: '#FFFFFF',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#F8FAFC';
                e.currentTarget.style.borderColor = '#CBD5E1';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </motion.button>
          </div>

          {/* Register link */}
          <p className="text-center text-sm mt-6" style={{ color: '#64748B' }}>
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-semibold transition-colors"
              style={{ color: '#0EA5E9' }}
            >
              Create account →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
