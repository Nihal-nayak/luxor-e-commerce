import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const FALLBACK_IMAGE = 'https://placehold.co/600x600/f5f5f5/a3a3a3?text=No+Image'

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price)
}

function ProductDetailsSkeleton() {
  return (
    <main className="bg-neutral-50 min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:py-12 lg:px-8 lg:py-16">
        <div className="h-5 w-28 rounded animate-shimmer mb-8" />
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div className="aspect-square rounded-2xl animate-shimmer" />
          <div className="space-y-4 pt-4">
            <div className="h-3 w-20 rounded animate-shimmer" />
            <div className="h-8 w-3/4 rounded animate-shimmer" />
            <div className="h-7 w-24 rounded animate-shimmer" />
            <div className="h-4 w-full rounded animate-shimmer mt-6" />
            <div className="h-4 w-5/6 rounded animate-shimmer" />
            <div className="h-4 w-2/3 rounded animate-shimmer" />
          </div>
        </div>
      </div>
    </main>
  )
}

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imgError, setImgError] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const [cartFeedback, setCartFeedback] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const [productRes, categoriesRes] = await Promise.all([
          fetch(`http://localhost:8080/products/${id}`),
          fetch('http://localhost:8080/category'),
        ])

        if (!productRes.ok) {
          if (productRes.status === 404) {
            setProduct(null)
            return
          }
          throw new Error(`Failed to load product (${productRes.status})`)
        }

        const p = await productRes.json()

        let categoryName = ''
        if (categoriesRes.ok) {
          const cats = await categoriesRes.json()
          const catMap = Array.isArray(cats)
            ? cats.reduce((acc, c) => { acc[c.id] = c.name; return acc }, {})
            : {}
          categoryName = catMap[p.categoryId] ?? ''
        }

        setProduct({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          description: p.desc,
          image: p.imageUrl || '',
          categoryId: p.categoryId,
          category: categoryName,
          stockQuantity: p.stockQuantity,
        })
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1))
  }

  const increaseQuantity = () => {
    if (!product) return
    setQuantity((current) => Math.min(product.stockQuantity, current + 1))
  }

  const handleAddToCart = async () => {
    setCartFeedback(null)
    const result = await addToCart(product, quantity)
    if (result?.success) {
      setCartFeedback({ type: 'success', message: 'Added to cart' })
      setQuantity(1)
    } else {
      setCartFeedback({ type: 'error', message: result?.error || 'Failed to add to cart.' })
    }
    setTimeout(() => setCartFeedback(null), 3000)
  }

  if (loading) return <ProductDetailsSkeleton />

  if (error) {
    return (
      <main className="bg-neutral-50 min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-6 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-red-500">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <p className="text-base font-medium text-neutral-900 mb-2">Something went wrong</p>
        <p className="text-sm text-neutral-500 mb-6">{error}</p>
        <Link to="/shop" className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-neutral-800">
          Back to Shop
        </Link>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="bg-neutral-50 min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-6 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-neutral-400">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Product not found</h1>
        <p className="mt-2 text-sm text-neutral-500">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop" className="mt-8 inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-neutral-800">
          Back to Shop
        </Link>
      </main>
    )
  }

  const outOfStock = product.stockQuantity === 0

  return (
    <main className="bg-neutral-50 min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:py-12 lg:px-8 lg:py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 animate-fade-in" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-neutral-400">
            <li>
              <Link to="/shop" className="hover:text-neutral-900 transition-colors">Shop</Link>
            </li>
            <li aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </li>
            {product.category && (
              <>
                <li>
                  <Link
                    to={`/shop?categoryId=${product.categoryId}`}
                    className="hover:text-neutral-900 transition-colors"
                  >
                    {product.category}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </li>
              </>
            )}
            <li className="text-neutral-600 font-medium truncate max-w-[200px]">{product.name}</li>
          </ol>
        </nav>

        <article className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start animate-fade-in-up">
          {/* Image */}
          <figure className="relative overflow-hidden rounded-2xl bg-neutral-100">
            <div className="aspect-square">
              <img
                src={imgError ? FALLBACK_IMAGE : (product.image || FALLBACK_IMAGE)}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            </div>
            {outOfStock && (
              <span className="absolute left-4 top-4 rounded-full bg-neutral-900/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white">
                Out of Stock
              </span>
            )}
          </figure>

          {/* Details */}
          <div className="flex flex-col lg:py-4">
            {product.category && (
              <Link
                to={`/shop?categoryId=${product.categoryId}`}
                className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400 hover:text-neutral-600 transition-colors w-fit"
              >
                {product.category}
              </Link>
            )}
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-semibold text-neutral-900">
              {formatPrice(product.price)}
            </p>

            {/* Availability */}
            <div className="mt-4 flex items-center gap-2">
              <span className={`inline-flex h-2 w-2 rounded-full ${outOfStock ? 'bg-red-400' : 'bg-green-400'}`} />
              <span className="text-sm text-neutral-500">
                {outOfStock ? 'Out of stock' : `In stock${product.stockQuantity <= 5 ? ` — only ${product.stockQuantity} left` : ''}`}
              </span>
            </div>

            <p className="mt-8 max-w-lg text-base leading-relaxed text-neutral-600">
              {product.description}
            </p>

            {/* Actions */}
            <div className="mt-10 space-y-6 border-t border-neutral-200 pt-8">
              <div>
                <label htmlFor="product-quantity" className="block text-sm font-medium text-neutral-900">
                  Quantity
                </label>
                <div className="mt-3 inline-flex items-center rounded-full border border-neutral-200 bg-white">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={outOfStock}
                    aria-label="Decrease quantity"
                    className="flex h-11 w-11 items-center justify-center rounded-l-full text-neutral-500 transition-colors duration-200 hover:bg-neutral-50 hover:text-neutral-900 disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M5 12h14" /></svg>
                  </button>
                  <span id="product-quantity" className="min-w-12 text-center text-sm font-semibold text-neutral-900 tabular-nums">
                    {outOfStock ? 0 : quantity}
                  </span>
                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={outOfStock || quantity >= product.stockQuantity}
                    aria-label="Increase quantity"
                    className="flex h-11 w-11 items-center justify-center rounded-r-full text-neutral-500 transition-colors duration-200 hover:bg-neutral-50 hover:text-neutral-900 disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M12 5v14M5 12h14" /></svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-neutral-900 px-10 py-4 text-sm font-medium text-white transition-all duration-200 hover:bg-neutral-800 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
                {cartFeedback && (
                  <span className={`text-sm font-medium animate-fade-in ${
                    cartFeedback.type === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {cartFeedback.type === 'success' && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline h-4 w-4 mr-1 -mt-0.5"><path d="M20 6L9 17l-5-5" /></svg>
                    )}
                    {cartFeedback.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}

export default ProductDetails
