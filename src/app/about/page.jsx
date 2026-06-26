import { Users, Award, Heart, Shield } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'About Us | MediCare Connect',
  description: 'Learn more about MediCare Connect and our mission.',
};

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-slate-50 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-50 rounded-l-[100px] opacity-50 hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">About MediCare Connect</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              We are on a mission to make premium healthcare accessible, seamless, and transparent for everyone. By connecting patients with top-tier medical professionals, we're changing the way people experience healthcare.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Patient First</h3>
              <p className="text-slate-600">Every decision we make is centered around improving the patient experience.</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto bg-secondary-100 text-secondary-600 rounded-2xl flex items-center justify-center mb-6">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Excellence</h3>
              <p className="text-slate-600">We partner only with the most qualified and highly rated doctors.</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto bg-accent-100 text-accent-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Trust & Security</h3>
              <p className="text-slate-600">Your health data is protected by enterprise-grade security protocols.</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Compassion</h3>
              <p className="text-slate-600">We care about your well-being and are here for you 24/7.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Story Section */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Founded in 2024, MediCare Connect was born out of a simple frustration: finding a good doctor and booking an appointment shouldn't be so difficult. Long waiting times, endless phone calls, and lack of transparency in healthcare were problems we wanted to solve.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Today, we serve over 1 million patients, connecting them with thousands of verified healthcare professionals across 50+ specializations. We believe that technology can bridge the gap between patients and doctors, leading to better health outcomes for everyone.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary-100 rounded-full z-0"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary-100 rounded-full z-0"></div>
              <div className="relative z-10 bg-slate-100 rounded-2xl aspect-video flex items-center justify-center text-slate-400">
                <span className="font-medium">Video/Image Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
