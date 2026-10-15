import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { SearchPage } from './pages/SearchPage'

const AnalyticsPage = lazy(() =>
  import('./pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })),
)

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<SearchPage />} />
        <Route
          path="analytics"
          element={
            <Suspense fallback={<p className="p-8 text-center">Загрузка...</p>}>
              <AnalyticsPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}