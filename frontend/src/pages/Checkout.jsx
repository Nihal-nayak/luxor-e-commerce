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

  if (!isAuthenticated) return null

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <main className="bg-neutral-50 min-h-[calc(100vh-72px)] flex items-center justify-center">
        <div className="mx-auto max-w-md px-6 py-20 text-center animate-fade-in-up">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-7 w-7 text-neutral-400">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Nothing to checkout
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            Your cart is currently empty. Add items to your cart before proceeding.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-neutral-900 px-8 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-neutral-800 hover:scale-[1.01] active:scale-[0.99]"
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
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required'
    } else if (!/^\d{6}$/.test(formData.postalCode.trim())) {
      newErrors.postalCode = 'Must be exactly 6 digits'
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
      // Scroll to top to see errors if needed
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setErrors({})
    setIsSubmitting(true)
    setApiError(null)

    try {
      const response = await apiClient('/orders', {
        method: 'POST',
        body: JSON.stringify({
          shippingAddress: formData.address.trim(),
          shippingCity: formData.city.trim(),
          shippingState: formData.state.trim(),
          shippingPincode: formData.postalCode.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to process order. Please try again.')
      }

      setOrderPlaced(true)
      resetCartLocal()
      if (fetchCart) fetchCart()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setApiError(error.message)
      setOrderPlaced(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = "mt-2 block w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-3.5 px-4 text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:bg-white focus:border-neutral-400 focus:shadow-sm sm:text-sm"
  const errorInputClass = "border-red-300 bg-red-50/30 focus:border-red-500"
  const labelClass = "block text-sm font-medium text-neutral-700"

  if (orderPlaced) {
    return (
      <main className="bg-neutral-50 min-h-[calc(100vh-72px)] flex items-center justify-center">
        <div className="mx-auto max-w-md px-6 py-20 text-center animate-fade-in-up">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Order Confirmed
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-500">
            Thank you for your purchase. We've received your order and will begin processing it right away.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/orders"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-neutral-900 px-8 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-neutral-800 hover:scale-[1.01] active:scale-[0.99]"
            >
              View Order History
            </Link>
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-medium text-neutral-900 border border-neutral-200 transition-all duration-200 hover:bg-neutral-50 hover:border-neutral-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-neutral-50 min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:py-12 lg:px-8 lg:py-16">
        
        <header className="mb-8 border-b border-neutral-200 pb-6 animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
            Secure
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Checkout
          </h1>
        </header>

        <form onSubmit={handlePlaceOrder} className="mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-12 xl:gap-16">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-10 animate-fade-in-up">
            
            {apiError && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-6 flex items-start gap-4 animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-red-600 shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-900">Payment failed</h3>
                  <p className="mt-1 text-sm text-red-700">{apiError}</p>
                </div>
              </div>
            )}

            <section>
              <h2 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white">1</span>
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-5">
                <div className="sm:col-span-2">
                  <label htmlFor="address" className={labelClass}>Street Address</label>
                  <input type="text" id="address" value={formData.address} onChange={handleChange} className={`${inputClass} ${errors.address ? errorInputClass : ''}`} placeholder="123 Main St, Apt 4B" />
                  {errors.address && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.address}</p>}
                </div>
                <div>
                  <label htmlFor="city" className={labelClass}>City</label>
                  <input type="text" id="city" value={formData.city} onChange={handleChange} className={`${inputClass} ${errors.city ? errorInputClass : ''}`} placeholder="New York" />
                  {errors.city && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.city}</p>}
                </div>
                <div>
                  <label htmlFor="state" className={labelClass}>State / Province</label>
                  <input type="text" id="state" value={formData.state} onChange={handleChange} className={`${inputClass} ${errors.state ? errorInputClass : ''}`} placeholder="NY" />
                  {errors.state && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.state}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="postalCode" className={labelClass}>Postal Code (6 digits)</label>
                  <input type="text" id="postalCode" value={formData.postalCode} onChange={handleChange} maxLength={6} className={`${inputClass} ${errors.postalCode ? errorInputClass : ''}`} placeholder="100001" />
                  {errors.postalCode && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.postalCode}</p>}
                </div>
              </div>
            </section>

            <section className="pt-10 border-t border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 text-[11px] font-bold text-neutral-600">2</span>
                Payment
              </h2>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-100/50 p-6">
                <p className="text-sm text-neutral-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-neutral-400">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Payment processing is handled securely on the next step.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="mt-12 lg:col-span-5 lg:mt-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="sticky top-28 rounded-2xl border border-neutral-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="bg-neutral-900 px-6 py-5">
                <h2 className="text-base font-medium text-white">Order Summary</h2>
              </div>
              
              <div className="p-6 sm:p-8">
                <ul role="list" className="divide-y divide-neutral-100">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex py-4 first:pt-0">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        <img 
                          src={item.image || 'https://placehold.co/128x128/f5f5f5/a3a3a3?text=N/A'} 
                          alt={item.name} 
                          className="h-full w-full object-cover" 
                          onError={(e) => { e.currentTarget.src = 'https://placehold.co/128x128/f5f5f5/a3a3a3?text=N/A' }}
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col justify-center">
                        <div className="flex justify-between text-sm font-medium text-neutral-900">
                          <h3 className="line-clamp-1 pr-4">{item.name}</h3>
                          <p className="whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                        <p className="mt-1 text-sm text-neutral-500">Qty {item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <dl className="mt-6 space-y-4 border-t border-neutral-100 pt-6">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-neutral-500">Subtotal</dt>
                    <dd className="text-sm font-medium text-neutral-900">{formatPrice(cartTotal)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-neutral-500">Shipping</dt>
                    <dd className="text-sm font-medium text-green-600">Free</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                    <dt className="text-lg font-bold text-neutral-900">Total</dt>
                    <dd className="text-lg font-bold text-neutral-900">{formatPrice(cartTotal)}</dd>
                  </div>
                </dl>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-neutral-900 px-6 py-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Pay ' + formatPrice(cartTotal)
                    )}
                  </button>
                  <p className="mt-4 text-center text-xs text-neutral-400 flex items-center justify-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Secure encrypted checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}

export default Checkout
