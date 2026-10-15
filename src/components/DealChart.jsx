import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { useMemo } from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
)

export function PriceDistributionChart({ deals }) {
  const data = useMemo(() => {
    const buckets = { '0–5': 0, '5–10': 0, '10–20': 0, '20–40': 0, '40+': 0 }
    deals.forEach((d) => {
      const p = parseFloat(d.salePrice)
      if (p < 5) buckets['0–5']++
      else if (p < 10) buckets['5–10']++
      else if (p < 20) buckets['10–20']++
      else if (p < 40) buckets['20–40']++
      else buckets['40+']++
    })

    return {
      labels: Object.keys(buckets),
      datasets: [{
        label: 'Количество игр',
        data: Object.values(buckets),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(139, 92, 246, 0.7)',
        ],
      }],
    }
  }, [deals])

    const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
        callbacks: {
            label: (ctx) => ` ${ctx.parsed.y} игр(ы)`,
        },
        },
    },
    scales: {
        x: {
        title: { display: true, text: 'Цена со скидкой, $' },
        },
        y: {
        title: { display: true, text: 'Количество игр' },
        beginAtZero: true,
        },
    },
    }

  return (
    <div className="h-72 w-full">
      <Bar data={data} options={options} />
    </div>
  )
}

export function SavingsByStoreChart({ deals, storeMap = {} }) {
  const data = useMemo(() => {
    const byStore = {}
    deals.forEach((d) => {
      if (!byStore[d.storeID]) byStore[d.storeID] = []
      byStore[d.storeID].push(parseFloat(d.savings))
    })

    // Сортируем магазины по средней скидке (по убыванию)
    const entries = Object.entries(byStore)
      .map(([id, values]) => ({
        id,
        name: storeMap[id] || `Магазин ${id}`,
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        count: values.length,
      }))
      .sort((a, b) => b.avg - a.avg)

    return {
      labels: entries.map((e) => `${e.name} (${e.count})`),
      datasets: [
        {
          label: 'Средняя скидка, %',
          data: entries.map((e) => e.avg.toFixed(1)),
          backgroundColor: [
            'rgba(59, 130, 246, 0.75)',
            'rgba(16, 185, 129, 0.75)',
            'rgba(245, 158, 11, 0.75)',
            'rgba(239, 68, 68, 0.75)',
            'rgba(139, 92, 246, 0.75)',
            'rgba(236, 72, 153, 0.75)',
            'rgba(20, 184, 166, 0.75)',
            'rgba(251, 146, 60, 0.75)',
            'rgba(99, 102, 241, 0.75)',
            'rgba(34, 197, 94, 0.75)',
          ],
        },
      ],
    }
  }, [deals, storeMap])

  return (
    <div className="h-80 w-full">
      <Doughnut
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const label = ctx.label || ''
                  const value = ctx.parsed;
                  return ` ${label}: средняя скидка ${value}%`
                },
              },
            },
            title: {
              display: true,
              text: 'Средняя скидка по магазинам (кол-во сделок)',
            },
          },
        }}
      />
    </div>
  )
}