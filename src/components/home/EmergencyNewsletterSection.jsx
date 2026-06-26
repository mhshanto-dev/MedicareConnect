'use client';

import { motion } from 'framer-motion';
import { PhoneCall, Mail } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function EmergencyNewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Successfully subscribed to the newsletter!');
    setEmail('');
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Emergency Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-500 to-rose-600 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-xl shadow-red-500/20 mb-20"
        >
          <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">Need Emergency Care?</h2>
            <p className="text-red-100 text-lg">Our emergency services are available 24/7. Don't hesitate to call.</p>
          </div>
          <a
            href="tel:911"
            className="flex items-center gap-3 bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-xl hover:bg-red-50 transition-colors shadow-lg"
          >
            <PhoneCall size={24} />
            <span>Call 911</span>
          </a>
        </motion.div>

        {/* Newsletter Section */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-16 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated on Your Health</h2>
            <p className="text-slate-400 mb-8">
              Subscribe to our newsletter to receive the latest health articles, tips from top doctors, and updates about our platform.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-primary-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-sm shadow-primary-500/30 whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
