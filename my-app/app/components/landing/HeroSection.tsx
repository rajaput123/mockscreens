'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { animations } from '../../design-system';

interface Particle {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    // Generate particles only on client to avoid hydration mismatch
    const generatedParticles: Particle[] = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
    }));
    setParticles(generatedParticles);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax effect
  const parallaxOffset = scrollY * 0.5;

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1667115788180-deb06eb49dd1?w=1920&h=1080&fit=crop&q=80&auto=format&ixlib=rb-4.1.0"
          alt="Beautiful Indian Temple Architecture with intricate carvings"
          className="w-full h-[120%] object-cover"
          loading="eager"
          onError={(e) => {
            // Fallback to another temple image
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1632962237468-0705d7e7b534?w=1920&h=1080&fit=crop&q=80&auto=format';
          }}
        />
        {/* Overlay gradient - lighter to show image better */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      </div>

      {/* Particle Effect Background */}
      {isClient && (
        <div className="absolute inset-0 z-10 overflow-hidden">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-amber-400/30 rounded-full animate-pulse"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.animationDelay,
                animationDuration: particle.animationDuration,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          
          

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            <span className="block opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
              Transforming
            </span>
            <span className="block text-amber-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]">
              Temple Management
            </span>
            <span className="block opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]">
              for Modern Times
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl lg:text-3xl text-white max-w-3xl mx-auto font-light leading-relaxed opacity-0 animate-[fadeInUp_0.8s_ease-out_0.8s_forwards] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            Empowering complex temple organizations with comprehensive management solutions
            that honor tradition while embracing innovation
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/login"
              className={`${animations.buttonHover} ${animations.buttonActive} px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 hover:scale-105`}
            >
              Login
            </Link>
            
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

