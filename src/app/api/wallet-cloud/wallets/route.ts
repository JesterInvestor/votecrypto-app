import { NextRequest } from "next/server";
import {
  createServerWallet,
  getOrCreateServerWalletByExternalId,
  isEngineConfigured,
  listServerWallets,
} from "@/lib/engine";

export const dynamic = "force-dynamic"; // do not cache

export async function GET(req: NextRequest) {
  if (!isEngineConfigured()) {
    return new Response(
      JSON.stringify({ error: "Wallet Cloud (Engine) not configured: set THIRDWEB_ENGINE_URL and THIRDWEB_ENGINE_ACCESS_TOKEN" }),
      { status: 500, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } }
    );
  }
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") || undefined;
  const limit = searchParams.get("limit");
  const limitNum = limit ? Number(limit) : undefined;
  try {
    const resp = await listServerWallets({ cursor, limit: limitNum });
    return new Response(JSON.stringify(resp), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
}

export async function POST(req: NextRequest) {
  if (!isEngineConfigured()) {
    return new Response(
      JSON.stringify({ error: "Wallet Cloud (Engine) not configured: set THIRDWEB_ENGINE_URL and THIRDWEB_ENGINE_ACCESS_TOKEN" }),
      { status: 500, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } }
    );
  }
  try {
    const body = (await req.json().catch(() => ({}))) as { externalId?: string; label?: string };
    const { externalId, label } = body;
    const resp = externalId
      ? await getOrCreateServerWalletByExternalId(externalId, label)
      : await createServerWallet({ label });
    return new Response(JSON.stringify(resp), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
}
