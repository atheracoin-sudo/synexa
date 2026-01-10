/**
 * Navbar Component
 * 
 * Sticky navigation bar with logo, links, and CTA button.
 */

import React, { useState, useEffect } from 'react';
import type { Copy } from '../content/copy';

interface NavbarProps {
  copy: Copy;
  lang: 'en' | 'tr';
}

export default function Navbar({ copy, lang }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050505]/95 backdrop-blur-md border-b border-[#1F2933]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00FFB2] to-[#00B07A] flex items-center justify-center">
              <span className="text-[#050505] font-bold text-lg">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-none">{copy.navbar.logo}</span>
              <span className="text-[#64748B] text-xs leading-none">{copy.navbar.tagline}</span>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-[#CBD5F5] hover:text-[#00FFB2] transition-colors text-sm font-medium"
            >
              {copy.navbar.links.features}
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-[#CBD5F5] hover:text-[#00FFB2] transition-colors text-sm font-medium"
            >
              {copy.navbar.links.pricing}
            </button>
            <button
              onClick={() => scrollToSection('audience')}
              className="text-[#CBD5F5] hover:text-[#00FFB2] transition-colors text-sm font-medium"
            >
              {copy.navbar.links.forCreators}
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-[#CBD5F5] hover:text-[#00FFB2] transition-colors text-sm font-medium"
            >
              {copy.navbar.links.faqs}
            </button>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => scrollToSection('download')}
            className="px-4 md:px-6 py-2 bg-gradient-to-r from-[#00FFB2] to-[#00D690] text-[#050505] font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(0,255,178,0.4)] transition-all duration-300 text-sm md:text-base"
          >
            {copy.navbar.cta}
          </button>
        </div>
      </div>
    </nav>
  );
}




