import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiClient } from '../../api/apiClient'

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number(price))
}

const emptyForm = {
  name: '',
  desc: '',
  price: '',
  stockQuantity: '',
  imageUrl: '',
  categoryId: '',
}

function parseApiError(body, fallback) {
  if (!body) return fallback
  if (typeof body.error === 'string') return body.error
  const values = Object.values(body)
  if (values.length > 0 && typeof values[0] === 'string') return values[0]
  return fallback
}

function ProductFormModal({ open, title, initial, categories, onClose, onSubmit, submitting, submitError }) {
  const [form, setForm] = useState(emptyForm)
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (!open) return
    if (initial) {
      setForm({
        name: initial.name ?? '',
        desc: initial.desc ?? '',
        price: initial.price != null ? String(initial.price) : '',
        stockQuantity:
          initial.stockQuantity != null ? String(initial.stockQuantity) : '',
        imageUrl: initial.imageUrl ?? '',
        categoryId:
          initial.categoryId != null ? String(initial.categoryId) : '',
      })
    } else {
      setForm(emptyForm)
    }
    setFieldErrors({})
  }, [open, initial])

  if (!open) return null

  const validate = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Name is required'
    if (!form.desc.trim()) errors.desc = 'Description is required'
    const price = Number(form.price)
    if (form.price === '' || Number.isNaN(price) || price <= 0) {
      errors.price = 'Price must be greater than 0'
    }
    const stock = Number(form.stockQuantity)
    if (
      form.stockQuantity === '' ||
      Number.isNaN(stock) ||
      stock < 0 ||
      !Number.isInteger(stock)
    ) {
      errors.stockQuantity = 'Stock must be a whole number ≥ 0'
    }
    if (!form.categoryId) errors.categoryId = 'Category is required'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      name: form.name.trim(),
      desc: form.desc.trim(),
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      imageUrl: form.imageUrl.trim() || null,
      categoryId: Number(form.categoryId),
    })
  }

  const inputClass = (field) =>
    [
      'mt-1 block w-full rounded-lg border px-3 py-2 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-1',
      fieldErrors[field]
        ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
        : 'border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400',
    ].join(' ')

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-form-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-100 bg-white shadow-xl">
        <div className="border-b border-neutral-100 px-6 py-4">
          <h2 id="product-form-title" className="text-lg font-bold text-neutral-900">
            {title}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {submitError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <div>
            <label htmlFor="product-name" className="text-sm font-medium text-neutral-700">
              Name
            </label>
            <input
              id="product-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass('name')}
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="product-desc" className="text-sm font-medium text-neutral-700">
              Description
            </label>
            <textarea
              id="product-desc"
              rows={3}
              value={form.desc}
              onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
              className={inputClass('desc')}
            />
            {fieldErrors.desc && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.desc}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-price" className="text-sm font-medium text-neutral-700">
                Price
              </label>
              <input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className={inputClass('price')}
              />
              {fieldErrors.price && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.price}</p>
              )}
            </div>
            <div>
              <label htmlFor="product-stock" className="text-sm font-medium text-neutral-700">
                Stock
              </label>
              <input
                id="product-stock"
                type="number"
                min="0"
                step="1"
                value={form.stockQuantity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, stockQuantity: e.target.value }))
                }
                className={inputClass('stockQuantity')}
              />
              {fieldErrors.stockQuantity && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.stockQuantity}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="product-category" className="text-sm font-medium text-neutral-700">
              Category
            </label>
            <select
              id="product-category"
              value={form.categoryId}
              onChange={(e) =>
                setForm((f) => ({ ...f, categoryId: e.target.value }))
              }
              className={inputClass('categoryId')}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {fieldErrors.categoryId && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.categoryId}</p>
            )}
            {categories.length === 0 && (
              <p className="mt-1 text-xs text-amber-700">
                No categories found. Add categories in a later phase or via the API before
                creating products.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="product-image" className="text-sm font-medium text-neutral-700">
              Image URL (optional)
            </label>
            <input
              id="product-image"
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              className={inputClass('imageUrl')}
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || categories.length === 0}
              className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteConfirmModal({ open, productName, onCancel, onConfirm, deleting, error }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="alertdialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-neutral-900">Delete product?</h2>
        <p className="mt-2 text-sm text-neutral-600">
          This will permanently remove{' '}
          <span className="font-medium text-neutral-900">{productName}</span>. This action
          cannot be undone.
        </p>
        {error && (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const categoryById = useMemo(() => {
    const map = new Map()
    categories.forEach((c) => map.set(c.id, c.name))
    return map
  }, [categories])

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [productsRes, categoriesRes] = await Promise.all([
        apiClient('/products?size=500&sort=id,asc'),
        apiClient('/category'),
      ])

      if (!productsRes.ok) {
        throw new Error(`Failed to load products (${productsRes.status})`)
      }
      if (!categoriesRes.ok) {
        throw new Error(`Failed to load categories (${categoriesRes.status})`)
      }

      const productsPage = await productsRes.json()
      const categoryList = await categoriesRes.json()
      setProducts(productsPage.content ?? [])
      setCategories(Array.isArray(categoryList) ? categoryList : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (!successMessage) return
    const t = setTimeout(() => setSuccessMessage(null), 4000)
    return () => clearTimeout(t)
  }, [successMessage])

  const openAdd = () => {
    setEditingProduct(null)
    setSubmitError(null)
    setFormOpen(true)
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setSubmitError(null)
    setFormOpen(true)
  }

  const closeForm = () => {
    if (submitting) return
    setFormOpen(false)
    setEditingProduct(null)
    setSubmitError(null)
  }

  const handleSave = async (payload) => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const isEdit = Boolean(editingProduct?.id)
      const url = isEdit ? `/products/${editingProduct.id}` : '/products'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await apiClient(url, {
        method,
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        let message = `Save failed (${res.status})`
        try {
          const body = await res.json()
          message = parseApiError(body, message)
        } catch {
          /* ignore */
        }
        throw new Error(message)
      }

      setSuccessMessage(isEdit ? 'Product updated successfully.' : 'Product created successfully.')
      setFormOpen(false)
      setEditingProduct(null)
      await loadData()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await apiClient(`/products/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) {
        let message = `Delete failed (${res.status})`
        try {
          const body = await res.json()
          message = parseApiError(body, message)
        } catch {
          /* ignore */
        }
        throw new Error(message)
      }
      setSuccessMessage('Product deleted successfully.')
      setDeleteTarget(null)
      await loadData()
    } catch (err) {
      setDeleteError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-neutral-100 p-6 sm:p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
            Product Management
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Add, edit, and remove catalog items.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="shrink-0 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
        >
          Add product
        </button>
      </div>

      <div className="px-6 sm:px-8 py-4 bg-white space-y-4">
        {successMessage && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 animate-fade-in">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in">
            {error}
            <button
              type="button"
              onClick={loadData}
              className="ml-3 font-medium underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-x-auto bg-white">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-neutral-500">
            Loading products…
          </div>
        ) : products.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-neutral-500">
            No products yet. Use Add product to create one.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-neutral-100 text-left text-sm whitespace-nowrap">
            <thead className="bg-neutral-50/50">
              <tr>
                <th className="px-6 sm:px-8 py-3.5 font-semibold text-neutral-900">Name</th>
                <th className="px-6 py-3.5 font-semibold text-neutral-900">Price</th>
                <th className="px-6 py-3.5 font-semibold text-neutral-900">Stock</th>
                <th className="px-6 py-3.5 font-semibold text-neutral-900">Category</th>
                <th className="px-6 sm:px-8 py-3.5 font-semibold text-neutral-900 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 sm:px-8 py-4 font-medium text-neutral-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 tabular-nums text-neutral-600">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4 tabular-nums text-neutral-600">
                    {product.stockQuantity}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {categoryById.get(product.categoryId) ??
                      (product.categoryId ? `ID ${product.categoryId}` : '—')}
                  </td>
                  <td className="px-6 sm:px-8 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className="mr-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError(null)
                        setDeleteTarget(product)
                      }}
                      className="rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ProductFormModal
        open={formOpen}
        title={editingProduct ? 'Edit product' : 'Add product'}
        initial={editingProduct}
        categories={categories}
        onClose={closeForm}
        onSubmit={handleSave}
        submitting={submitting}
        submitError={submitError}
      />

      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        productName={deleteTarget?.name ?? ''}
        onCancel={() => {
          if (!deleting) {
            setDeleteTarget(null)
            setDeleteError(null)
          }
        }}
        onConfirm={confirmDelete}
        deleting={deleting}
        error={deleteError}
      />
    </div>
  )
}

export default AdminProducts
