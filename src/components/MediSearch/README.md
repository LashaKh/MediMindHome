# MediSearch Implementation

## Overview

The MediSearch feature provides a specialized search interface for medical literature. It allows healthcare professionals to search for medical papers, case studies, guidelines, and news related to specific medical topics.

## Implementation Details

### API Integration

MediSearch uses a combination of external APIs to provide comprehensive search results:

1. **Brave Search API**: Primary search provider that returns general web results with medical context
2. **Exa API**: Secondary search provider that specializes in medical content
3. **Perplexity API**: Tertiary search provider for additional context and research

To handle CORS issues during development, the application uses Vite's proxy configuration to route API requests through the development server. The proxy configuration is defined in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api/brave': {
      target: 'https://api.search.brave.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/brave/, ''),
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    },
    '/api/exa': {
      target: 'https://api.exa.ai',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/exa/, '')
    },
    '/api/perplexity': {
      target: 'https://api.perplexity.ai',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/perplexity/, '')
    }
  }
}
```

### API Keys

API keys are stored in environment variables defined in `.env` file:

- `VITE_BRAVE_API_KEY`: For accessing Brave Search API
- `VITE_EXA_API_KEY`: For accessing Exa API
- `VITE_PERPLEXITY_API_KEY`: For accessing Perplexity API

### Architecture

The MediSearch feature follows this architecture:

1. **MediSearchPage.tsx**: Main component that manages search state and renders the UI
2. **MediSearchAPI.ts**: Contains API integration logic and handles search requests
3. **MediSearchUtils.ts**: Utility functions for processing search results
4. **Types.ts**: TypeScript interfaces for search results and API parameters

### Search Flow

1. User enters a query in the search bar
2. The application attempts to search using Brave API
3. If Brave API fails or returns no results, it falls back to Exa API
4. If Exa API fails, it falls back to Perplexity API
5. If all APIs fail, it falls back to mock data for testing/development
6. Results are processed, filtered based on user-selected filters, and displayed in the UI

### Fallback Strategy

For robustness, the application includes a fallback strategy:

- If an API request fails due to network issues, it falls back to the next API
- If all API requests fail, it uses mock data based on the search query
- This ensures the user always gets some relevant results, even in case of API failures

## Production Deployment

For production deployment, consider:

1. Implementing a backend service to handle API requests instead of using client-side proxies
2. Securing API keys using server-side environment variables
3. Implementing caching for frequent searches to reduce API calls
4. Adding rate limiting to prevent excessive API usage

## Testing

For easy testing during development:

1. Use the `/simple-test` route to test API connections directly
2. Check network requests in browser developer tools
3. Review console logs for detailed API response information 