import Image from 'next/image';

const services = [
  {
    title: 'Advanced Diagnostics',
    description: 'State-of-the-art imaging and lab facilities for accurate, fast results.',
    image: 'https://images.unsplash.com/photo-1516069677018-378515003435?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Specialized Surgeries',
    description: 'Modern operating theatres equipped for a wide range of procedures.',
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Radiology & Imaging',
    description: 'X-ray, ultrasound, and advanced imaging with expert radiologists.',
    image: 'https://images.unsplash.com/photo-1583911860205-72f8ac8ddcbe?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function FeaturedServices() {
  return (
    <section className="relative py-20 lg:py-28 bg-white/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-sm font-semibold text-[#2E5FA3] uppercase tracking-wider mb-3">
            Our expertise
          </span>
          <h2 className="text-4xl font-extrabold font-heading text-[#0F2347]">
            Featured Services
          </h2>
          <p className="mt-4 text-slate-600">
            Comprehensive medical services delivered with precision and care.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(46,95,163,0.08)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(46,95,163,0.15)]"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A6E]/30 to-transparent" />
              </div>
              <div className="p-7">
                <h3 className="text-xl font-bold font-heading text-[#1E3A6E] mb-2">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}