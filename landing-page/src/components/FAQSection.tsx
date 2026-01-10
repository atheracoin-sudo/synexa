/**
 * FAQ Section Component
 * 
 * Expandable FAQ items.
 */

import React, { useState } from 'react';
import type { Copy } from '../content/copy';

interface FAQSectionProps {
  copy: Copy;
  lang: 'en' | 'tr';
}

export default function FAQSection({ copy, lang }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#050505]"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 md:mb-16">
          {copy.faq.title}
        </h2>

        <div className="space-y-4">
          {copy.faq.items.map((item, index) => (
            <div
              key={index}
              className="bg-[#0B1020] border border-[#1F2933] rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#0F172A] transition-colors duration-200"
              >
                <span className="text-white font-semibold pr-4">{item.question}</span>
                <span className={`text-[#00FFB2] text-xl transition-transform duration-200 flex-shrink-0 ${
                  openIndex === index ? 'transform rotate-180' : ''
                }`}>
                  ▼
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 pt-0">
                  <p className="text-[#CBD5F5] leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}




