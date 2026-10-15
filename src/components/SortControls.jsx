const OPTIONS = [
  { value: 'Price', label: 'Цена' },
  { value: 'DealRating', label: 'Рейтинг скидки' },
  { value: 'Release', label: 'Дата выхода' },
  { value: 'Metacritic', label: 'Metacritic' },
]

export function SortControls({ value, desc, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-600">Сортировка:</span>
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value, value === opt.value ? !desc : true)}
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
  )
}