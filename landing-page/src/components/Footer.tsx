/**
 * Footer Component
 * 
 * Footer with links, download CTAs, and copyright.
 */

import React from 'react';
import type { Copy } from '../content/copy';

interface FooterProps {
  copy: Copy;
  lang: 'en' | 'tr';
}

export default function Footer({ copy, lang }: FooterProps) {
  return (
    <footer
      id="download"
      className="bg-[#0B1020] border-t border-[#1F2933] py-12 md:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00FFB2] to-[#00B07A] flex items-center justify-center">
                <span className="text-[#050505] font-bold text-lg">S</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-none">Synexa</span>
                <span className="text-[#64748B] text-xs leading-none">AI Studio</span>
              </div>
            </div>
            <p className="text-[#64748B] text-sm">{copy.footer.tagline}</p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Links</h4>
            <div className="space-y-2">
              <a href="#" className="block text-[#CBD5F5] hover:text-[#00FFB2] transition-colors text-sm">
                {copy.footer.links.about}
              </a>
              <a href="#" className="block text-[#CBD5F5] hover:text-[#00FFB2] transition-colors text-sm">
                {copy.footer.links.privacy}
              </a>
              <a href="#" className="block text-[#CBD5F5] hover:text-[#00FFB2] transition-colors text-sm">
                {copy.footer.links.terms}
              </a>
              <a href="#" className="block text-[#CBD5F5] hover:text-[#00FFB2] transition-colors text-sm">
                {copy.footer.links.support}
              </a>
            </div>
          </div>

          {/* Download CTAs */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Download</h4>
            <div className="space-y-3">
              <a
                href="#"
                className="block w-full px-4 py-3 bg-gradient-to-r from-[#00FFB2] to-[#00D690] text-[#050505] font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(0,255,178,0.4)] transition-all duration-300 text-center text-sm"
              >
                {copy.footer.download.googlePlay}
              </a>
              <a
                href="#"
                className="block w-full px-4 py-3 bg-transparent border-2 border-[#1F2933] text-[#CBD5F5] font-semibold rounded-lg hover:border-[#00FFB2] hover:text-[#00FFB2] transition-all duration-300 text-center text-sm"
              >
                {copy.footer.download.appStore}
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#1F2933] pt-8 text-center">
          <p className="text-[#64748B] text-sm">{copy.footer.copyright}</p>
          
          {/* TODO: Add language toggle here in the future */}
          {/* <div className="mt-4">
            <button className="text-[#CBD5F5] hover:text-[#00FFB2] transition-colors text-sm">
              {lang === 'en' ? 'Türkçe' : 'English'}
            </button>
          </div> */}
        </div>
      </div>
    </footer>
  );
}




