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
    month: 'long',
    day: 'numeric',
  })
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
      <main className="bg-neutral-50 min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-neutral-500">Loading orders...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="bg-neutral-50 min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    )
  }

  return (
    <main className="bg-neutral-50 min-h-[calc(100vh-64px)]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 text-center">
            <p className="text-neutral-500 mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white shadow-sm rounded-2xl border border-neutral-100 overflow-hidden">
                <div className="border-b border-neutral-100 bg-neutral-50/50 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Order Number</p>
                    <p className="text-sm font-semibold text-neutral-900">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Date Placed</p>
                    <p className="text-sm font-medium text-neutral-900">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Total Amount</p>
                    <p className="text-sm font-bold text-neutral-900">{formatPrice(order.totalPrice)}</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800 uppercase tracking-widest">
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <h4 className="text-sm font-medium text-neutral-900 mb-4">Items in this order</h4>
                  <ul className="divide-y divide-neutral-100">
                    {order.items?.map((item) => (
                      <li key={item.id} className="py-3 flex items-center gap-4">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                          <img
                            src={item.productImageUrl || 'https://placehold.co/56x56/f5f5f5/a3a3a3?text=N/A'}
                            alt={item.productName || 'Product'}
                            className="h-full w-full object-cover object-center"
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/56x56/f5f5f5/a3a3a3?text=N/A'
                            }}
                          />
                        </div>
                        <div className="flex flex-1 items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-neutral-900">
                              {item.productName || `Product #${item.productId}`}
                            </p>
                            <p className="text-sm text-neutral-500">
                              {formatPrice(item.price)} × {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-neutral-900 whitespace-nowrap">
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
