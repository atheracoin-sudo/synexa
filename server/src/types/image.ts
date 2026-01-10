/**
 * Image generation types matching the mobile app's aiClient.ts
 */

export type ImageRequestBody = {
  prompt: string;
  style: 'realistic' | 'anime' | '3d' | 'illustration';
  size?: 'square' | 'portrait' | 'landscape';
  modelId: string;
};

export type ImageResponseBody = {
  id: string;
  url: string;
  isDemo?: boolean; // Indicates if this is a demo fallback
};

