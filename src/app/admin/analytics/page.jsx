'use client';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const data = [
    { name: 'Jan', appointments: 400, revenue: 2400 },
    { name: 'Feb', appointments: 300, revenue: 1398 },
    { name: 'Mar', appointments: 200, revenue: 9800 },
    { name: 'Apr', appointments: 278, revenue: 3908 },
    { name: 'May', appointments: 189, revenue: 4800 },
    { name: 'Jun', appointments: 239, revenue: 3800 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Platform Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-gray-500 font-medium mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-blue-600">$24,500</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-gray-500 font-medium mb-2">Total Appointments</h3>
          <p className="text-3xl font-bold text-blue-600">1,606</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-gray-500 font-medium mb-2">Active Doctors</h3>
          <p className="text-3xl font-bold text-blue-600">45</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border h-96">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Revenue & Appointments Trend</h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#2563eb" />
            <YAxis yAxisId="right" orientation="right" stroke="#16a34a" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="appointments" fill="#16a34a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
