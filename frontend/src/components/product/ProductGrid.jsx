import ProductCard from './ProductCard'

function ProductGridSkeleton({ count = 8 }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <div className="animate-pulse-subtle">
            <div className="aspect-[4/5] rounded-2xl animate-shimmer" />
            <div className="mt-4 space-y-2 px-0.5">
              <div className="h-3 w-16 rounded animate-shimmer" />
              <div className="h-4 w-3/4 rounded animate-shimmer" />
              <div className="h-4 w-20 rounded animate-shimmer" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

function ProductGridEmpty() {
  return (
    <div className="py-24 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-neutral-400">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      </div>
      <p className="text-base font-medium text-neutral-900">No products found</p>
      <p className="mt-2 text-sm text-neutral-500">Try adjusting your filters or check back later.</p>
    </div>
  )
}

function ProductGrid({ products, loading }) {
  if (loading) {
    return <ProductGridSkeleton />
  }

  if (!products || products.length === 0) {
    return <ProductGridEmpty />
  }

  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-children">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}

export { ProductGridSkeleton, ProductGridEmpty }
export default ProductGrid
