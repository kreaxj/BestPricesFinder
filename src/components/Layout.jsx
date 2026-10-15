import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Поиск', icon: '🔍' },
  { to: '/analytics', label: 'Аналитика', icon: '📊' },
]

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Верхняя навигация (десктоп) */}
      <header className="hidden border-b bg-white sm:block">
        <nav className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
          <span className="text-lg font-bold">Best Prices Finder</span>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-sm font-medium ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1 pb-20 sm:pb-0">
        <Outlet />
      </main>

      {/* Нижняя навигация (мобильные) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t bg-white sm:hidden">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`
            }
          >
            <span className="text-lg">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}