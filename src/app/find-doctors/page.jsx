'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import Link from 'next/link';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Search, MapPin, Filter, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FindDoctors() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('asc');
  const [page, setPage] = useState(1);
  
  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ['doctors', search, sort, page],
    queryFn: async () => {
      const res = await api.get(`/doctors?search=${search}&sort=${sort}&page=${page}&limit=10`);
      return res.data;
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Find Doctors</h1>
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search by specialty, name, or condition..." 
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>
            
            <div className="md:w-64 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-slate-400" />
              </div>
              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value)} 
                className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none cursor-pointer transition-colors"
              >
                <option value="asc">Fee: Low to High</option>
                <option value="desc">Fee: High to Low</option>
              </select>
            </div>
          </div>
        </div>
        
        {isLoading && <LoadingSkeleton />}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl mb-8">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error loading doctors. Please try again.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors?.map((doctor, idx) => (
            <motion.div
              key={doctor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-primary-200 transition-all group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0">
                  {doctor?.userId?.name ? doctor.userId.name.charAt(0).toUpperCase() : 'D'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {doctor?.userId?.name || 'Dr. Specialist'}
                  </h2>
                  <p className="text-primary-600 font-medium text-sm mb-1">{doctor.specialty || 'General Practitioner'}</p>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium text-slate-700">4.8</span>
                    <span>(120+ reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-6 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><MapPin size={16}/> Location</span>
                  <span className="font-medium text-slate-900">Medical City</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><Clock size={16}/> Next Available</span>
                  <span className="font-medium text-slate-900">Tomorrow, 10 AM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Consultation Fee</span>
                  <span className="font-bold text-slate-900">${doctor.consultationFee || 50}</span>
                </div>
              </div>
              
              <Link 
                href={`/find-doctors/${doctor._id}`} 
                className="flex items-center justify-center w-full py-3 px-4 bg-primary-50 text-primary-600 rounded-xl font-semibold hover:bg-primary-500 hover:text-white transition-colors"
              >
                View Profile & Book
              </Link>
            </motion.div>
          ))}
        </div>
        
        {doctors?.length === 0 && !isLoading && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No doctors found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We couldn't find any doctors matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <button 
              onClick={() => { setSearch(''); setSort('asc'); }}
              className="mt-6 text-primary-600 font-medium hover:text-primary-700"
            >
              Clear all filters
            </button>
          </div>
        )}
        
        {/* Pagination */}
        {doctors?.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1} 
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-500 text-white font-bold">
              {page}
            </div>
            <button 
              onClick={() => setPage(p => p + 1)} 
              disabled={doctors?.length < 10} 
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Next
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}
