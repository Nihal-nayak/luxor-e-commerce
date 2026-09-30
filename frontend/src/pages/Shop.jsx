import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/product/ProductGrid'

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()

  const initialCategoryId = searchParams.get('categoryId')
    ? Number(searchParams.get('categoryId'))
    : null

  const [activeCategoryId, setActiveCategoryId] = useState(initialCategoryId)
  const [sortBy, setSortBy] = useState('featured')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categoryMap = categories.reduce((acc, c) => {
    acc[c.id] = c.name
    return acc
  }, {})

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [productsRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:8080/products?size=100'),
        fetch('http://localhost:8080/category'),
      ])

      if (!productsRes.ok) throw new Error(`Failed to load products (${productsRes.status})`)
      if (!categoriesRes.ok) throw new Error(`Failed to load categories (${categoriesRes.status})`)

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()

      const categoryList = Array.isArray(categoriesData) ? categoriesData : []
      setCategories(categoryList)

      const catMap = categoryList.reduce((acc, c) => { acc[c.id] = c.name; return acc }, {})

      const items = productsData.content ?? productsData
      const normalised = items.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        description: p.desc,
        image: p.imageUrl || '',
        categoryId: p.categoryId,
        category: catMap[p.categoryId] ?? '',
        stockQuantity: p.stockQuantity,
      }))

      setProducts(normalised)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (activeCategoryId != null) {
      setSearchParams({ categoryId: String(activeCategoryId) }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }, [activeCategoryId, setSearchParams])

  const filteredProducts =
    activeCategoryId == null
      ? products
      : products.filter((p) => p.categoryId === activeCategoryId)

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    return a.id - b.id
  })

  return (
    <main className="bg-neutral-50 min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8 lg:py-20">
        {/* Page Header */}
        <header className="max-w-2xl animate-fade-in-up">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
            Collection
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Shop All Products
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-500 sm:text-lg">
            Curated essentials and statement pieces, designed for modern living.
          </p>
        </header>

        {/* Filters & Sort */}
        <div className="mt-10 flex flex-col gap-6 border-b border-neutral-200 pb-8 lg:flex-row lg:items-center lg:justify-between animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            <button
              type="button"
              onClick={() => setActiveCategoryId(null)}
              aria-pressed={activeCategoryId == null}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                activeCategoryId == null
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white text-neutral-600 ring-1 ring-neutral-200 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const isActive = activeCategoryId === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryId(cat.id)}
                  aria-pressed={isActive}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-sm'
                      : 'bg-white text-neutral-600 ring-1 ring-neutral-200 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="sort-products" className="text-sm font-medium text-neutral-500">
              Sort by
            </label>
            <select
              id="sort-products"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 transition-colors duration-200 hover:border-neutral-300 focus:border-neutral-400 focus:ring-0"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Product Count & Error */}
        <div className="mt-8 flex items-center justify-between">
          {error ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={loadData}
                className="text-sm font-medium text-neutral-900 underline underline-offset-2 hover:no-underline"
              >
                Retry
              </button>
            </div>
          ) : !loading ? (
            <p className="text-sm text-neutral-400">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
            </p>
          ) : null}
        </div>

        {/* Product Grid */}
        <div className="mt-6">
          {!error && <ProductGrid products={sortedProducts} loading={loading} />}
        </div>
      </div>
    </main>
  )
}

export default Shop
