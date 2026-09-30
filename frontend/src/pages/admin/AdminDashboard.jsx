import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../api/apiClient'

function StatCard({ label, value, loading, icon, trend }) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50 text-neutral-600">
          {icon}
        </div>
        {trend && (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 border border-green-100">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{label}</p>
        <p className="mt-2 text-3xl font-bold tabular-nums text-neutral-900">
          {loading ? (
            <span className="inline-block h-8 w-16 animate-shimmer rounded bg-neutral-100" />
          ) : (
            value
          )}
        </p>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await apiClient('/admin/dashboard')
        if (!res.ok) {
          throw new Error(`Failed to load dashboard (${res.status})`)
        }
        const data = await res.json()
        if (!cancelled) {
          setStats(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const quickLinks = [
    { 
      to: '/admin/products', 
      title: 'Product Catalog', 
      desc: 'Add, edit, or remove products and manage inventory levels.',
      icon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/> 
    },
    { 
      to: '/admin/orders', 
      title: 'Order Fulfillment', 
      desc: 'Review customer orders, update shipping status, and process refunds.',
      icon: <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    },
    { 
      to: '/admin/users', 
      title: 'User Accounts', 
      desc: 'Manage customer accounts, roles, and administrative access.',
      icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    },
    { 
      to: '/admin/categories', 
      title: 'Categories', 
      desc: 'Organize your store hierarchy and create new collections.',
      icon: <line x1="8" y1="6" x2="21" y2="6"/>
    },
  ]

  return (
    <div className="flex flex-col h-full bg-white p-6 sm:p-8 overflow-y-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Overview
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {stats?.message ?? 'Welcome to the LUXOR admin console.'}
          </p>
        </div>
        <button className="hidden sm:inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-neutral-700 shadow-sm ring-1 ring-inset ring-neutral-200 hover:bg-neutral-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 mr-1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Report
        </button>
      </div>

      {error && (
        <div className="mb-8 rounded-xl border border-red-100 bg-red-50 p-4 flex items-start gap-3 animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-red-600 mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <h3 className="text-sm font-semibold text-red-800">Failed to load dashboard data</h3>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Products"
          value={stats?.productCount ?? 0}
          loading={loading}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>}
        />
        <StatCard
          label="Total Orders"
          value={stats?.orderCount ?? 0}
          loading={loading}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
          trend="+12% this week"
        />
        <StatCard
          label="Total Users"
          value={stats?.userCount ?? 0}
          loading={loading}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">
            Quick Actions
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group flex gap-4 rounded-xl border border-neutral-100 bg-white p-5 transition-all hover:border-neutral-300 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-50 text-neutral-400 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  {item.icon}
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 transition-colors group-hover:text-neutral-700">{item.title}</h4>
                <p className="mt-1 text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
