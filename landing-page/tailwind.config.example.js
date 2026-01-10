/**
 * Example Tailwind Configuration
 * 
 * Copy this to your project's tailwind.config.js
 * 
 * Make sure to adjust the content paths to match your project structure.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Synexa brand colors (optional - you can use hex values directly in classes)
        'synexa-primary': '#00FFB2',
        'synexa-secondary': '#00D690',
        'synexa-tertiary': '#00B07A',
        'synexa-dark': '#050505',
        'synexa-card': '#0B1020',
        'synexa-border': '#1F2933',
      },
      backgroundImage: {
        'gradient-synexa': 'linear-gradient(to right, #00FFB2, #00D690, #00B07A)',
      },
    },
  },
  plugins: [],
}




