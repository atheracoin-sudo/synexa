/**
 * Pricing Section Component
 * 
 * Free vs Pro plan comparison.
 */

import React from 'react';
import type { Copy } from '../content/copy';

interface PricingSectionProps {
  copy: Copy;
  lang: 'en' | 'tr';
}

export default function PricingSection({ copy, lang }: PricingSectionProps) {
  const scrollToDownload = () => {
    const element = document.getElementById('download');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="pricing"
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0B1020] to-[#050505]"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 md:mb-16">
          {copy.pricing.title}
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-[#0B1020] border border-[#1F2933] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">{copy.pricing.free.title}</h3>
            <ul className="space-y-3 mb-8">
              {copy.pricing.free.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3 text-[#CBD5F5]">
                  <span className="text-[#00FFB2] mt-1">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={scrollToDownload}
              className="w-full py-3 bg-transparent border-2 border-[#1F2933] text-white font-semibold rounded-lg hover:border-[#00FFB2] hover:text-[#00FFB2] transition-all duration-300"
            >
              {copy.pricing.free.cta}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#0B1020] border-2 border-[#00FFB2] rounded-2xl p-8 relative hover:shadow-[0_0_40px_rgba(0,255,178,0.2)] transition-all duration-300">
            {copy.pricing.pro.badge && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-[#00FFB2] to-[#00D690] text-[#050505] px-4 py-1 rounded-full text-sm font-semibold">
                  {copy.pricing.pro.badge}
                </span>
              </div>
            )}
            <h3 className="text-2xl font-bold text-white mb-4">{copy.pricing.pro.title}</h3>
            <ul className="space-y-3 mb-8">
              {copy.pricing.pro.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3 text-[#CBD5F5]">
                  <span className="text-[#00FFB2] mt-1">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={scrollToDownload}
              className="w-full py-3 bg-gradient-to-r from-[#00FFB2] to-[#00D690] text-[#050505] font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,255,178,0.5)] transition-all duration-300"
            >
              {copy.pricing.pro.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}




