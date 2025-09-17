'use client';

import { useEffect, useState } from 'react';

interface Row {
  id: string;
  name: string;
  role?: string; // displayed as Seat
  state?: string;
  party?: string;
  stance?: string; // displayed as Position (mapped)
  score?: number;
  profileUrl?: string;
}

export default function CryptoPoliticiansPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [zip, setZip] = useState('');
  const [party, setParty] = useState('');
  const [role, setRole] = useState('');
  const [stance, setStance] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Static option lists for dropdowns
  const US_STATES: { code: string; name: string }[] = [
    { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' }, { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' }, { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' }, { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' }, { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }, { code: 'DC', name: 'District of Columbia' }
  ];
  const PARTY_OPTIONS = [
    { value: '', label: 'All parties' },
    { value: 'democrat', label: 'Democrat' },
    { value: 'republican', label: 'Republican' },
    { value: 'independent', label: 'Independent' },
    { value: 'libertarian', label: 'Libertarian' },
    { value: 'green', label: 'Green' },
    { value: 'other', label: 'Other' },
  ];
  const ROLE_OPTIONS = [
    { value: '', label: 'All seats' },
    { value: 'senator', label: 'Senator' },
    { value: 'representative', label: 'Representative' },
    { value: 'governor', label: 'Governor' },
    { value: 'president', label: 'President' },
    { value: 'candidate', label: 'Candidate' },
    { value: 'state senator', label: 'State Senator' },
    { value: 'state representative', label: 'State Representative' },
    { value: 'mayor', label: 'Mayor' },
    { value: 'other', label: 'Other' },
  ];
  const STANCE_OPTIONS = [
    { value: '', label: 'All positions' },
    { value: 'strongly supportive', label: 'Really like' },
    { value: 'somewhat supportive', label: 'Kinda like' },
    { value: 'neutral', label: "Don't care" },
    { value: 'somewhat against', label: 'Kinda dislike' },
    { value: 'strongly against', label: 'Really dislike' },
  ];

  async function fetchData(targetPage = page, targetPageSize = pageSize) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query) params.set('query', query);
  if (stateFilter) params.set('state', stateFilter);
  if (zip) params.set('zip', zip);
  if (party) params.set('party', party);
  if (role) params.set('role', role);
  if (stance) params.set('stance', stance);
      params.set('page', String(targetPage));
      params.set('pageSize', String(targetPageSize));
  const res = await fetch(`/api/crypto-politicians?${params.toString()}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setRows(data.data);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setPage(data.page);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData(1, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchData(1, pageSize), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, stateFilter, zip, party, role, stance, pageSize]);

  function prettyPosition(s?: string) {
    if (!s) return '-';
    const v = s.toLowerCase();
    if (v === 'strongly supportive') return 'Really like';
    if (v === 'somewhat supportive') return 'Kinda like';
    if (v === 'neutral') return "Don't care";
    if (v === 'somewhat against') return 'Kinda dislike';
    if (v === 'strongly against') return 'Really dislike';
    return s;
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--brand-blue-50), white)' }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <header className="max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">See Your Politician</h1>
          <p className="text-gray-900">How much do they like crypto</p>
        </header>

        <div className="bg-white border rounded-lg p-4 sm:p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">Search</label>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Name" className="w-full px-3 py-2 border rounded text-gray-900 placeholder:text-gray-700" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">State</label>
              <select
                value={stateFilter}
                onChange={e => setStateFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded text-gray-900"
              >
                <option value="">All states</option>
                {US_STATES.map(s => (
                  <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">ZIP Code</label>
              <input value={zip} onChange={e => setZip(e.target.value)} placeholder="e.g. 97201" maxLength={10} className="w-full px-3 py-2 border rounded text-gray-900 placeholder:text-gray-700" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">Seat</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2 border rounded text-gray-900"
              >
                {ROLE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">Crypto position</label>
              <select
                value={stance}
                onChange={e => setStance(e.target.value)}
                className="w-full px-3 py-2 border rounded text-gray-900"
              >
                {STANCE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">Party</label>
              <select
                value={party}
                onChange={e => setParty(e.target.value)}
                className="w-full px-3 py-2 border rounded text-gray-900"
              >
                {PARTY_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">Page Size</label>
              <select value={pageSize} onChange={e => setPageSize(parseInt(e.target.value, 10))} className="w-full px-3 py-2 border rounded text-gray-900">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Seat</th>
                  <th className="px-4 py-3 text-left font-semibold">State</th>
                  <th className="px-4 py-3 text-left font-semibold">Party</th>
                  <th className="px-4 py-3 text-left font-semibold">Crypto position</th>
                  <th className="px-4 py-3 text-left font-semibold">Profile</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500">Loading…</td></tr>
                )}
                {!loading && rows.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500">No results</td></tr>
                )}
                {!loading && rows.map(r => (
                  <tr key={r.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                    <td className="px-4 py-3 text-gray-900">{r.role || '-'}</td>
                    <td className="px-4 py-3 text-gray-900">{r.state || '-'}</td>
                    <td className="px-4 py-3 text-gray-900">{r.party || '-'}</td>
                    <td className="px-4 py-3 text-gray-900">{prettyPosition(r.stance)}</td>
                    <td className="px-4 py-3 text-gray-900">
                      {r.profileUrl ? <a className="text-blue-600 hover:underline" href={r.profileUrl} target="_blank">View</a> : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {error && <div className="px-4 py-2 text-sm text-red-600 border-t bg-red-50">{error}</div>}
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50 text-xs sm:text-sm">
            <div>Page {page} of {totalPages} • {total} total</div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded disabled:opacity-40" disabled={page <= 1 || loading} onClick={() => fetchData(page - 1)}>Prev</button>
              <button className="px-3 py-1 border rounded disabled:opacity-40" disabled={page >= totalPages || loading} onClick={() => fetchData(page + 1)}>Next</button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs text-gray-400">Data shown from a curated CSV file included with the app. Filters support name, state (code or full), ZIP→state, seat, crypto position, and party.</p>
      </main>
    </div>
  );
}
