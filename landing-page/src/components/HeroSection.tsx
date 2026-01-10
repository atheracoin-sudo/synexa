/**
 * Hero Section Component
 * 
 * Large hero section with headline, subtitle, CTAs, and phone mockup placeholder.
 */

import React from 'react';
import type { Copy } from '../content/copy';

interface HeroSectionProps {
  copy: Copy;
  lang: 'en' | 'tr';
}

export default function HeroSection({ copy, lang }: HeroSectionProps) {
  const scrollToDownload = () => {
    const element = document.getElementById('download');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0B1020] to-[#020617]"></div>
      
      {/* Animated Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FFB2]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00D690]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-center md:text-left space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {copy.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-[#CBD5F5] max-w-2xl">
              {copy.hero.subtitle}
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={scrollToDownload}
                className="px-8 py-4 bg-gradient-to-r from-[#00FFB2] to-[#00D690] text-[#050505] font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,255,178,0.5)] transition-all duration-300 text-lg"
              >
                {copy.hero.primaryCta}
              </button>
              <button
                className="px-8 py-4 bg-transparent border-2 border-[#1F2933] text-white font-semibold rounded-lg hover:border-[#00FFB2] hover:text-[#00FFB2] transition-all duration-300 text-lg"
              >
                {copy.hero.secondaryCta}
              </button>
            </div>
          </div>

          {/* Right: Phone Mockup */}
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative w-64 md:w-80 h-[500px] md:h-[640px] bg-[#0B1020] rounded-[3rem] p-3 shadow-2xl border-2 border-[#1F2933]">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-[#050505] rounded-b-2xl z-10"></div>
                
                {/* Screen Content */}
                <div className="w-full h-full bg-gradient-to-br from-[#020617] to-[#0B1020] rounded-[2.5rem] overflow-hidden relative">
                  {/* Mock App UI - Simple gradient with logo */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00FFB2] to-[#00D690] flex items-center justify-center">
                      <span className="text-[#050505] font-bold text-2xl">S</span>
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-white font-bold text-xl">Synexa</h3>
                      <p className="text-[#64748B] text-sm">AI Studio</p>
                    </div>
                    
                    {/* Mock chat bubbles */}
                    <div className="w-full space-y-3 mt-8">
                      <div className="bg-[#0B1020] rounded-2xl p-3 ml-auto w-3/4">
                        <div className="h-2 bg-[#1F2933] rounded w-full mb-2"></div>
                        <div className="h-2 bg-[#1F2933] rounded w-2/3"></div>
                      </div>
                      <div className="bg-gradient-to-r from-[#00FFB2] to-[#00D690] rounded-2xl p-3 w-3/4">
                        <div className="h-2 bg-[#050505]/30 rounded w-full mb-2"></div>
                        <div className="h-2 bg-[#050505]/30 rounded w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00FFB2]/20 to-[#00D690]/20 rounded-[3rem] blur-2xl -z-10 scale-110"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




