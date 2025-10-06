import { NextRequest } from 'next/server';

// GET /api/election-news -> Proxies NewsAPI top headlines for US elections
// Uses server-side API key from env. Never expose the key to the client.
export async function GET(req: NextRequest) {
  const key = process.env.NEWS_API_KEY;
  if (!key) {
    return new Response(
      JSON.stringify({ error: 'Missing NEWS_API_KEY. Set it in your environment.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
    );
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';
  const pageSize = searchParams.get('pageSize') || '20';
  
  // Use top-headlines for US election news
  let url: string;
  if (query) {
    // If there's a search query, use everything endpoint
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${encodeURIComponent(key)}`;
  } else {
    // Default to US top headlines
    url = `https://newsapi.org/v2/top-headlines?country=us&category=general&pageSize=${pageSize}&apiKey=${encodeURIComponent(key)}`;
  }
  
  try {
    // Set a longer timeout for the fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const res = await fetch(url, { 
      cache: 'no-store',
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      const text = await res.text();
      return new Response(
        JSON.stringify({ error: 'Upstream error from NewsAPI', status: res.status, body: text }),
        { status: 502, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
      );
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
}
