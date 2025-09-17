// Server-side helper for Thirdweb Engine / Transactions Cloud (Wallet Cloud)
// Provides minimal wrappers to manage backend wallets (aka server wallets).

type EngineConfig = {
  baseUrl: string;
  accessToken: string;
};

function getEngineConfig(): EngineConfig {
  const baseUrl = process.env.THIRDWEB_ENGINE_URL;
  const accessToken = process.env.THIRDWEB_ENGINE_ACCESS_TOKEN;
  if (!baseUrl || !accessToken) {
    throw new Error(
      'Missing THIRDWEB_ENGINE_URL or THIRDWEB_ENGINE_ACCESS_TOKEN. Set them in your environment to use Wallet Cloud.'
    );
  }
  return { baseUrl: baseUrl.replace(/\/$/, ''), accessToken };
}

async function engineFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { baseUrl, accessToken } = getEngineConfig();

  // Prefer Engine v3 Transactions endpoints; fall back to v2 if needed.
  // We accept a path that already includes /v2 or /v3; otherwise default to /v2.
  const fullPath = path.startsWith('/v') ? path : `/v2${path}`;
  const url = `${baseUrl}${fullPath}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(init && init.headers ? (init.headers as Record<string, string>) : {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Engine request failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

// Types based on common Engine wallet responses; kept minimal for this app.
export type ServerWallet = {
  id: string;
  address: string;
  createdAt?: string;
  externalId?: string | null;
  label?: string | null;
};

export type ListServerWalletsResponse = {
  result: ServerWallet[];
  count?: number;
  cursor?: string | null;
};

export type CreateServerWalletRequest = {
  // Optional fields supported by Engine wallet creation
  externalId?: string;
  label?: string;
  // keyType / kms parameters could be added if using KMS; default local
};

export type CreateServerWalletResponse = {
  result: ServerWallet;
};

export async function listServerWallets(params?: { cursor?: string; limit?: number }) {
  const search = new URLSearchParams();
  if (params?.cursor) search.set('cursor', params.cursor);
  if (typeof params?.limit === 'number') search.set('limit', String(params.limit));
  const qs = search.toString();
  const path = `/wallets/server${qs ? `?${qs}` : ''}`;
  return engineFetch<ListServerWalletsResponse>(path, { method: 'GET' });
}

export async function createServerWallet(body: CreateServerWalletRequest) {
  return engineFetch<CreateServerWalletResponse>('/wallets/server', {
    method: 'POST',
    body: JSON.stringify(body ?? {}),
  });
}

export async function getOrCreateServerWalletByExternalId(externalId: string, label?: string) {
  // try list filter (some Engine versions support filters via query or a dedicated endpoint)
  try {
    const list = await engineFetch<ListServerWalletsResponse>(`/wallets/server?externalId=${encodeURIComponent(externalId)}`, {
      method: 'GET',
    });
    const found = list.result?.find((w) => w.externalId === externalId);
    if (found) return { result: found } as CreateServerWalletResponse;
  } catch {
    // ignore and fallback to creation
  }
  return createServerWallet({ externalId, label });
}

export function isEngineConfigured(): boolean {
  return Boolean(process.env.THIRDWEB_ENGINE_URL && process.env.THIRDWEB_ENGINE_ACCESS_TOKEN);
}
