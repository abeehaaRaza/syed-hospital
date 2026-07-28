import Hero from '@/components/public/Hero';
import Departments from '@/components/public/Departments';
import FeaturedServices from '@/components/public/FeaturedServices';
import ContactSection from '@/components/public/ContactSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Departments />
      <FeaturedServices />
      <ContactSection />
    </>
  );
}