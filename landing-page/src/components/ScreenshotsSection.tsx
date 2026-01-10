/**
 * Screenshots Section Component
 * 
 * Grid of app screenshot previews.
 */

import React from 'react';
import type { Copy } from '../content/copy';

interface ScreenshotsSectionProps {
  copy: Copy;
  lang: 'en' | 'tr';
}

export default function ScreenshotsSection({ copy, lang }: ScreenshotsSectionProps) {
  // Placeholder screenshots - 6 mock images
  const screenshots = Array.from({ length: 6 }, (_, i) => i);

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {screenshots.map((index) => (
            <div
              key={index}
              className="relative aspect-[9/16] bg-gradient-to-br from-[#0B1020] to-[#020617] border border-[#1F2933] rounded-2xl overflow-hidden hover:border-[#00FFB2]/50 hover:scale-105 transition-all duration-300 group"
            >
              {/* Placeholder content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-3 p-6">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#00FFB2] to-[#00D690] flex items-center justify-center">
                    <span className="text-[#050505] font-bold text-2xl">S</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-[#1F2933] rounded w-24 mx-auto"></div>
                    <div className="h-2 bg-[#1F2933] rounded w-16 mx-auto"></div>
                  </div>
                </div>
              </div>
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-[#00FFB2]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}




