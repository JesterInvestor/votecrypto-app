import { NextRequest } from 'next/server';
import { scrapeStandWithCryptoList } from '@/lib/scrapers/standWithCrypto';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get('query') || '').toLowerCase();
  const state = (searchParams.get('state') || '').toUpperCase();
  const party = (searchParams.get('party') || '').toLowerCase();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  try {
    const items = await scrapeStandWithCryptoList();
    let list = items;
    if (query) list = list.filter(i => i.name.toLowerCase().includes(query));
    if (state) list = list.filter(i => (i.state || '').toUpperCase() === state);
    if (party) list = list.filter(i => (i.party || '').toLowerCase().includes(party));

    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;
    const data = list.slice(start, start + pageSize);

    return new Response(JSON.stringify({ data, total, page: safePage, pageSize, totalPages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'Scrape failed' }), { status: 500 });
  }
}
