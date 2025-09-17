export async function GET() {
  return new Response(
    JSON.stringify({ error: 'Deprecated endpoint. Use /api/crypto-politicians instead.' }),
    { status: 410, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
  );
}
