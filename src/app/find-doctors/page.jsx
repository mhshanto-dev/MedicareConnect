'use client';
import { useState, useEffect } from 'react';

export default function FindDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this will fetch from our Express backend: /api/doctors
    setTimeout(() => {
      setDoctors([
        { _id: '1', name: 'Dr. Sarah Jenkins', specialty: 'Cardiologist', fee: 150 },
        { _id: '2', name: 'Dr. Michael Chen', specialty: 'Dermatologist', fee: 100 },
        { _id: '3', name: 'Dr. Emily Watson', specialty: 'Pediatrician', fee: 90 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Find Doctors</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg text-gray-500 animate-pulse">Loading doctors...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map(doctor => (
            <div key={doctor._id} className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white flex flex-col">
              <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
              <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
              <p className="text-gray-600 mb-6 flex-grow">Consultation Fee: <span className="font-semibold">${doctor.fee}</span></p>
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
