/**
 * Video generation types matching the mobile app's aiClient.ts
 */

export type VideoRequestBody = {
  prompt: string;
  length: '15s' | '30s';
  format: 'portrait' | 'square';
  modelId: string;
};

export type VideoResponseBody = {
  id: string;
  url: string;
  thumbnailUrl?: string;
  isDemo?: boolean; // Indicates if this is a demo fallback
  script?: string; // Generated script text (for text-based video generation)
};

