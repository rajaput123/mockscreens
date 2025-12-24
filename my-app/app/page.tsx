'use client';

import HeroSection from './components/landing/HeroSection';
import StorySection from './components/landing/StorySection';
import FeaturesSection from './components/landing/FeaturesSection';
import StatsSection from './components/landing/StatsSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <StorySection />
      <FeaturesSection />
      <StatsSection />
      
      {/* Final CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-amber-50 via-white to-amber-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-full text-sm font-medium border border-amber-500/30">
              Trusted by 500+ Temples
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            Ready to Transform Your
            <span className="block text-amber-600 mt-2">Temple Management?</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of temple organizations already using our platform to streamline operations,
            engage devotees, and preserve traditions for future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/login"
              className="group inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-amber-600 via-amber-600 to-amber-700 text-white rounded-2xl font-bold text-lg shadow-2xl hover:from-amber-700 hover:via-amber-700 hover:to-amber-800 transition-all duration-300 hover:scale-105 hover:shadow-amber-500/50"
            >
              Get Started Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-gray-700 rounded-2xl font-semibold text-lg border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-lg"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 text-gray-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium">
              © {new Date().getFullYear()} Temple Management Platform. All rights reserved.
            </p>
            <p className="text-xs mt-2 text-gray-500">
              Empowering temple organizations with modern technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
