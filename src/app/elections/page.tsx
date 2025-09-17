export const dynamic = 'force-dynamic';

type Election = {
  id: string;
  name: string;
  electionDay: string; // ISO date
  ocdDivisionId?: string;
};

async function getElections(): Promise<Election[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/elections`, {
      // In Next.js server components, relative fetch goes to same host.
      // But during build or Vercel preview, an absolute base may help; fallback to relative.
      cache: 'no-store',
    }).catch(() => fetch('/api/elections', { cache: 'no-store' }));
    if (!res?.ok) return [];
    const json = await res.json();
    const list: Election[] = Array.isArray(json?.elections) ? json.elections : [];
    return list;
  } catch {
    return [];
  }
}

export default async function ElectionsPage() {
  const elections = await getElections();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--brand-blue)' }}>Upcoming elections</h1>
      {elections.length === 0 ? (
        <p className="text-gray-600">No upcoming elections found.</p>
      ) : (
        <ul className="space-y-4">
          {elections.map((e) => (
            <li key={e.id} className="p-4 rounded border bg-white shadow-sm">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-medium">{e.name}</div>
                  {e.ocdDivisionId && (
                    <div className="text-xs text-gray-500">{e.ocdDivisionId}</div>
                  )}
                </div>
                <div className="text-sm text-gray-700">
                  {new Date(e.electionDay).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
