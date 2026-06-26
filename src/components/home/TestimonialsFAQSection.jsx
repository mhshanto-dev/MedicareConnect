'use client';

import { motion } from 'framer-motion';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Patient',
    content: 'Finding a good doctor was always a hassle until I found MediCare Connect. The platform is incredibly easy to use and I booked my appointment in minutes.',
    rating: 5,
    avatar: 'S'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Patient',
    content: 'The 24/7 availability feature is a lifesaver. I had a medical emergency late at night and was able to consult with a specialist immediately.',
    rating: 5,
    avatar: 'M'
  },
  {
    id: 3,
    name: 'Emma Williams',
    role: 'Patient',
    content: 'Very professional service. The doctors are highly qualified and the whole process from booking to consultation is seamless.',
    rating: 4,
    avatar: 'E'
  }
];

const faqs = [
  {
    question: 'How do I book an appointment?',
    answer: 'You can search for a doctor based on specialty or location, select an available time slot on their profile, and confirm your booking. You will receive a confirmation email immediately.'
  },
  {
    question: 'Are the doctors verified?',
    answer: 'Yes, all doctors on our platform undergo a strict verification process where we check their medical licenses, qualifications, and past experience.'
  },
  {
    question: 'Can I cancel or reschedule my appointment?',
    answer: 'Yes, you can cancel or reschedule your appointment from your Patient Dashboard up to 24 hours before the scheduled time without any penalty.'
  },
  {
    question: 'Is my medical data secure?',
    answer: 'Absolutely. We use enterprise-grade encryption to ensure all your medical records, prescriptions, and personal data are kept strictly confidential and secure.'
  }
];

export default function TestimonialsFAQSection() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Testimonials */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What Our Patients Say</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Read about the experiences of thousands of patients who have trusted us with their healthcare needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < testimonial.rating ? "currentColor" : "none"} className={i >= testimonial.rating ? "text-slate-300" : ""} />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 relative z-10 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600">Got questions? We've got answers.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-semibold text-slate-900">{faq.question}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="text-primary-500" size={20} />
                  ) : (
                    <ChevronDown className="text-slate-400" size={20} />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-600">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
