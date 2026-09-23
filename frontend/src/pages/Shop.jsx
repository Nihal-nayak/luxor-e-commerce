import { useState, useEffect } from 'react'
import ProductGrid from '../components/product/ProductGrid'

const CATEGORIES = ['All']

function Shop() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        // GET /products is now public — no auth header needed
        const res = await fetch('http://localhost:8080/products?size=100')
        if (!res.ok) throw new Error(`Failed to load products (${res.status})`)
        const data = await res.json()

        // Backend returns a Page<ProductDto>: { content: [...], totalElements, ... }
        const items = data.content ?? data

        // Normalise to the shape the rest of the UI expects
        const normalised = items.map((p) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          description: p.desc,
          image: p.imageUrl || '',
          // categoryId comes from the backend; we'll resolve names after we have all items
          categoryId: p.categoryId,
          category: p.categoryId ? `Category ${p.categoryId}` : 'Uncategorized',
          stockQuantity: p.stockQuantity,
        }))

        // Derive unique category labels (we use the categoryId-based label for now;
        // when a Category endpoint is wired up this can be updated to real names)
        const uniqueCategories = [
          'All',
          ...new Set(normalised.map((p) => p.category)),
        ]

        setProducts(normalised)
        setCategories(uniqueCategories)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory)

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    return a.id - b.id
  })

  return (
    <main className="bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <header className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-neutral-500">
            Collection
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Shop All Products
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
            Curated essentials and statement pieces, designed for modern living.
          </p>
        </header>

        <div className="mt-10 flex flex-col gap-6 border-b border-neutral-200 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by category"
          >
            {categories.map((category) => {
              const isActive = activeCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={isActive}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor="sort-products"
              className="text-sm font-medium text-neutral-600"
            >
              Sort by
            </label>
            <select
              id="sort-products"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 transition-colors duration-200 focus:border-neutral-400 focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          {loading ? (
            <p className="text-sm text-neutral-500">Loading products…</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <p className="text-sm text-neutral-500">
              {sortedProducts.length}{' '}
              {sortedProducts.length === 1 ? 'product' : 'products'}
            </p>
          )}
        </div>

        <div className="mt-6">
          {!loading && !error && <ProductGrid products={sortedProducts} />}
        </div>
      </div>
    </main>
  )
}

export default Shop
