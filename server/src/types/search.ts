export interface SearchRequestBody {
  query: string;
  workspaceId?: string;
  locale?: string; // e.g. "tr-TR" or "en-US"
  safeSearch?: 'strict' | 'moderate' | 'off';
  maxResults?: number;
}

export interface SearchResultItem {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: string; // domain, e.g. "wikipedia.org"
  publishedAt?: string; // ISO string if news-like
}

export interface SearchResponseBody {
  query: string;
  results: SearchResultItem[];
  hasMore?: boolean;
  nextCursor?: string | null;
}





