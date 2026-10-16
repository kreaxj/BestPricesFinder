export function Pagination({ page, hasNext, onPrev, onNext }) {
  const canPrev = page > 1;
  const canNext = hasNext;

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
          canPrev
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'cursor-not-allowed bg-gray-100 text-gray-400 opacity-60'
        }`}
      >
         Назад
      </button>

      <span className="px-3 text-sm font-medium text-gray-600">
        Страница {page}
      </span>

      <button
        onClick={onNext}
        disabled={!canNext}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
          canNext
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'cursor-not-allowed bg-gray-100 text-gray-400 opacity-60'
        }`}
      >
        Вперёд 
      </button>
    </div>
  );
}