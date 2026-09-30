import { useState } from 'react'
import { Link } from 'react-router-dom'

const FALLBACK_IMAGE = 'https://placehold.co/400x500/f5f5f5/a3a3a3?text=No+Image'

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price)
}

function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false)
  const outOfStock = product.stockQuantity === 0

  return (
    <article className="group animate-fade-in-up">
      <Link
        to={`/products/${product.id}`}
        className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-2xl bg-neutral-100">
          <div className="aspect-[4/5]">
            <img
              src={imgError ? FALLBACK_IMAGE : (product.image || FALLBACK_IMAGE)}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          </div>
          {outOfStock && (
            <span className="absolute left-3 top-3 rounded-full bg-neutral-900/80 backdrop-blur-sm px-3 py-1 text-[11px] font-medium text-white tracking-wide">
              Sold Out
            </span>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-neutral-900/0 transition-colors duration-300 group-hover:bg-neutral-900/[0.03]" />
        </div>

        {/* Details */}
        <div className="mt-4 space-y-1.5 px-0.5">
          {product.category && (
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-400">
              {product.category}
            </p>
          )}
          <h3 className="text-[15px] font-medium text-neutral-900 leading-snug transition-colors duration-200 group-hover:text-neutral-600 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-neutral-900">
              {formatPrice(product.price)}
            </p>
            {product.stockQuantity > 0 && product.stockQuantity <= 3 && (
              <span className="text-[11px] font-medium text-amber-600">
                Only {product.stockQuantity} left
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

export default ProductCard
