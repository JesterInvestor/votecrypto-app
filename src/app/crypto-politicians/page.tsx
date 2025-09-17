'use client';

import { useEffect, useState } from 'react';

interface Row {
  id: string;
  name: string;
  role?: string;
  state?: string;
  party?: string;
  stance?: string;
  score?: number;
  profileUrl?: string;
}

export default function CryptoPoliticiansPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [party, setParty] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchData(targetPage = page, targetPageSize = pageSize) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query) params.set('query', query);
      if (stateFilter) params.set('state', stateFilter.toUpperCase());
      if (party) params.set('party', party);
      params.set('page', String(targetPage));
      params.set('pageSize', String(targetPageSize));
      const res = await fetch(`/api/standwithcrypto?${params.toString()}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setRows(data.data);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setPage(data.page);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
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
  }, [query, stateFilter, party, pageSize]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <header className="max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Crypto-Friendly Politicians</h1>
          <p className="text-gray-600">Data scraped from Stand With Crypto (best-effort; may change). Use the filters below to search.</p>
        </header>

        <div className="bg-white border rounded-lg p-4 sm:p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Name" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
              <input value={stateFilter} onChange={e => setStateFilter(e.target.value.toUpperCase())} placeholder="e.g. CA" maxLength={2} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Party</label>
              <input value={party} onChange={e => setParty(e.target.value)} placeholder="e.g. Republican" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Page Size</label>
              <select value={pageSize} onChange={e => setPageSize(parseInt(e.target.value, 10))} className="w-full px-3 py-2 border rounded">
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
                  <th className="px-4 py-3 text-left font-semibold">Role</th>
                  <th className="px-4 py-3 text-left font-semibold">State</th>
                  <th className="px-4 py-3 text-left font-semibold">Party</th>
                  <th className="px-4 py-3 text-left font-semibold">Stance</th>
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
                    <td className="px-4 py-3">{r.role || '-'}</td>
                    <td className="px-4 py-3">{r.state || '-'}</td>
                    <td className="px-4 py-3">{r.party || '-'}</td>
                    <td className="px-4 py-3">{r.stance || '-'}</td>
                    <td className="px-4 py-3">
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

        <p className="mt-8 text-xs text-gray-400">This page scrapes public data from Stand With Crypto. If their structure changes, results may vary.</p>
      </main>
    </div>
  );
}
