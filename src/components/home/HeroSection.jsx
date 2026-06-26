'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, MapPin, Activity, Stethoscope, Users } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery || location) {
      router.push(`/find-doctors?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
    } else {
      router.push('/find-doctors');
    }
  };

  return (
    <div className="relative bg-slate-50 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-6">
              <Activity size={16} />
              <span>Premium Healthcare Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Find and Book <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
                Top Doctors
              </span> Near You
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 max-w-xl">
              Connect with specialized healthcare professionals, book appointments effortlessly, and manage your health journey in one place.
            </p>

            {/* Search Box */}
            <div className="bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-primary-500"
                    placeholder="Search doctors, specialties..."
                  />
                </div>
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-primary-500"
                    placeholder="Location"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-sm shadow-primary-500/30 flex-shrink-0"
                >
                  Search
                </button>
              </form>
            </div>
          </motion.div>

          {/* Hero Image / Stats */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-secondary-100 rounded-[3rem] rotate-6 transform transition-transform hover:rotate-12 duration-700"></div>
              <div className="absolute inset-0 bg-white rounded-[3rem] shadow-xl overflow-hidden flex items-center justify-center p-8 border border-slate-100">
                {/* Placeholder for an actual image, we will use a nice composition */}
                <div className="w-full h-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                  <Stethoscope size={64} className="mb-4 text-primary-300" />
                  <span className="font-medium">Healthcare Professional</span>
                </div>
              </div>
              
              {/* Floating Stat Card 1 */}
              <div className="absolute -left-10 top-20 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center text-accent-600">
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">1M+</div>
                    <div className="text-xs text-slate-500">Active Patients</div>
                  </div>
                </div>
              </div>

              {/* Floating Stat Card 2 */}
              <div className="absolute -right-8 bottom-20 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600">
                    <Activity size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">15k+</div>
                    <div className="text-xs text-slate-500">Verified Doctors</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
