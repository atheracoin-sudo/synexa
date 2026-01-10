import { Router, Request, Response } from 'express';
import { callSearchProvider } from '../services/searchClient';
import { SearchRequestBody, SearchResponseBody } from '../types/search';

const router = Router();

/**
 * POST /search
 * 
 * Search the web with Synexa
 */
router.post('/search', async (req: Request, res: Response) => {
  try {
    const body: SearchRequestBody = req.body;

    // Validate query
    if (!body.query || typeof body.query !== 'string' || !body.query.trim()) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Query is required and must be a non-empty string',
      });
    }

    // Apply defaults
    const searchOptions: SearchRequestBody = {
      query: body.query.trim(),
      workspaceId: body.workspaceId,
      locale: body.locale || 'en-US',
      safeSearch: body.safeSearch || 'moderate',
      maxResults: body.maxResults || 10,
    };

    // Call search provider
    const results: SearchResponseBody = await callSearchProvider(searchOptions);

    res.json(results);
  } catch (error: any) {
    console.error('Search error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: error.message || 'An error occurred while searching',
    });
  }
});

export default router;





