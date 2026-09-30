import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiClient } from '../../api/apiClient'

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number(price))
}

function formatDateTime(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function parseApiError(body, fallback) {
  if (!body) return fallback
  if (typeof body.error === 'string') return body.error
  const values = Object.values(body)
  if (values.length > 0 && typeof values[0] === 'string') return values[0]
  return fallback
}

const STATUS_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}

function normalizeStatus(status) {
  return String(status ?? '').trim().toUpperCase()
}

function getAllowedNextStatuses(currentStatus) {
  const normalized = normalizeStatus(currentStatus)
  return STATUS_TRANSITIONS[normalized] ?? []
}

function statusBadgeClass(status) {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-100 text-amber-800'
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800'
    case 'SHIPPED':
      return 'bg-indigo-100 text-indigo-800'
    case 'DELIVERED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-neutral-100 text-neutral-800'
  }
}

function OrderDetailPanel({
  order,
  onClose,
  onStatusUpdated,
}) {
  const [selectedStatus, setSelectedStatus] = useState('')
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const currentStatus = normalizeStatus(order.status)
  const allowedStatuses = useMemo(
    () => getAllowedNextStatuses(currentStatus),
    [currentStatus]
  )

  useEffect(() => {
    setSelectedStatus(allowedStatuses[0] ?? '')
    setUpdateError(null)
    setSuccessMessage(null)
  }, [order.id, currentStatus, allowedStatuses])

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return

    if (!allowedStatuses.includes(selectedStatus)) {
      setUpdateError(
        `Cannot change status from ${currentStatus} to ${selectedStatus}.`
      )
      return
    }

    setUpdating(true)
    setUpdateError(null)
    setSuccessMessage(null)
    try {
      const res = await apiClient(`/admin/orders/${order.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: selectedStatus }),
      })
      if (!res.ok) {
        let message = `Status update failed (${res.status})`
        try {
          const body = await res.json()
          message = parseApiError(body, message)
        } catch {
          /* ignore */
        }
        throw new Error(message)
      }
      const updated = await res.json()
      setSuccessMessage(`Order status updated to ${updated.status}.`)
      onStatusUpdated(updated)
    } catch (err) {
      setUpdateError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-neutral-100 px-6 py-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-900">Order #{order.id}</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Placed {formatDateTime(order.createdAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
        >
          Close
        </button>
      </div>

      <div className="grid gap-6 px-6 py-5 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Customer
            </h4>
            <p className="mt-1 text-sm font-medium text-neutral-900">
              {order.customerName ?? `User #${order.userId}`}
            </p>
            {order.customerEmail && (
              <p className="text-sm text-neutral-600">{order.customerEmail}</p>
            )}
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Shipping
            </h4>
            <p className="mt-1 text-sm text-neutral-900">{order.shippingAddress}</p>
            <p className="text-sm text-neutral-600">
              {[order.shippingCity, order.shippingState, order.shippingPincode]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Status
              </h4>
              <span
                className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${statusBadgeClass(currentStatus)}`}
              >
                {currentStatus}
              </span>
            </div>
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Payment
              </h4>
              <span className="mt-1 inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-neutral-800">
                {order.paymentStatus}
              </span>
            </div>
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Total
              </h4>
              <p className="mt-1 text-sm font-bold text-neutral-900">
                {formatPrice(order.totalPrice)}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-neutral-900">Update status</h4>
          {allowedStatuses.length === 0 ? (
            <p className="mt-2 text-sm text-neutral-500">
              No further status changes are allowed for this order.
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              <select
                key={`${order.id}-${currentStatus}`}
                value={
                  allowedStatuses.includes(selectedStatus)
                    ? selectedStatus
                    : (allowedStatuses[0] ?? '')
                }
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              >
                {allowedStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={
                  updating ||
                  !selectedStatus ||
                  !allowedStatuses.includes(selectedStatus)
                }
                className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                {updating ? 'Updating…' : 'Update status'}
              </button>
            </div>
          )}
          {updateError && (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {updateError}
            </p>
          )}
          {successMessage && (
            <p className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
              {successMessage}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-100 px-6 py-5">
        <h4 className="text-sm font-medium text-neutral-900">Order items</h4>
        <ul className="mt-4 divide-y divide-neutral-100">
          {order.items?.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                <img
                  src={
                    item.productImageUrl ||
                    'https://placehold.co/56x56/f5f5f5/a3a3a3?text=N/A'
                  }
                  alt={item.productName || 'Product'}
                  className="h-full w-full object-cover object-center"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://placehold.co/56x56/f5f5f5/a3a3a3?text=N/A'
                  }}
                />
              </div>
              <div className="flex flex-1 items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {item.productName || `Product #${item.productId}`}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium text-neutral-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await apiClient('/admin/orders')
      if (!res.ok) {
        throw new Error(`Failed to load orders (${res.status})`)
      }
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const openOrder = async (orderId) => {
    setDetailLoading(true)
    setDetailError(null)
    setSelectedOrder(null)
    try {
      const res = await apiClient(`/admin/orders/${orderId}`)
      if (!res.ok) {
        throw new Error(`Failed to load order (${res.status})`)
      }
      setSelectedOrder(await res.json())
    } catch (err) {
      setDetailError(err.message)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleStatusUpdated = (updatedOrder) => {
    setSelectedOrder(updatedOrder)
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? { ...o, status: updatedOrder.status } : o))
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-neutral-100 p-6 sm:p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
            Order Management
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            View all customer orders and update fulfillment status.
          </p>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-4 bg-white space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in">
            {error}
            <button
              type="button"
              onClick={loadOrders}
              className="ml-3 font-medium underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {detailError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in">
            {detailError}
          </div>
        )}

        {selectedOrder && (
          <div className="mb-6 animate-fade-in-up">
            <OrderDetailPanel
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
              onStatusUpdated={handleStatusUpdated}
            />
          </div>
        )}

        {detailLoading && (
          <div className="text-sm text-neutral-500 animate-pulse">Loading order details…</div>
        )}
      </div>

      <div className="flex-1 overflow-x-auto bg-white">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-neutral-500">
            Loading orders…
          </div>
        ) : orders.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-neutral-500">
            No orders yet.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-neutral-100 text-left text-sm whitespace-nowrap">
            <thead className="bg-neutral-50/50">
              <tr>
                <th className="px-6 sm:px-8 py-3.5 font-semibold text-neutral-900">Order</th>
                <th className="px-6 py-3.5 font-semibold text-neutral-900">Date</th>
                <th className="px-6 py-3.5 font-semibold text-neutral-900">Customer</th>
                <th className="px-6 py-3.5 font-semibold text-neutral-900">Total</th>
                <th className="px-6 py-3.5 font-semibold text-neutral-900">Status</th>
                <th className="px-6 py-3.5 font-semibold text-neutral-900">Payment</th>
                <th className="px-6 sm:px-8 py-3.5 font-semibold text-neutral-900 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className={`transition-colors ${selectedOrder?.id === order.id ? 'bg-neutral-50/80' : 'hover:bg-neutral-50/50'}`}
                >
                  <td className="px-6 sm:px-8 py-4 font-medium text-neutral-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    <div>{order.customerName ?? `User #${order.userId}`}</div>
                    {order.customerEmail && (
                      <div className="text-xs text-neutral-400 mt-0.5">
                        {order.customerEmail}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 tabular-nums text-neutral-600">
                    {formatPrice(order.totalPrice)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest ${statusBadgeClass(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-600 border border-neutral-200">
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 sm:px-8 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => openOrder(order.id)}
                      className="rounded-md px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminOrders
