import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Category visual accent palette — subtle, sophisticated
const categoryAccents = [
  'from-neutral-100 to-neutral-50',
  'from-stone-100 to-stone-50',
  'from-zinc-100 to-zinc-50',
  'from-neutral-200/50 to-neutral-50',
  'from-stone-200/50 to-stone-50',
  'from-zinc-200/50 to-zinc-50',
]

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('http://localhost:8080/category')
        if (!res.ok) throw new Error(`Failed to load categories (${res.status})`)
        const data = await res.json()
        if (!cancelled) {
          setCategories(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleCategoryClick = (categoryId) => {
    navigate(`/shop?categoryId=${categoryId}`)
  }

  return (
    <main className="bg-neutral-50 min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8 lg:py-20">
        {/* Header */}
        <header className="max-w-2xl animate-fade-in-up">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
            Browse
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Categories
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-500 sm:text-lg">
            Explore our curated collections. Select a category to discover products.
          </p>
        </header>

        <div className="mt-12">
          {loading ? (
            /* Skeleton */
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-neutral-100 animate-shimmer h-28" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50/50 px-6 py-5 flex items-center justify-between">
              <p className="text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-sm font-medium text-red-800 underline underline-offset-2 hover:no-underline"
              >
                Retry
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-2xl border border-neutral-100 bg-white px-8 py-20 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-6 w-6 text-neutral-400">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <p className="text-base font-medium text-neutral-900">No categories yet</p>
              <p className="mt-1 text-sm text-neutral-500">Check back soon for new collections.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
              {categories.map((cat, idx) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`group relative flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${
                    categoryAccents[idx % categoryAccents.length]
                  } px-7 py-7 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-fade-in-up`}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-400 uppercase tracking-widest">View collection →</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110 shrink-0 ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {!loading && !error && categories.length > 0 && (
          <p className="mt-8 text-xs text-neutral-400">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'} available
          </p>
        )}
      </div>
    </main>
  )
}

export default Categories
