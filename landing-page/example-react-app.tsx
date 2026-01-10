/**
 * Example: React SPA Usage (Vite/CRA)
 * 
 * Use this in your main App.tsx or index.tsx
 * 
 * Make sure Tailwind CSS is installed and configured.
 */

import React from 'react';
import LandingPage from './components/LandingPage';

function App() {
  // You can add language switching logic here
  const [lang, setLang] = React.useState<'en' | 'tr'>('en');

  return (
    <>
      {/* Optional: Language toggle (implement as needed) */}
      {/* 
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }}>
        <button onClick={() => setLang(lang === 'en' ? 'tr' : 'en')}>
          {lang === 'en' ? 'Türkçe' : 'English'}
        </button>
      </div>
      */}
      
      <LandingPage lang={lang} />
    </>
  );
}

export default App;




