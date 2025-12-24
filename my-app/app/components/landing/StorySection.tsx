'use client';

import { useEffect, useRef, useState } from 'react';
import { animations } from '../../design-system';

export default function StorySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-amber-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${isVisible ? animations.fadeInUp : 'opacity-0'}`}>
          {/* Image */}
          <div className={`${animations.hoverScale} order-2 lg:order-1`}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1632962237468-0705d7e7b534?w=1200&h=800&fit=crop&q=80&auto=format"
                alt="Spiritual temple rituals and ceremonies with devotees"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&h=800&fit=crop&q=80&auto=format';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent" />
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 order-1 lg:order-2 ${isVisible ? animations.fadeInRight : 'opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
              The Story of Temple Organizations
            </h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Temple organizations have been the cornerstone of spiritual communities for centuries,
                serving millions of devotees while managing complex operations spanning rituals, events,
                finances, and community services.
              </p>
              <p>
                In today's digital age, these sacred institutions face unprecedented challenges:
                coordinating multiple locations, managing thousands of devotees, tracking donations,
                organizing festivals, and maintaining transparent financial records—all while preserving
                the timeless traditions that define their purpose.
              </p>
              <p className="text-amber-700 font-semibold">
                Our platform bridges the gap between ancient wisdom and modern technology, empowering
                temple organizations to thrive in the 21st century.
              </p>
            </div>
          </div>
        </div>

        {/* Challenge & Solution Cards */}
        <div className={`mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 ${isVisible ? animations.fadeInUp : 'opacity-0'}`}>
          {/* Challenges Card */}
          <div className={`${animations.cardHover} bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif font-bold text-red-900">The Challenges</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Fragmented systems across multiple locations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Manual record-keeping prone to errors</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Difficulty tracking donations and finances</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Complex event and ritual coordination</span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className={`${animations.cardHover} bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif font-bold text-green-900">Our Solution</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Unified platform for all temple operations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Automated workflows and digital records</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Real-time financial tracking and reporting</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Seamless event and ritual management</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

