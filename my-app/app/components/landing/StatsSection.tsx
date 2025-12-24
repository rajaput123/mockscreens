'use client';

import { useEffect, useRef, useState } from 'react';
import { animations } from '../../design-system';

interface Stat {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

const stats: Stat[] = [
  { value: 500, label: 'Temples Managed', suffix: '+' },
  { value: 1000000, label: 'Devotees Served', suffix: '+' },
  { value: 50, label: 'Events Organized', suffix: '/month' },
  { value: 99, label: 'Uptime', suffix: '%' },
];

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState<number[]>(stats.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  const animateCounters = () => {
    stats.forEach((stat, index) => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = stat.value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(timer);
        }

        setAnimatedStats((prev) => {
          const newStats = [...prev];
          newStats[index] = Math.floor(current);
          return newStats;
        });
      }, duration / steps);
    });
  };

  const formatNumber = (num: number, stat: Stat): string => {
    if (stat.value >= 1000000) {
      // For millions, show decimal
      return (num / 1000000).toFixed(1);
    }
    if (stat.value >= 1000) {
      // For thousands, show decimal
      return (num / 1000).toFixed(1);
    }
    // For numbers less than 1000, show as integer
    return Math.floor(num).toString();
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isVisible ? animations.fadeInDown : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Trusted by Temple Organizations
          </h2>
          <p className="text-xl text-amber-100">
            Join hundreds of temples already transforming their operations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center ${isVisible ? animations.fadeInUp : 'opacity-0'}`}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="mb-2">
                <span className="text-5xl md:text-6xl font-bold text-white">
                  {stat.prefix}
                  {formatNumber(animatedStats[index], stat)}
                  {stat.value >= 1000000 ? 'M' : stat.value >= 1000 ? 'K' : ''}
                  {stat.suffix}
                </span>
              </div>
              <p className="text-lg text-amber-100 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

