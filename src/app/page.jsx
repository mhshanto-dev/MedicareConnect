import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import TestimonialsFAQSection from '@/components/home/TestimonialsFAQSection';
import EmergencyNewsletterSection from '@/components/home/EmergencyNewsletterSection';

export const metadata = {
  title: 'MediCare Connect - Premium Healthcare Platform',
  description: 'Book appointments with top healthcare professionals effortlessly.',
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ServicesSection />
      <TestimonialsFAQSection />
      <EmergencyNewsletterSection />
    </div>
  );
}
