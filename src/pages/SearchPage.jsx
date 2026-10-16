import { useState, useCallback, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { SortControls } from '../components/SortControls';
import { GameCard } from '../components/GameCard';
import { Pagination } from '../components/Pagination';
import { Filters } from '../components/Filters';
import { fetchDeals } from '../api/cheapshark';
import { useStores } from '../hooks/useStores';
import { useIsMobile } from '../hooks/useIsMobile';

const RATING_RANK = {
  'Overwhelmingly Positive': 8,
  'Very Positive': 7,
  'Positive': 6,
  'Mostly Positive': 5,
  'Mixed': 4,
  'Mostly Negative': 3,
  'Negative': 2,
  'Overwhelmingly Negative': 1,
};

const DEFAULT_FILTERS = {
  onSale: true,
  lowerPrice: 0,
  upperPrice: 100,
  steamRating: 0,
};

function rankSteamRating(deal) {
  const pct = parseFloat(deal.steamRatingPercent);
  if (!Number.isFinite(pct) || pct <= 0) return -1;
  return RATING_RANK[deal.steamRatingText] || 0;
}

function toServerSort(sortKey, desc) {
  const dir = desc ? 1 : 0;
  if (sortKey === 'Price') return { sortBy: 'Price', desc: dir };
  if (sortKey === 'Metacritic') return { sortBy: 'Metacritic', desc: dir };
  if (sortKey === 'Release') return { sortBy: 'Release', desc: dir };
  if (sortKey === 'SteamRating') return { sortBy: 'DealRating', desc: 1 };
  return { sortBy: 'Price', desc: 0 };
}

export function SearchPage() {
  const isMobile = useIsMobile();
  const PAGE_SIZE = isMobile ? 12 : 24;

  const [deals, setDeals] = useState([]);
  const [sortBy, setSortBy] = useState('Price');
  const [desc, setDesc] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSearchResult, setIsSearchResult] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const storeMap = useStores();

  useEffect(() => {
    if (isSearchResult) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const server = toServerSort(sortBy, desc);

    const params = {
      sortBy: server.sortBy,
      desc: server.desc,
      pageNumber: page - 1,
      pageSize: PAGE_SIZE,
    };

    if (filters.onSale) params.onSale = 1;
    if (filters.lowerPrice > 0) params.lowerPrice = filters.lowerPrice;
    if (filters.upperPrice < 100) params.upperPrice = filters.upperPrice;
    if (filters.steamRating > 0) params.steamRating = filters.steamRating;

    fetchDeals(params)
      .then((data) => {
        if (cancelled) return;
        if (data.length === 0 && page > 1) {
          setPage((p) => Math.max(1, p - 1));
          return;
        }
        setDeals(data);
        setHasNext(data.length === PAGE_SIZE);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.response?.status === 429) {
          setError(
            'Слишком много запросов к CheapShark. Подождите минуту и обновите страницу.',
          );
        } else {
          setError('Не удалось загрузить игры. Проверьте соединение.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, sortBy, desc, isSearchResult, PAGE_SIZE, filters]);

  const handleResults = useCallback((newDeals, query) => {
    if (newDeals === null) {
      setIsSearchResult(false);
      setSearchQuery('');
      setPage(1);
      return;
    }

    setSearchQuery(query || '');
    setDeals(newDeals);
    setIsSearchResult(true);
    setPage(1);
    setHasNext(false);
  }, []);

  const handleSortChange = (s, d) => {
    if (s === sortBy && d === desc) return;
    setSortBy(s);
    setDesc(d);
    setPage(1);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleFiltersReset = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const sorted = [...deals].sort((a, b) => {
    const needsClientSort = isSearchResult || sortBy === 'SteamRating';
    if (!needsClientSort) return 0;

    let aVal = null;
    let bVal = null;

    switch (sortBy) {
      case 'Price':
        aVal = parseFloat(a.salePrice);
        bVal = parseFloat(b.salePrice);
        break;
      case 'SteamRating': {
        const aR = rankSteamRating(a);
        const bR = rankSteamRating(b);
        aVal = aR > 0 ? aR : null;
        bVal = bR > 0 ? bR : null;
        break;
      }
      case 'Release':
        aVal = parseInt(a.releaseDate) || null;
        bVal = parseInt(b.releaseDate) || null;
        break;
      case 'Metacritic':
        aVal = parseInt(a.metacriticScore) || null;
        bVal = parseInt(b.metacriticScore) || null;
        break;
      default:
        return 0;
    }

    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;

    const cmp = aVal - bVal;
    return desc ? -cmp : cmp;
  });

  useEffect(() => {
    if (!isSearchResult && page > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page, isSearchResult]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex justify-center">
        <SearchBar onResults={handleResults} />
      </div>

      <Filters
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleFiltersReset}
      />

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          {isSearchResult
            ? searchQuery
              ? `Найдено по запросу «${searchQuery}»: ${deals.length}`
              : `Найдено: ${deals.length} предложений`
            : `Топ скидок - страница ${page}`}
        </p>
        <SortControls value={sortBy} desc={desc} onChange={handleSortChange} />
      </div>

      {loading && !isSearchResult ? (
        <div className="mt-16 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="mt-16 text-center">
          <p className="text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Повторить
          </button>
        </div>
      ) : sorted.length === 0 ? (
        <p className="mt-16 text-center text-gray-400">
          {isSearchResult && searchQuery
            ? `По запросу «${searchQuery}» ничего не найдено. Попробуйте другой запрос.`
            : 'Не удалось загрузить скидки.'}
        </p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sorted.map((deal) => (
              <GameCard
                key={deal.dealID}
                deal={deal}
                store={storeMap[deal.storeID]}
              />
            ))}
          </div>

          {!isSearchResult && (
            <Pagination
              page={page}
              hasNext={hasNext}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => p + 1)}
            />
          )}
        </>
      )}
    </div>
  );
}