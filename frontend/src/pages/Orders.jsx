import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../api/apiClient'

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function StatusBadge({ status }) {
  const styles = {
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
    SHIPPED: 'bg-purple-50 text-purple-700 border-purple-200',
    DELIVERED: 'bg-green-50 text-green-700 border-green-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  }
  const defaultStyle = 'bg-neutral-100 text-neutral-700 border-neutral-200'
  const style = styles[status] || defaultStyle

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest ${style}`}>
      {status}
    </span>
  )
}

function Orders() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiClient('/orders')
        if (!res.ok) {
          throw new Error('Failed to fetch orders')
        }
        const data = await res.json()
        setOrders(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (isLoading) {
    return (
      <main className="bg-neutral-50 min-h-[calc(100vh-72px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="h-8 w-8 rounded-full border-2 border-neutral-300 border-t-neutral-900 animate-spin" />
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Loading orders</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="bg-neutral-50 min-h-[calc(100vh-72px)] flex items-center justify-center px-6 text-center">
        <div className="animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-base font-medium text-neutral-900">Failed to load orders</p>
          <p className="mt-1 text-sm text-neutral-500">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-6 text-sm font-medium text-neutral-900 underline underline-offset-2">Try again</button>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-neutral-50 min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16 lg:px-8">
        
        <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-6 animate-fade-in-up">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
              History
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              My Orders
            </h1>
          </div>
          <Link to="/shop" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
            Continue Shopping →
          </Link>
        </header>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-12 text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-50 text-neutral-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-10 w-10">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-neutral-900">No orders yet</p>
            <p className="text-neutral-500 mt-2 max-w-sm mx-auto">When you place an order, it will appear here so you can track its status.</p>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-neutral-900 px-8 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8 stagger-children">
            {orders.map((order) => (
              <div key={order.id} className="bg-white shadow-sm rounded-3xl border border-neutral-100 overflow-hidden animate-fade-in-up">
                
                {/* Order Header */}
                <div className="border-b border-neutral-100 bg-neutral-50/50 p-6 sm:px-8 sm:py-6 flex flex-wrap items-center justify-between gap-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 w-full sm:w-auto flex-1">
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1.5">Order Number</p>
                      <p className="text-sm font-semibold text-neutral-900">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1.5">Date Placed</p>
                      <p className="text-sm font-medium text-neutral-900">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1.5">Total Amount</p>
                      <p className="text-sm font-bold text-neutral-900">{formatPrice(order.totalPrice)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1.5">Status</p>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="p-6 sm:p-8">
                  <ul className="divide-y divide-neutral-100">
                    {order.items?.map((item) => (
                      <li key={item.id} className="py-5 first:pt-0 last:pb-0 flex items-start sm:items-center gap-6">
                        <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100 border border-neutral-100/50">
                          <img
                            src={item.productImageUrl || 'https://placehold.co/128x128/f5f5f5/a3a3a3?text=N/A'}
                            alt={item.productName || 'Product'}
                            className="h-full w-full object-cover"
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/128x128/f5f5f5/a3a3a3?text=N/A' }}
                          />
                        </div>
                        <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h4 className="text-base font-semibold text-neutral-900 line-clamp-1">
                              {item.productName || `Product #${item.productId}`}
                            </h4>
                            <p className="mt-1 text-sm text-neutral-500">
                              {formatPrice(item.price)} <span className="mx-1 text-neutral-300">×</span> {item.quantity}
                            </p>
                          </div>
                          <p className="text-base font-bold text-neutral-900 whitespace-nowrap">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Orders
