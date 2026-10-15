import { useState, useCallback, useEffect } from 'react'
import { SearchBar } from '../components/SearchBar'
import { SortControls } from '../components/SortControls'
import { GameCard } from '../components/GameCard'
import { fetchDeals } from '../api/cheapshark'

export function SearchPage() {
  const [deals, setDeals] = useState([])
  const [sortBy, setSortBy] = useState('DealRating')
  const [desc, setDesc] = useState(true)
  const [loading, setLoading] = useState(true)
  const [isSearchResult, setIsSearchResult] = useState(false)

  // Загружаем популярные скидки при первом рендере
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetchDeals({
      sortBy: 'DealRating',
      desc: true,
      pageSize: 24,
      onSale: true,
      lowerPrice: 0,
      upperPrice: 50,
    })
      .then((data) => {
        if (!cancelled) {
          setDeals(data)
          setIsSearchResult(false)
        }
      })
      .catch((err) => console.error('Ошибка загрузки популярных скидок:', err))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true; };
  }, [])

  const sorted = [...deals].sort((a, b) => {
    let cmp = 0
    switch (sortBy) {
      case 'Price':
        cmp = parseFloat(a.salePrice) - parseFloat(b.salePrice)
        break
      case 'DealRating':
        cmp = parseFloat(b.savings) - parseFloat(a.savings)
        break
      case 'Release':
        cmp = a.releaseDate - b.releaseDate
        break
      case 'Metacritic':
        cmp =
          (parseInt(b.metacriticScore) || 0) -
          (parseInt(a.metacriticScore) || 0)
        break
      default:
        break
    }
    return desc ? -cmp : cmp
  })

  const handleResults = useCallback((newDeals) => {
    setDeals(newDeals);
    setIsSearchResult(true);
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <SearchBar onResults={handleResults} />

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          {isSearchResult
            ? `Найдено: ${deals.length} предложений`
            : `🔥 Популярные скидки (${deals.length})`}
        </p>
        <SortControls
          value={sortBy}
          desc={desc}
          onChange={(s, d) => {
            setSortBy(s);
            setDesc(d);
          }}
        />
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : sorted.length === 0 ? (
        <p className="mt-16 text-center text-gray-400">
          {isSearchResult
            ? 'Ничего не найдено. Попробуйте другой запрос.'
            : 'Не удалось загрузить скидки. Проверьте соединение.'}
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sorted.map((deal) => (
            <GameCard key={deal.dealID} deal={deal} />
          ))}
        </div>
      )}
    </div>
  )
}