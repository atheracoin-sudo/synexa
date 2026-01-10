/**
 * Example: Next.js App Router Usage
 * 
 * Place this in: app/page.tsx
 * 
 * Make sure Tailwind CSS is configured in your Next.js project.
 */

import LandingPage from '@/components/LandingPage';

export const metadata = {
  title: 'Synexa AI Studio - Your AI Studio for Everything You Create',
  description: 'Synexa helps you write, design and plan content with AI — across workspaces, chat, images, video scripts, web search and more.',
};

export default function Home() {
  return <LandingPage lang="en" />;
}




