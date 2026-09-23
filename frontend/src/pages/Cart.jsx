import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

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
      <main className="bg-neutral-50 min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Your cart is empty
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
            It looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-neutral-800"
          >
            Explore the Collection
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-neutral-50 min-h-[calc(100vh-64px)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Shopping Cart
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            Clear Cart
          </button>
        </div>

        <div className="mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-8">
            <ul
              role="list"
              className="divide-y divide-neutral-200 border-b border-neutral-200"
            >
              {cartItems.map((item) => (
                <li key={item.id} className="flex py-6 sm:py-8">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-32 sm:w-32">
                    <img
                      src={item.image || 'https://placehold.co/128x128/f5f5f5/a3a3a3?text=No+Image'}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/128x128/f5f5f5/a3a3a3?text=No+Image'
                      }}
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="flex justify-between">
                      <div className="pr-2">
                        <h3 className="text-base font-medium text-neutral-900">
                          <Link
                            to={`/products/${item.id}`}
                            className="hover:underline"
                          >
                            {item.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-neutral-500">
                          {item.category}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="text-base font-medium text-neutral-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-l-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                        >
                          &minus;
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-r-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm font-medium text-neutral-500 hover:text-neutral-900"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-4 lg:mt-0">
            <h2 className="text-lg font-medium text-neutral-900">
              Order Summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-neutral-600">Subtotal</dt>
                <dd className="text-sm font-medium text-neutral-900">
                  {formatPrice(cartTotal)}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
                <dt className="text-sm text-neutral-600">Shipping</dt>
                <dd className="text-sm font-medium text-neutral-900">
                  Calculated at checkout
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
                <dt className="text-base font-medium text-neutral-900">
                  Total
                </dt>
                <dd className="text-base font-medium text-neutral-900">
                  {formatPrice(cartTotal)}
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <Link
                to="/checkout"
                className="flex w-full items-center justify-center rounded-full bg-neutral-900 px-6 py-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800"
              >
                Checkout
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/shop"
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                or Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Cart
