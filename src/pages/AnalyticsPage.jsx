import { useEffect, useState } from 'react';
import { fetchDeals, fetchStores } from '../api/cheapshark';
import { PriceDistributionChart, SavingsByStoreChart } from '../components/DealChart';

const PAGES = 8; // 8 × 60 = 480 сделок

export function AnalyticsPage() {
  const [deals, setDeals] = useState([]);
  const [storeMap, setStoreMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [stores, ...pages] = await Promise.all([
          fetchStores(),
          ...Array.from({ length: PAGES }, (_, i) =>
            fetchDeals({
              pageNumber: i,
              pageSize: 60,
              onSale: 1,
              sortBy: 'DealRating',
              desc: 1,
            }).catch(() => []),
          ),
        ]);

        if (cancelled) return;

        // Убираем дубликаты по dealID
        const seen = new Set();
        const all = pages.flat().filter((d) => {
          if (seen.has(d.dealID)) return false;
          seen.add(d.dealID);
          return true;
        });

        setDeals(all);

        const map = {};
        stores.forEach((s) => {
          map[s.storeID] = s.storeName;
        });
        setStoreMap(map);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  if (loading) return <p className="p-8 text-center">Загрузка аналитики...</p>;
  if (error) return <p className="p-8 text-center text-red-600">Ошибка: {error}</p>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Аналитика скидок</h1>
      <p className="mb-6 text-sm text-gray-500">
        По выборке из {deals.length} текущих скидок
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4">
          <h2 className="mb-1 text-base font-semibold text-gray-800">
            Распределение цен
          </h2>
          <p className="mb-3 text-xs text-gray-500">
            Сколько игр попадает в каждую ценовую категорию
          </p>
          <PriceDistributionChart deals={deals} />
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <h2 className="mb-1 text-base font-semibold text-gray-800">
            Средние скидки по магазинам
          </h2>
          <p className="mb-3 text-xs text-gray-500">
            Сортировка по средней скидке — сверху самые щедрые
          </p>
          <SavingsByStoreChart deals={deals} storeMap={storeMap} />
        </div>
      </div>
    </div>
  );
}