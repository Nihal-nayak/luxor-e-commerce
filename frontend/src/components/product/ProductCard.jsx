import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(product.price)

  const outOfStock = product.stockQuantity === 0

  return (
    <article className="group">
      <Link
        to={`/products/${product.id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      >
        <div className="relative overflow-hidden rounded-2xl bg-neutral-100">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-[4/5] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {outOfStock && (
            <span className="absolute left-3 top-3 rounded-full bg-neutral-900/80 px-3 py-1 text-xs font-medium text-white">
              Out of Stock
            </span>
          )}
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
            {product.category}
          </p>
          <h3 className="text-base font-medium text-neutral-900 transition-colors duration-200 group-hover:text-neutral-600">
            {product.name}
          </h3>
          <p className="text-sm text-neutral-600">{formattedPrice}</p>
        </div>
      </Link>
    </article>
  )
}

export default ProductCard

