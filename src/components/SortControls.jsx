const OPTIONS = [
  { value: 'Price', label: 'Цена' },
  { value: 'SteamRating', label: 'Рейтинг' },
  { value: 'Release', label: 'Дата выхода' },
  { value: 'Metacritic', label: 'Metacritic' },
];

export function SortControls({ value, desc, onChange }) {
  const handleClick = (optValue) => {
    if (value === optValue) {
      onChange(optValue, !desc);
    } else {
      const defaultDesc = optValue === 'Price' ? false : true;
      onChange(optValue, defaultDesc);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-600">Сортировка:</span>
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleClick(opt.value)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opt.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {opt.label}
          {value === opt.value && (desc ? ' ↓' : ' ↑')}
        </button>
      ))}
    </div>
  );
}