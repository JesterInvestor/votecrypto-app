// Deprecated: StandWithCrypto scraper removed. This file remains as a stub to avoid import errors.
export interface SWCPolitician {
  id: string;
  name: string;
  role?: string;
  state?: string;
  party?: string;
  stance?: string;
  score?: number;
  profileUrl?: string;
}

export async function scrapeStandWithCryptoList(): Promise<SWCPolitician[]> {
  return [];
}
