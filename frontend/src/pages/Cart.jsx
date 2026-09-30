import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const FALLBACK_IMAGE = 'https://placehold.co/128x128/f5f5f5/a3a3a3?text=No+Image'

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price)
}

function Cart() {
  const {
    cartItems,
    cartItemCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart()

  if (cartItems.length === 0) {
    return (
      <main className="bg-neutral-50 min-h-[calc(100vh-72px)] flex items-center justify-center">
        <div className="mx-auto max-w-md px-6 py-20 text-center animate-fade-in-up">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-7 w-7 text-neutral-400">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Your cart is empty
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            Looks like you haven't added anything yet. Discover our collection and find something you love.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-neutral-900 px-8 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-neutral-800 hover:scale-[1.01] active:scale-[0.99]"
          >
            Explore Collection
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-neutral-50 min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:py-12 lg:px-8 lg:py-16">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-6 animate-fade-in">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
              Review
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Shopping Cart
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-900"
          >
            Clear all
          </button>
        </div>

        <div className="mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <ul role="list" className="divide-y divide-neutral-100">
              {cartItems.map((item) => (
                <li key={item.id} className="flex py-8 animate-fade-in">
                  <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-32 sm:w-32">
                    <img
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE }}
                    />
                  </div>

                  <div className="ml-5 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="flex justify-between">
                      <div className="pr-4">
                        <h3 className="text-base font-medium text-neutral-900">
                          <Link to={`/products/${item.id}`} className="hover:text-neutral-600 transition-colors">
                            {item.name}
                          </Link>
                        </h3>
                        {item.category && (
                          <p className="mt-1 text-xs text-neutral-400 uppercase tracking-wide">{item.category}</p>
                        )}
                        <p className="mt-1.5 text-sm text-neutral-500">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                      <p className="text-base font-semibold text-neutral-900 whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="flex h-9 w-9 items-center justify-center rounded-l-full text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                          aria-label="Decrease quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M5 12h14" /></svg>
                        </button>
                        <span className="min-w-9 text-center text-sm font-semibold text-neutral-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-r-full text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                          aria-label="Increase quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M12 5v14M5 12h14" /></svg>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm font-medium text-neutral-400 hover:text-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Order Summary */}
          <div className="mt-12 lg:col-span-4 lg:mt-0 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-neutral-900">Order Summary</h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-neutral-500">Subtotal</dt>
                  <dd className="text-sm font-medium text-neutral-900">{formatPrice(cartTotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-neutral-500">Shipping</dt>
                  <dd className="text-sm text-neutral-500">Calculated at checkout</dd>
                </div>
                <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                  <dt className="text-base font-semibold text-neutral-900">Total</dt>
                  <dd className="text-base font-semibold text-neutral-900">{formatPrice(cartTotal)}</dd>
                </div>
              </dl>

              <div className="mt-8">
                <Link
                  to="/checkout"
                  className="flex w-full items-center justify-center rounded-full bg-neutral-900 px-6 py-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 hover:scale-[1.01] active:scale-[0.99]"
                >
                  Proceed to Checkout
                </Link>
              </div>

              <div className="mt-4 text-center">
                <Link to="/shop" className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900">
                  or continue shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Cart
