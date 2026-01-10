/**
 * Main Landing Page Component
 * 
 * Composes all sections into a complete landing page.
 * 
 * Usage:
 * - For Next.js: Place in `app/page.tsx` or `pages/index.tsx`
 * - For React SPA: Use as main component
 * 
 * TODO: Wire up language toggle functionality
 * TODO: Add real download/store links
 * TODO: Replace placeholder images with actual screenshots
 */

import React from 'react';
import { copy } from '../content/copy';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeatureGrid from './FeatureGrid';
import AudienceSection from './AudienceSection';
import ScreenshotsSection from './ScreenshotsSection';
import PricingSection from './PricingSection';
import FAQSection from './FAQSection';
import Footer from './Footer';

type CopyLang = keyof typeof copy;

interface LandingPageProps {
  lang?: CopyLang;
}

export default function LandingPage({ lang = 'en' }: LandingPageProps) {
  const content = copy[lang];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Navbar */}
      <Navbar copy={content} lang={lang} />

      {/* Hero Section */}
      <HeroSection copy={content} lang={lang} />

      {/* Features */}
      <FeatureGrid copy={content} lang={lang} />

      {/* Audience Section */}
      <AudienceSection copy={content} lang={lang} />

      {/* Screenshots */}
      <ScreenshotsSection copy={content} lang={lang} />

      {/* Pricing */}
      <PricingSection copy={content} lang={lang} />

      {/* FAQ */}
      <FAQSection copy={content} lang={lang} />

      {/* Footer */}
      <Footer copy={content} lang={lang} />
    </div>
  );
}




