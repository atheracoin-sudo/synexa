/**
 * Feature Grid Component
 * 
 * Three-column grid displaying main features.
 */

import React from 'react';
import type { Copy } from '../content/copy';

interface FeatureGridProps {
  copy: Copy;
  lang: 'en' | 'tr';
}

export default function FeatureGrid({ copy, lang }: FeatureGridProps) {
  const features = [
    {
      icon: '💬',
      ...copy.features.chat,
    },
    {
      icon: '🎨',
      ...copy.features.create,
    },
    {
      icon: '📁',
      ...copy.features.workspaces,
    },
  ];

  return (
    <section
      id="features"
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#050505]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#0B1020] border border-[#1F2933] rounded-2xl p-8 hover:border-[#00FFB2]/50 hover:shadow-[0_0_30px_rgba(0,255,178,0.1)] transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-[#CBD5F5] leading-relaxed">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}




