'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import Link from 'next/link';
import LoadingSkeleton from '@/components/LoadingSkeleton';

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
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Find Doctors</h1>
      <div className="flex gap-4 mb-8">
        <input 
          type="text" 
          placeholder="Search by specialty or name..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-md p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="p-3 border rounded-lg outline-none">
          <option value="asc">Fee: Low to High</option>
          <option value="desc">Fee: High to Low</option>
        </select>
      </div>
      
      {isLoading && <LoadingSkeleton />}
      {error && <div className="text-red-500 bg-red-50 p-4 rounded-lg">Error loading doctors. Please try again.</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors?.map(doctor => (
          <div key={doctor._id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
            <h2 className="text-xl font-bold text-gray-800">{doctor?.userId?.name || 'Dr. Specialist'}</h2>
            <p className="text-blue-600 font-medium mb-2">{doctor.specialty || 'General'}</p>
            <p className="text-gray-600 mb-4">Consultation Fee: ${doctor.consultationFee || 50}</p>
            <Link href={`/find-doctors/${doctor._id}`} className="block w-full text-center bg-blue-50 text-blue-600 py-2 rounded font-medium hover:bg-blue-100 transition">
              View Profile & Book
            </Link>
          </div>
        ))}
        {doctors?.length === 0 && <p className="text-gray-500">No doctors found matching your search.</p>}
      </div>
      
      <div className="flex justify-center gap-4 mt-12">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-6 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">Previous</button>
        <span className="py-2 px-4 bg-gray-100 rounded font-medium">Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={doctors?.length < 10} className="px-6 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}
