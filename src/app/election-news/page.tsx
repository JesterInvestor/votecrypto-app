'use client';

import { useEffect, useState } from 'react';

type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    name: string;
  };
  author: string | null;
};

export default function ElectionNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('US election');

  async function fetchNews(query: string) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ q: query, pageSize: '20' });
      const res = await fetch(`/api/election-news?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }
      const data = await res.json();
      if (data.articles) {
        setArticles(data.articles);
      } else {
        setError(data.error || 'Failed to fetch news');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNews(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNews(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--brand-blue-50), white)' }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <header className="max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">US Election News</h1>
          <p className="text-gray-900">Stay informed with the latest election news</p>
        </header>

        <div className="bg-white border rounded-lg p-4 sm:p-6 shadow-sm mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">Search News</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for election news..."
              className="w-full px-4 py-2 border rounded text-gray-900 placeholder:text-gray-500"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center py-10">
            <div className="text-gray-600">Loading news...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="bg-white border rounded-lg p-8 text-center">
            <p className="text-gray-600">No articles found. Try a different search term.</p>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                {article.urlToImage && (
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600">{article.source.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h2>
                  {article.description && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                      {article.description}
                    </p>
                  )}
                  {article.author && (
                    <p className="text-xs text-gray-500">By {article.author}</p>
                  )}
                  <div className="mt-3 flex items-center text-blue-600 text-sm font-medium">
                    Read more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 ml-1"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-8 text-xs text-gray-400">
          <p>News articles powered by NewsAPI.org. Articles open in new tabs.</p>
        </div>
      </main>
    </div>
  );
}
