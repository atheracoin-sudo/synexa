/**
 * Search Client Service
 * 
 * Handles web search functionality with demo fallback mode.
 * 
 * Environment variable: SEARCH_PROVIDER_ENABLED
 * If not set or false, uses demo mode with sample results.
 */

import { SearchRequestBody, SearchResponseBody, SearchResultItem } from '../types/search';

// Check if search provider is enabled
const isSearchProviderEnabled = (): boolean => {
  return process.env.SEARCH_PROVIDER_ENABLED === 'true';
};

/**
 * Generate demo search results based on query
 */
function generateDemoResults(query: string, maxResults: number = 10): SearchResultItem[] {
  const demoResults: SearchResultItem[] = [
    {
      id: `demo_1_${Date.now()}`,
      title: `${query} - Wikipedia`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
      snippet: `Learn about ${query} on Wikipedia. This is a comprehensive article covering various aspects of the topic.`,
      source: 'wikipedia.org',
      publishedAt: new Date().toISOString(),
    },
    {
      id: `demo_2_${Date.now()}`,
      title: `Understanding ${query}: A Complete Guide`,
      url: `https://example.com/guide/${encodeURIComponent(query)}`,
      snippet: `This guide provides detailed information about ${query}, including best practices, examples, and common use cases.`,
      source: 'example.com',
      publishedAt: new Date().toISOString(),
    },
    {
      id: `demo_3_${Date.now()}`,
      title: `${query} - Latest News and Updates`,
      url: `https://news.example.com/${encodeURIComponent(query)}`,
      snippet: `Stay updated with the latest news and developments related to ${query}. Read expert opinions and analysis.`,
      source: 'news.example.com',
      publishedAt: new Date().toISOString(),
    },
    {
      id: `demo_4_${Date.now()}`,
      title: `How to Use ${query} Effectively`,
      url: `https://tutorial.example.com/${encodeURIComponent(query)}`,
      snippet: `Step-by-step tutorial on how to use ${query} effectively. Includes practical examples and tips.`,
      source: 'tutorial.example.com',
    },
    {
      id: `demo_5_${Date.now()}`,
      title: `${query} Documentation`,
      url: `https://docs.example.com/${encodeURIComponent(query)}`,
      snippet: `Official documentation for ${query}. Find API references, guides, and examples.`,
      source: 'docs.example.com',
    },
  ];

  // Return requested number of results
  return demoResults.slice(0, maxResults);
}

/**
 * Call search provider (real or demo)
 * 
 * TODO: Integrate real web search API (e.g., SerpAPI, Tavily, Bing Search API, Google Custom Search)
 * Example integration:
 * 
 * ```ts
 * if (isSearchProviderEnabled()) {
 *   const response = await fetch('https://api.serpapi.com/search', {
 *     method: 'GET',
 *     params: {
 *       q: options.query,
 *       api_key: process.env.SERPAPI_KEY,
 *       engine: 'google',
 *       safe: options.safeSearch || 'moderate',
 *       num: options.maxResults || 10,
 *     },
 *   });
 *   const data = await response.json();
 *   // Transform SerpAPI response to SearchResultItem[]
 *   return transformSerpAPIResults(data);
 * }
 * ```
 */
export async function callSearchProvider(
  options: SearchRequestBody
): Promise<SearchResponseBody> {
  const {
    query,
    maxResults = 10,
    safeSearch = 'moderate',
    locale = 'en-US',
  } = options;

  // Validate query
  if (!query || !query.trim()) {
    throw new Error('Search query is required');
  }

  // If search provider is not enabled, use demo mode
  if (!isSearchProviderEnabled()) {
    console.log('[Search] Using demo mode - SEARCH_PROVIDER_ENABLED is not set to true');
    
    const results = generateDemoResults(query.trim(), maxResults);
    
    return {
      query: query.trim(),
      results,
      hasMore: false,
      nextCursor: null,
    };
  }

  // TODO: Implement real search provider integration
  // Example providers:
  // - SerpAPI: https://serpapi.com/
  // - Tavily: https://tavily.com/
  // - Bing Search API: https://www.microsoft.com/en-us/bing/apis/bing-web-search-api
  // - Google Custom Search API: https://developers.google.com/custom-search
  
  // For now, fallback to demo if enabled but not implemented
  console.warn('[Search] Search provider enabled but not implemented, using demo mode');
  const results = generateDemoResults(query.trim(), maxResults);
  
  return {
    query: query.trim(),
    results,
    hasMore: false,
    nextCursor: null,
  };
}





