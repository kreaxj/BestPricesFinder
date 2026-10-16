import { useEffect, useState } from 'react';
import { fetchStores } from '../api/cheapshark';

let cachedStores = null;

export function useStores() {
  const [storeMap, setStoreMap] = useState(cachedStores || {});

  useEffect(() => {
    if (cachedStores) return;

    let cancelled = false;

    fetchStores()
      .then((stores) => {
        const map = {};
        stores.forEach((s) => {
          map[s.storeID] = {
            name: s.storeName,
            icon: s.images?.icon
              ? `https://www.cheapshark.com${s.images.icon}`
              : null,
          };
        });
        cachedStores = map;
        if (!cancelled) setStoreMap(map);
      })
      .catch((err) => console.error('Ошибка загрузки магазинов:', err));

    return () => {
      cancelled = true;
    };
  }, []);

  return storeMap;
}