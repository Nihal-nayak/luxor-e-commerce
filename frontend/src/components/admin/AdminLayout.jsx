import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true, icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
  )},
  { to: '/admin/products', label: 'Products', end: false, icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  )},
  { to: '/admin/orders', label: 'Orders', end: false, icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  )},
  { to: '/admin/users', label: 'Users', end: false, icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  )},
  { to: '/admin/categories', label: 'Categories', end: false, icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
  )},
]

const linkClass = ({ isActive }) =>
  [
    'flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold transition-all duration-200',
    isActive
      ? 'bg-neutral-900 text-white shadow-md shadow-neutral-900/10'
      : 'text-neutral-500 hover:bg-white hover:text-neutral-900 hover:shadow-sm border border-transparent hover:border-neutral-100',
  ].join(' ')

function AdminLayout() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-neutral-50/50">
      <div className="mx-auto max-w-[1400px] px-6 py-10">
        
        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            Workspace
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900">
            Admin Console
          </h1>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0 lg:sticky lg:top-28">
            <nav
              className="flex flex-row gap-2 overflow-x-auto pb-4 lg:flex-col lg:overflow-visible lg:pb-0 scrollbar-hide"
              aria-label="Admin navigation"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={linkClass}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <div className="min-w-0 flex-1">
            <div className="flex min-h-[600px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <Outlet />
            </div>
          </div>
          
        </div>
      </div>
    </main>
  )
}

export default AdminLayout
