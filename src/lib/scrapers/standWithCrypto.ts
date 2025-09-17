import * as cheerio from 'cheerio';
type AnyElement = any;

export interface SWCPolitician {
  id: string;
  name: string;
  role?: string; // e.g., Senator, Representative
  state?: string;
  party?: string;
  stance?: string; // e.g., Supports, Opposes, Unknown
  score?: number; // if available
  profileUrl?: string;
}

// Try multiple strategies: 1) read __NEXT_DATA__ script, 2) parse visible HTML if any
export async function scrapeStandWithCryptoList(url = 'https://www.standwithcrypto.org/politicians'): Promise<SWCPolitician[]> {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; VoteCryptoBot/1.0)'
    },
    next: { revalidate: 300 }
  });
  if (!res.ok) {
    throw new Error(`SWC fetch failed: ${res.status}`);
  }
  const html = await res.text();

  // Strategy 1: __NEXT_DATA__ script (common in Next.js SSR sites)
  const nextData = extractNextData(html);
  if (nextData) {
    const items = tryMapFromNextData(nextData);
    if (items.length) return items;
  }

  // Strategy 2: Heuristic HTML parse (fragile; best-effort)
  const $ = cheerio.load(html);
  const result: SWCPolitician[] = [];
  // Look for links or cards containing politician info
  $('a, article, div').each((_: number, el: AnyElement) => {
    const text = $(el).text().trim();
    if (!text) return;
    // naive detection: presence of party/state words
    const nameMatch = text.match(/[A-Z][a-z]+\s+[A-Z][a-z]+/);
    if (!nameMatch) return;
    const name = nameMatch[0];
    // Extract state (2-letter) if present
    const stateMatch = text.match(/\b[A-Z]{2}\b/);
    const state = stateMatch ? stateMatch[0] : undefined;
    // Party hints
    let party: string | undefined;
    if (/democrat|democratic/i.test(text)) party = 'Democratic';
    else if (/republican/i.test(text)) party = 'Republican';
    else if (/independent/i.test(text)) party = 'Independent';

    const href = $(el).is('a') ? $(el).attr('href') : undefined;
    const profileUrl = href && href.startsWith('http') ? href : (href ? `https://www.standwithcrypto.org${href}` : undefined);
    const id = slugify(`${name}-${state || ''}`);
    // Avoid duplicates
    if (!result.find(r => r.id === id)) {
      result.push({ id, name, state, party, profileUrl });
    }
  });
  return result;
}

function extractNextData(html: string): any | null {
  const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

function tryMapFromNextData(nextData: any): SWCPolitician[] {
  // Heuristic: walk through JSON to find arrays with politician-like objects
  const results: SWCPolitician[] = [];
  function walk(obj: any) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      obj.forEach(walk);
      // If array of objects with expected fields
      if (obj.length && typeof obj[0] === 'object') {
        const maybe = obj
          .map((o: any) => mapAnyToSWC(o))
          .filter(Boolean) as SWCPolitician[];
        maybe.forEach(m => {
          if (!results.find(r => r.id === m.id)) results.push(m);
        });
      }
    } else {
      Object.values(obj).forEach(walk);
    }
  }
  walk(nextData);
  return results;
}

function mapAnyToSWC(o: any): SWCPolitician | null {
  if (!o || typeof o !== 'object') return null;
  const name = o.name || o.fullName || o.displayName;
  if (!name || typeof name !== 'string') return null;
  const state = (o.state || o.region || o.addressState) as string | undefined;
  const party = (o.party || o.affiliation || o.partyName) as string | undefined;
  const stance = (o.stance || o.cryptoStance || o.position) as string | undefined;
  const score = typeof o.score === 'number' ? o.score : undefined;
  const profileUrl = typeof o.slug === 'string' ? `https://www.standwithcrypto.org/politicians/${o.slug}` : undefined;
  const id = slugify(`${name}-${state || ''}`);
  return { id, name, state, party, stance, score, profileUrl };
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
