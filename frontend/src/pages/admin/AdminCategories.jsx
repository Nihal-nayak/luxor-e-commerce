import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '../../api/apiClient'

function parseApiError(body, fallback) {
  if (!body) return fallback
  if (typeof body.error === 'string') return body.error
  const values = Object.values(body)
  if (values.length > 0 && typeof values[0] === 'string') return values[0]
  return fallback
}

function CategoryFormModal({ open, title, initial, onClose, onSubmit, submitting, submitError }) {
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    if (!open) return
    setName(initial?.name ?? '')
    setNameError('')
  }, [open, initial])

  if (!open) return null

  const validate = () => {
    if (!name.trim()) {
      setNameError('Category name is required.')
      return false
    }
    setNameError('')
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ name: name.trim() })
  }

  const inputClass = nameError
    ? 'mt-1 block w-full rounded-lg border border-red-300 px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400'
    : 'mt-1 block w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-form-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-neutral-100 bg-white shadow-xl">
        <div className="border-b border-neutral-100 px-6 py-4">
          <h2 id="category-form-title" className="text-lg font-bold text-neutral-900">
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
            <label htmlFor="category-name" className="text-sm font-medium text-neutral-700">
              Category Name
            </label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (nameError) setNameError('')
              }}
              className={inputClass}
              placeholder="e.g. Electronics"
              autoFocus
            />
            {nameError && (
              <p className="mt-1 text-xs text-red-600">{nameError}</p>
            )}
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
              disabled={submitting}
              className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteConfirmModal({ open, categoryName, onCancel, onConfirm, deleting, error }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="alertdialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-neutral-900">Delete category?</h2>
        <p className="mt-2 text-sm text-neutral-600">
          This will permanently delete{' '}
          <span className="font-medium text-neutral-900">{categoryName}</span>.
          This action cannot be undone.
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Categories with assigned products cannot be deleted.
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
            className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await apiClient('/admin/categories')
      if (!res.ok) {
        throw new Error(`Failed to load categories (${res.status})`)
      }
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    if (!successMessage) return
    const t = setTimeout(() => setSuccessMessage(null), 4000)
    return () => clearTimeout(t)
  }, [successMessage])

  const openAdd = () => {
    setEditingCategory(null)
    setSubmitError(null)
    setFormOpen(true)
  }

  const openEdit = (category) => {
    setEditingCategory(category)
    setSubmitError(null)
    setFormOpen(true)
  }

  const closeForm = () => {
    if (submitting) return
    setFormOpen(false)
    setEditingCategory(null)
    setSubmitError(null)
  }

  const handleSave = async (payload) => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const isEdit = Boolean(editingCategory?.id)
      const url = isEdit
        ? `/admin/categories/${editingCategory.id}`
        : '/admin/categories'
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

      setSuccessMessage(
        isEdit ? 'Category updated successfully.' : 'Category created successfully.'
      )
      setFormOpen(false)
      setEditingCategory(null)
      await loadCategories()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const openDelete = (category) => {
    setDeleteError(null)
    setDeleteTarget(category)
  }

  const closeDelete = () => {
    if (deleting) return
    setDeleteTarget(null)
    setDeleteError(null)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await apiClient(`/admin/categories/${deleteTarget.id}`, {
        method: 'DELETE',
      })
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
      setSuccessMessage('Category deleted successfully.')
      setDeleteTarget(null)
      await loadCategories()
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
            Category Management
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Add, edit, and remove product categories.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="shrink-0 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
        >
          Add category
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
              onClick={loadCategories}
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
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-neutral-500">
            No categories yet. Use{' '}
            <button
              type="button"
              onClick={openAdd}
              className="font-medium text-neutral-900 underline hover:no-underline"
            >
              Add category
            </button>{' '}
            to create one.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-neutral-100 text-left text-sm whitespace-nowrap">
            <thead className="bg-neutral-50/50">
              <tr>
                <th className="px-6 sm:px-8 py-3.5 font-semibold text-neutral-900">ID</th>
                <th className="px-6 py-3.5 font-semibold text-neutral-900">Name</th>
                <th className="px-6 sm:px-8 py-3.5 text-right font-semibold text-neutral-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 sm:px-8 py-4 tabular-nums text-neutral-500">
                    {cat.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {cat.name}
                  </td>
                  <td className="px-6 sm:px-8 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(cat)}
                      className="mr-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => openDelete(cat)}
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

      {!loading && !error && categories.length > 0 && (
        <div className="bg-white px-6 sm:px-8 py-4 border-t border-neutral-100">
          <p className="text-xs text-neutral-400">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'} total
          </p>
        </div>
      )}

      <CategoryFormModal
        open={formOpen}
        title={editingCategory ? 'Edit category' : 'Add category'}
        initial={editingCategory}
        onClose={closeForm}
        onSubmit={handleSave}
        submitting={submitting}
        submitError={submitError}
      />

      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        categoryName={deleteTarget?.name ?? ''}
        onCancel={closeDelete}
        onConfirm={confirmDelete}
        deleting={deleting}
        error={deleteError}
      />
    </div>
  )
}

export default AdminCategories
