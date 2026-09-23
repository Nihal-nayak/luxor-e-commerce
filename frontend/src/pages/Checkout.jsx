import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { apiClient } from '../api/apiClient'

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price)
}

function Checkout() {
  const { cartItems, cartTotal, resetCartLocal, fetchCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    postalCode: '',
  })

  const [errors, setErrors] = useState({})
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState(null)

  if (!isAuthenticated) {
    return null // Return null while redirecting
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <main className="bg-neutral-50 min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Checkout
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
            Your cart is currently empty.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-neutral-800"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.address) newErrors.address = 'Address is required'
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.state) newErrors.state = 'State is required'
    if (!formData.postalCode) {
      newErrors.postalCode = 'Postal code is required'
    } else if (!/^\d{6}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Postal code must be 6 digits'
    }
    return newErrors
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setOrderPlaced(false)
      setApiError(null)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    setApiError(null)

    try {
      const response = await apiClient('/orders', {
        method: 'POST',
        body: JSON.stringify({
          shippingAddress: formData.address,
          shippingCity: formData.city,
          shippingState: formData.state,
          shippingPincode: formData.postalCode,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order. Please try again.')
      }

      setOrderPlaced(true)
      // Immediately clear cart in UI for instant feedback (backend already deleted cart items)
      resetCartLocal()
      // Then re-sync from backend to confirm the cleared state
      if (fetchCart) fetchCart()
    } catch (error) {
      setApiError(error.message)
      setOrderPlaced(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = "mt-2 block w-full rounded-lg border border-neutral-200 bg-white py-3 px-4 text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 sm:text-sm transition-colors"
  const errorInputClass = "border-red-500 focus:border-red-500 focus:ring-red-500"
  const labelClass = "block text-sm font-medium text-neutral-900"

  return (
    <main className="bg-neutral-50 min-h-[calc(100vh-64px)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Checkout
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Checkout Forms */}
          <div className="lg:col-span-7 space-y-12">
            <section>
              <h2 className="text-lg font-medium text-neutral-900">Shipping Address</h2>
              <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <label htmlFor="address" className={labelClass}>Address</label>
                  <input type="text" id="address" value={formData.address} onChange={handleChange} className={`${inputClass} ${errors.address ? errorInputClass : ''}`} />
                  {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
                </div>
                <div>
                  <label htmlFor="city" className={labelClass}>City</label>
                  <input type="text" id="city" value={formData.city} onChange={handleChange} className={`${inputClass} ${errors.city ? errorInputClass : ''}`} />
                  {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city}</p>}
                </div>
                <div>
                  <label htmlFor="state" className={labelClass}>State</label>
                  <input type="text" id="state" value={formData.state} onChange={handleChange} className={`${inputClass} ${errors.state ? errorInputClass : ''}`} />
                  {errors.state && <p className="mt-2 text-sm text-red-600">{errors.state}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="postalCode" className={labelClass}>Postal code</label>
                  <input type="text" id="postalCode" value={formData.postalCode} onChange={handleChange} className={`${inputClass} ${errors.postalCode ? errorInputClass : ''}`} />
                  {errors.postalCode && <p className="mt-2 text-sm text-red-600">{errors.postalCode}</p>}
                </div>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="mt-16 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-5 lg:mt-0">
            <h2 className="text-lg font-medium text-neutral-900">Order Summary</h2>

            <ul role="list" className="mt-6 divide-y divide-neutral-200 border-t border-neutral-200">
              {cartItems.map((item) => (
                <li key={item.id} className="flex py-6">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-sm font-medium text-neutral-900">
                        <h3 className="line-clamp-1">{item.name}</h3>
                        <p className="ml-4 whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                      <p className="mt-1 text-sm text-neutral-500">{formatPrice(item.price)} each</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-4 border-t border-neutral-200 pt-6">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-neutral-600">Subtotal</dt>
                <dd className="text-sm font-medium text-neutral-900">{formatPrice(cartTotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-neutral-600">Shipping</dt>
                <dd className="text-sm font-medium text-neutral-900">Calculated at checkout</dd>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
                <dt className="text-base font-medium text-neutral-900">Total</dt>
                <dd className="text-base font-medium text-neutral-900">{formatPrice(cartTotal)}</dd>
              </div>
            </dl>

            {apiError && (
              <div className="mt-6 rounded-lg bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Order creation failed</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{apiError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {orderPlaced && (
              <div className="mt-6 rounded-lg bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Order placed successfully!</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Your order has been created and will be processed soon.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting || orderPlaced}
                className="w-full rounded-full bg-neutral-900 px-6 py-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link to="/shop" className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900">
                Continue Shopping
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}

export default Checkout
