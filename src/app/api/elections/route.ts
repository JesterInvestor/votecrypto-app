import { NextRequest } from 'next/server';

// GET /api/elections -> Proxies Google Civic Information API "elections" endpoint
// Uses server-side API key from env. Never expose the key to the client.
export async function GET(_req: NextRequest) {
  const key = process.env.GOOGLE_CIVIC_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_CIVIC_API_KEY;
  if (!key) {
    return new Response(
      JSON.stringify({ error: 'Missing GOOGLE_CIVIC_API_KEY. Set it in your environment.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
    );
  }

  const url = `https://www.googleapis.com/civicinfo/v2/elections?key=${encodeURIComponent(key)}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      const text = await res.text();
      return new Response(
        JSON.stringify({ error: 'Upstream error from Google Civic API', status: res.status, body: text }),
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
