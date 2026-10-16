import { useState, useEffect } from 'react'
import { fetchDeals } from '../api/cheapshark'
import { useDebounce } from '../hooks/useDebounce'

export function SearchBar({ onResults }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 450)

  useEffect(() => {
  if (debouncedQuery.length < 2) {
    onResults(null, '');
    return;
  }

  let cancelled = false;
  setLoading(true);

  fetchDeals({ title: debouncedQuery, pageSize: 60, onSale: 1 })
    .then((deals) => {
      if (!cancelled) onResults(deals, debouncedQuery);
    })
    .catch((err) => console.error('Ошибка поиска:', err))
    .finally(() => {
      if (!cancelled) setLoading(false);
    });

  return () => { cancelled = true; };
}, [debouncedQuery, onResults]);

  return (
    <div className="relative w-full max-w-xl">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск игр..."
        className="w-full rounded-xl border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {loading && (
        <div className="absolute right-3 top-3 h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      )}
    </div>
  )
}