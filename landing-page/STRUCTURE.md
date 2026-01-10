# Landing Page Structure

Complete file structure and component overview for the Synexa landing page.

## File Structure

```
landing-page/
├── src/
│   ├── content/
│   │   └── copy.ts                    # All text content (EN/TR)
│   └── components/
│       ├── index.ts                   # Component exports
│       ├── LandingPage.tsx            # Main page component
│       ├── Navbar.tsx                 # Sticky navigation
│       ├── HeroSection.tsx            # Hero with phone mockup
│       ├── FeatureGrid.tsx            # 3 feature cards
│       ├── AudienceSection.tsx        # Creators/Businesses/Students
│       ├── ScreenshotsSection.tsx     # App preview grid
│       ├── PricingSection.tsx         # Free vs Pro plans
│       ├── FAQSection.tsx             # Expandable FAQs
│       └── Footer.tsx                 # Footer with links & CTAs
├── README.md                          # Setup instructions
├── STRUCTURE.md                       # This file
├── example-nextjs-page.tsx            # Next.js usage example
├── example-react-app.tsx              # React SPA usage example
└── tailwind.config.example.js         # Tailwind config example
```

## Component Hierarchy

```
LandingPage
├── Navbar
├── HeroSection
├── FeatureGrid
├── AudienceSection
├── ScreenshotsSection
├── PricingSection
├── FAQSection
└── Footer
```

## Section IDs (for scroll navigation)

- `#hero` - Hero section
- `#features` - Features section
- `#audience` - Audience section
- `#pricing` - Pricing section
- `#faq` - FAQ section
- `#download` - Footer/download section

## Content Structure

All content is centralized in `src/content/copy.ts`:

```typescript
copy = {
  en: {
    navbar: { ... },
    hero: { ... },
    features: { ... },
    audience: { ... },
    pricing: { ... },
    faq: { ... },
    footer: { ... },
  },
  tr: {
    // Same structure, Turkish translations
  }
}
```

## Styling

- **Framework:** Tailwind CSS
- **Approach:** Utility-first classes
- **Responsive:** Mobile-first (sm:, md:, lg: breakpoints)
- **Theme:** Dark mode by default

## Key Design Patterns

1. **Colors:** Direct hex values in Tailwind classes (no CSS variables needed)
2. **Spacing:** Tailwind spacing scale (p-4, py-8, gap-8, etc.)
3. **Typography:** Tailwind typography (text-4xl, font-bold, etc.)
4. **Effects:** Tailwind utilities + custom shadow/gradient classes
5. **Animations:** CSS transitions + Tailwind hover states

## Responsive Breakpoints

- **Mobile:** Default (< 768px)
- **Tablet:** `md:` prefix (≥ 768px)
- **Desktop:** `lg:` prefix (≥ 1024px)

## Dependencies

- React 18+
- TypeScript
- Tailwind CSS 3+

## Browser Support

Modern browsers with CSS Grid and Flexbox support.

## Next Steps

1. Copy components to your Next.js/React project
2. Install Tailwind CSS if not already present
3. Configure Tailwind config (see example)
4. Update download/store links
5. Replace placeholder images with real screenshots
6. Add analytics tracking
7. Test responsive behavior
8. Deploy!




