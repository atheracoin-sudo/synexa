/**
 * Audience Section Component
 * 
 * Three-column section for Creators, Businesses, and Students.
 */

import React from 'react';
import type { Copy } from '../content/copy';

interface AudienceSectionProps {
  copy: Copy;
  lang: 'en' | 'tr';
}

export default function AudienceSection({ copy, lang }: AudienceSectionProps) {
  const audiences = [
    {
      icon: '✨',
      ...copy.audience.creators,
    },
    {
      icon: '🏢',
      ...copy.audience.businesses,
    },
    {
      icon: '📚',
      ...copy.audience.students,
    },
  ];

  return (
    <section
      id="audience"
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#050505] to-[#0B1020]"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 md:mb-16">
          {copy.audience.title}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {audiences.map((audience, index) => (
            <div
              key={index}
              className="bg-[#0B1020] border border-[#1F2933] rounded-2xl p-8 hover:border-[#00FFB2]/50 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{audience.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-6">
                {audience.title}
              </h3>
              <ul className="space-y-3">
                {audience.bullets.map((bullet, bulletIndex) => (
                  <li
                    key={bulletIndex}
                    className="flex items-start space-x-3 text-[#CBD5F5]"
                  >
                    <span className="text-[#00FFB2] mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}




