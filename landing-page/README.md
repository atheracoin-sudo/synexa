# Synexa Landing Page

A modern, premium marketing landing page for **Synexa AI Studio**, built with React/TypeScript and Tailwind CSS.

## Features

- ✅ Dark theme with neon green (#00FFB2) branding
- ✅ Fully responsive (mobile-first design)
- ✅ Bilingual support (English & Turkish)
- ✅ Smooth scroll navigation
- ✅ Modern, premium UI with gradients and glows
- ✅ Component-based architecture for easy maintenance

## Structure

```
landing-page/
├── src/
│   ├── content/
│   │   └── copy.ts          # All text content (EN/TR)
│   └── components/
│       ├── Navbar.tsx
│       ├── HeroSection.tsx
│       ├── FeatureGrid.tsx
│       ├── AudienceSection.tsx
│       ├── ScreenshotsSection.tsx
│       ├── PricingSection.tsx
│       ├── FAQSection.tsx
│       ├── Footer.tsx
│       └── LandingPage.tsx  # Main component (composes all sections)
└── README.md
```

## Setup

### Option 1: Next.js App Router

1. **Copy components to your Next.js project:**

```bash
# Copy the landing-page folder contents to your Next.js app
cp -r landing-page/src/* your-nextjs-app/src/
```

2. **Update `app/page.tsx`:**

```tsx
import LandingPage from '@/components/LandingPage';

export default function Home() {
  return <LandingPage lang="en" />;
}
```

3. **Ensure Tailwind CSS is configured:**

Make sure your `tailwind.config.js` includes:

```js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Option 2: Next.js Pages Router

1. **Copy components to your Next.js project**

2. **Update `pages/index.tsx`:**

```tsx
import LandingPage from '../components/LandingPage';

export default function Home() {
  return <LandingPage lang="en" />;
}
```

### Option 3: React SPA (Vite/CRA)

1. **Install Tailwind CSS:**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. **Configure Tailwind:**

Update `tailwind.config.js`:

```js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3. **Add Tailwind to your CSS:**

In `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. **Use the component:**

```tsx
import LandingPage from './components/LandingPage';

function App() {
  return <LandingPage lang="en" />;
}
```

## Customization

### Changing Language

```tsx
<LandingPage lang="tr" /> // Turkish
<LandingPage lang="en" /> // English (default)
```

### Adding More Languages

1. Open `src/content/copy.ts`
2. Add a new language key (e.g., `de: { ... }`)
3. Export the new type if needed

### Updating Content

All text content is in `src/content/copy.ts`. Simply update the values there - no need to edit components.

### Changing Colors

The brand colors are hardcoded in components as Tailwind classes. To change:

1. Replace `#00FFB2` with your primary color
2. Replace `#00D690` with your secondary color
3. Replace `#00B07A` with your tertiary color
4. Replace `#050505` with your dark background

Or create a Tailwind theme extension:

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'synexa-primary': '#00FFB2',
      'synexa-secondary': '#00D690',
      'synexa-dark': '#050505',
    }
  }
}
```

### Adding Real Screenshots

Replace the placeholder content in `ScreenshotsSection.tsx`:

```tsx
// Instead of placeholder divs, use:
<img 
  src="/screenshots/screenshot-1.png" 
  alt="Synexa Chat" 
  className="w-full h-full object-cover"
/>
```

### Adding Store Links

Update the download buttons in `Footer.tsx`:

```tsx
<a
  href="https://play.google.com/store/apps/details?id=com.synexa.app"
  className="..."
>
  {copy.footer.download.googlePlay}
</a>
```

## Branding Colors

- **Primary Neon Green:** `#00FFB2`
- **Secondary Green:** `#00D690`
- **Tertiary Green:** `#00B07A`
- **Dark Background:** `#050505`
- **Card Background:** `#0B1020`
- **Border:** `#1F2933`
- **Text Primary:** `#FFFFFF` / `#F9FAFB`
- **Text Secondary:** `#CBD5F5`
- **Text Muted:** `#64748B`

## Sections

1. **Navbar** - Sticky navigation with logo, links, and CTA
2. **Hero** - Large headline with phone mockup
3. **Features** - 3-column feature grid
4. **Audience** - "Made for" section (Creators, Businesses, Students)
5. **Screenshots** - App preview grid
6. **Pricing** - Free vs Pro comparison
7. **FAQ** - Expandable FAQ items
8. **Footer** - Links, download CTAs, copyright

## TODOs / Future Enhancements

- [ ] Add language toggle in navbar
- [ ] Wire up real download/store links
- [ ] Replace placeholder images with actual screenshots
- [ ] Add animations/transitions library (Framer Motion)
- [ ] Add analytics tracking
- [ ] Add A/B testing capability
- [ ] Create blog/news section
- [ ] Add testimonial section

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Part of the Synexa project.




