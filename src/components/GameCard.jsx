function formatReleaseDate(ts) {
  const n = parseInt(ts);
  if (!Number.isFinite(n) || n <= 0) return null;
  return new Date(n * 1000).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function GameCard({ deal, store }) {
  const savings = Math.round(parseFloat(deal.savings));
  const salePrice = parseFloat(deal.salePrice);
  const normalPrice = parseFloat(deal.normalPrice);
  const releaseDate = formatReleaseDate(deal.releaseDate);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md">
      <img
        src={deal.thumb}
        alt={deal.title}
        loading="lazy"
        className="h-40 w-full object-hidden"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold">{deal.title}</h3>

        <div className="flex h-5 items-center gap-2 text-xs text-gray-600">
          {store?.icon && (
            <img
              src={store.icon}
              alt={store.name}
              className="h-4 w-4 object-contain"
              loading="lazy"
            />
          )}
          {store?.name ? (
            <span className="font-medium">{store.name}</span>
          ) : (
            <span className="h-3 w-20 animate-pulse rounded bg-gray-200" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-emerald-600">
            ${salePrice.toFixed(2)}
          </span>
          {savings > 0 && (
            <>
              <span className="text-sm text-gray-400 line-through">
                ${normalPrice.toFixed(2)}
              </span>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                -{savings}%
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          {deal.metacriticScore && (
            <span className="rounded bg-gray-100 px-1.5 py-0.5">
              Metacritic: {deal.metacriticScore}
            </span>
          )}
          {deal.steamRatingText && <span>{deal.steamRatingText}</span>}
        </div>

        {releaseDate && (
        <p className="text-xs text-gray-400">
          Дата выхода: {releaseDate}
        </p>
      )}

        <a
          href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Перейти в магазин
        </a>
      </div>
    </article>
  );
}