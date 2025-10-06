# Election News Feature

## Overview
This feature adds a US Election News search functionality to the VoteCrypto app, powered by NewsAPI.org.

## Implementation Details

### Components Added
1. **API Route**: `/src/app/api/election-news/route.ts`
   - Proxies requests to NewsAPI.org
   - Keeps the API key secure on the server-side
   - Supports both search queries and default US headlines

2. **Page**: `/src/app/election-news/page.tsx`
   - Client-side React component for displaying news articles
   - Search functionality with debounced queries
   - Grid layout displaying article cards with images
   - External links that open in new tabs

3. **Navigation**: Updated `/src/components/Navbar.tsx`
   - Added "Election News" link to the main navigation

### Configuration
1. Add your NewsAPI key to `.env.local`:
   ```
   NEWS_API_KEY=your_api_key_here
   ```

2. The example API key from the requirements has been added to `.env.example`

### NewsAPI Endpoints Used
- **Everything Endpoint**: For search queries
  - `https://newsapi.org/v2/everything?q={query}&language=en&sortBy=publishedAt`
- **Top Headlines**: For default US news
  - `https://newsapi.org/v2/top-headlines?country=us&category=general`

### Features
- ✅ Search functionality for election-related news
- ✅ Article cards with images, titles, descriptions, and metadata
- ✅ Links open in new tabs/pages (target="_blank" with rel="noopener noreferrer")
- ✅ Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)
- ✅ Error handling and loading states
- ✅ Server-side API key protection

### Usage
1. Navigate to `/election-news` or click "Election News" in the navigation
2. Use the search box to search for specific election topics
3. Click any article card to read the full article (opens in new tab)

### Notes
- The API requires internet access to newsapi.org
- In restricted network environments, the API may not be accessible
- The feature is fully functional in production environments with proper network access
