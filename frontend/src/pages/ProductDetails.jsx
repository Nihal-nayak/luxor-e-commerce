import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price)
}

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const [cartFeedback, setCartFeedback] = useState(null) // null | { type: 'success'|'error', message: string }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const res = await fetch(`http://localhost:8080/products/${id}`)
        if (!res.ok) {
          if (res.status === 404) {
            setProduct(null)
            return
          }
          throw new Error(`Failed to load product (${res.status})`)
        }
        
        const p = await res.json()
        setProduct({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          description: p.desc,
          image: p.imageUrl || '',
          categoryId: p.categoryId,
          category: p.categoryId ? `Category ${p.categoryId}` : 'Uncategorized',
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
      setCartFeedback({ type: 'success', message: 'Added to cart!' })
      // Reset quantity to 1 after successful add
      setQuantity(1)
    } else {
      setCartFeedback({ type: 'error', message: result?.error || 'Failed to add to cart.' })
    }
    setTimeout(() => setCartFeedback(null), 3000)
  }

  if (loading) {
    return (
      <main className="bg-neutral-50 min-h-screen flex items-center justify-center">
        <p className="text-neutral-500">Loading product...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="bg-neutral-50 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-neutral-800"
        >
          Back to Shop
        </Link>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md text-center">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Product not found
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
              The product you are looking for does not exist or may have been
              removed.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-neutral-800"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const outOfStock = product.stockQuantity === 0

  return (
    <main className="bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <Link
          to="/shop"
          className="inline-flex items-center text-sm font-medium text-neutral-600 transition-colors duration-200 hover:text-neutral-900"
        >
          ← Back to Shop
        </Link>

        <article className="mt-8 grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16 lg:items-start">
          <figure className="relative overflow-hidden rounded-2xl bg-neutral-100 shadow-sm lg:h-[550px]">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-full object-cover lg:aspect-auto lg:h-[550px] lg:w-full"
            />
            {outOfStock && (
              <span className="absolute left-4 top-4 rounded-full bg-neutral-900/80 px-4 py-1.5 text-sm font-medium text-white">
                Out of Stock
              </span>
            )}
          </figure>

          <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
              {product.category}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-medium text-neutral-900">
              {formatPrice(product.price)}
            </p>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-600">
              {product.description}
            </p>

            <div className="mt-10 space-y-6 border-t border-neutral-200 pt-8">
              <div>
                <label
                  htmlFor="product-quantity"
                  className="block text-sm font-medium text-neutral-900"
                >
                  Quantity
                </label>
                <div className="mt-3 inline-flex items-center rounded-full border border-neutral-200 bg-white">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={outOfStock}
                    aria-label="Decrease quantity"
                    className="flex h-10 w-10 items-center justify-center text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    −
                  </button>
                  <span
                    id="product-quantity"
                    className="min-w-10 text-center text-sm font-medium text-neutral-900"
                  >
                    {outOfStock ? 0 : quantity}
                  </span>
                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={outOfStock || quantity >= product.stockQuantity}
                    aria-label="Increase quantity"
                    className="flex h-10 w-10 items-center justify-center text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    +
                  </button>
                </div>
                {!outOfStock && product.stockQuantity > 0 && product.stockQuantity <= 5 && (
                  <p className="mt-2 text-sm text-amber-600">Only {product.stockQuantity} left in stock!</p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className="w-full rounded-full bg-neutral-900 px-8 py-3.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                >
                  {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
                {cartFeedback && (
                  <span className={`text-sm font-medium ${
                    cartFeedback.type === 'success' ? 'text-neutral-600' : 'text-red-600'
                  }`}>
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
