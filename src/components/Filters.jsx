export function Filters({ filters, onChange, onReset }) {
  const handleChange = (patch) => {
    onChange({ ...filters, ...patch });
  };

  const hasActive =
    !filters.onSale ||
    filters.lowerPrice > 0 ||
    filters.upperPrice < 1000 ||
    filters.steamRating > 0;

  return (
    <div className="mt-4 rounded-2xl border bg-white px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-700">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.onSale}
            onChange={(e) => handleChange({ onSale: e.target.checked })}
            className="h-4 w-4 accent-blue-600"
          />
          Только со скидкой
        </label>

        <div className="flex items-center gap-2">
          <span>Цена</span>
          <input
            type="number"
            min="0"
            max="1000"
            value={filters.lowerPrice}
            onChange={(e) =>
              handleChange({ lowerPrice: Number(e.target.value) || 0 })
            }
            onFocus={(e) => e.target.select()}
            className="w-20 rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            min="0"
            max="1000"
            value={filters.upperPrice}
            onChange={(e) =>
              handleChange({ upperPrice: Number(e.target.value) || 0 })
            }
            onFocus={(e) => e.target.select()}
            className="w-20 rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-400">$</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Рейтинг Steam</span>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.steamRating}
            onChange={(e) =>
              handleChange({ steamRating: Number(e.target.value) })
            }
            className="w-24 accent-blue-600"
          />
          <span className="w-8 text-right font-medium text-gray-900">
            {filters.steamRating}%
          </span>
        </div>

        {hasActive && (
          <button
            onClick={onReset}
            className="ml-auto rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
          >
            Сбросить
          </button>
        )}
      </div>
    </div>
  );
}