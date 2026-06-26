'use client';

import { motion } from 'framer-motion';
import { Heart, Activity, Brain, Bone, Eye, Stethoscope, ShieldCheck, Clock, Award } from 'lucide-react';
import Link from 'next/link';

const specializations = [
  { icon: <Heart className="w-8 h-8" />, name: 'Cardiology', desc: 'Expert care for your heart' },
  { icon: <Brain className="w-8 h-8" />, name: 'Neurology', desc: 'Advanced neurological treatments' },
  { icon: <Bone className="w-8 h-8" />, name: 'Orthopedics', desc: 'Bone and joint care' },
  { icon: <Eye className="w-8 h-8" />, name: 'Ophthalmology', desc: 'Vision and eye health' },
  { icon: <Activity className="w-8 h-8" />, name: 'Endocrinology', desc: 'Hormonal disorder treatments' },
  { icon: <Stethoscope className="w-8 h-8" />, name: 'General Medicine', desc: 'Primary healthcare services' },
];

const features = [
  { icon: <ShieldCheck className="w-6 h-6 text-primary-500" />, title: 'Verified Doctors', desc: 'Every doctor on our platform is thoroughly verified.' },
  { icon: <Clock className="w-6 h-6 text-primary-500" />, title: '24/7 Availability', desc: 'Book appointments anytime, day or night.' },
  { icon: <Award className="w-6 h-6 text-primary-500" />, title: 'Quality Care', desc: 'We ensure the highest standards of healthcare.' },
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Specializations */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Medical Specializations</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Find experienced doctors across various specialties to get the specific care you need.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((spec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={`/find-doctors?specialty=${encodeURIComponent(spec.name)}`}>
                  <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                      {spec.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{spec.name}</h3>
                    <p className="text-slate-500 text-sm">{spec.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Choose Us & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Choose MediCare Connect?</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We bring the best healthcare professionals to your fingertips. Our platform is designed to make finding, booking, and managing your medical appointments as seamless as possible.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-1">{feature.title}</h4>
                    <p className="text-slate-500 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="bg-primary-50 p-8 rounded-3xl text-center">
              <div className="text-4xl font-extrabold text-primary-600 mb-2">1M+</div>
              <div className="text-sm font-medium text-slate-600">Happy Patients</div>
            </div>
            <div className="bg-secondary-50 p-8 rounded-3xl text-center transform translate-y-8">
              <div className="text-4xl font-extrabold text-secondary-600 mb-2">15k+</div>
              <div className="text-sm font-medium text-slate-600">Verified Doctors</div>
            </div>
            <div className="bg-accent-50 p-8 rounded-3xl text-center">
              <div className="text-4xl font-extrabold text-accent-600 mb-2">50+</div>
              <div className="text-sm font-medium text-slate-600">Specializations</div>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl text-center transform translate-y-8">
              <div className="text-4xl font-extrabold text-slate-700 mb-2">4.9/5</div>
              <div className="text-sm font-medium text-slate-600">Average Rating</div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
