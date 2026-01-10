/**
 * Chat-related types matching the mobile app's aiClient.ts
 */

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type ChatRequestBody = {
  messages: ChatMessage[];
  modelId: string;
  languagePreference?: 'auto' | 'tr' | 'en';
  translationMode?: 'none' | 'to-tr' | 'to-en' | 'fix-en';
};

export type ChatResponseBody = {
  text: string;
};

