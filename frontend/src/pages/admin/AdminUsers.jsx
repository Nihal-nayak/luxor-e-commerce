import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '../../api/apiClient'
import { useAuth } from '../../context/AuthContext'

function roleBadgeClass(role) {
  switch (role) {
    case 'ADMIN':
      return 'bg-neutral-900 text-white'
    case 'USER':
      return 'bg-neutral-100 text-neutral-800'
    default:
      return 'bg-neutral-100 text-neutral-800'
  }
}

function parseApiError(body, fallback) {
  if (!body) return fallback
  if (typeof body.error === 'string') return body.error
  if (typeof body.role === 'string') return body.role
  const values = Object.values(body)
  if (values.length > 0 && typeof values[0] === 'string') return values[0]
  return fallback
}

function ChangeRoleModal({
  user,
  currentAdminId,
  onClose,
  onSaved,
}) {
  const [selectedRole, setSelectedRole] = useState(user.role)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const isSelf = user.id === currentAdminId
  const isDemotingSelf = isSelf && selectedRole === 'USER'
  const roleUnchanged = selectedRole === user.role

  useEffect(() => {
    setSelectedRole(user.role)
    setError(null)
  }, [user])

  const handleSave = async () => {
    if (roleUnchanged) {
      onClose()
      return
    }

    if (isDemotingSelf) {
      setError('You cannot remove your own admin role.')
      return
    }

    setSaving(true)
    setError(null)
    try {
      const res = await apiClient(`/admin/users/${user.id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: selectedRole }),
      })

      if (!res.ok) {
        let message = `Role update failed (${res.status})`
        try {
          const body = await res.json()
          message = parseApiError(body, message)
        } catch {
          /* ignore */
        }
        throw new Error(message)
      }

      const updated = await res.json()
      onSaved(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const confirmationMessage =
    selectedRole === user.role
      ? `No role change selected for ${user.name}.`
      : `Change ${user.name}'s role from ${user.role} to ${selectedRole}?`

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-role-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-neutral-100 bg-white shadow-xl">
        <div className="border-b border-neutral-100 px-6 py-4">
          <h2 id="change-role-title" className="text-lg font-bold text-neutral-900">
            Change role
          </h2>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-neutral-900">{user.name}</p>
            <p className="text-sm text-neutral-500">{user.email}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Current role
            </p>
            <span
              className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${roleBadgeClass(user.role)}`}
            >
              {user.role}
            </span>
          </div>

          <div>
            <label
              htmlFor="role-select"
              className="text-sm font-medium text-neutral-700"
            >
              New role
            </label>
            <select
              id="role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            >
              <option value="USER" disabled={isSelf && user.role === 'ADMIN'}>
                USER
              </option>
              <option value="ADMIN">ADMIN</option>
            </select>
            {isSelf && user.role === 'ADMIN' && (
              <p className="mt-2 text-xs text-amber-700">
                You cannot change your own role to USER.
              </p>
            )}
          </div>

          {!roleUnchanged && (
            <p className="rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
              {confirmationMessage}
            </p>
          )}

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-neutral-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || isDemotingSelf || roleUnchanged}
            className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [roleTarget, setRoleTarget] = useState(null)

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await apiClient('/admin/users')
      if (!res.ok) {
        throw new Error(`Failed to load users (${res.status})`)
      }
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  useEffect(() => {
    if (!successMessage) return
    const t = setTimeout(() => setSuccessMessage(null), 4000)
    return () => clearTimeout(t)
  }, [successMessage])

  const handleRoleSaved = async (updatedUser) => {
    setRoleTarget(null)
    setSuccessMessage(
      `${updatedUser.name}'s role updated to ${updatedUser.role}.`
    )
    await loadUsers()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-neutral-100 p-6 sm:p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
            User Management
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            View registered accounts and update user roles.
          </p>
        </div>
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
              onClick={loadUsers}
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
            Loading users…
          </div>
        ) : users.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-neutral-500">
            No registered users found.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-neutral-100 text-left text-sm whitespace-nowrap">
            <thead className="bg-neutral-50/50">
              <tr>
                <th className="px-6 sm:px-8 py-3.5 font-semibold text-neutral-900">Name</th>
                <th className="px-6 py-3.5 font-semibold text-neutral-900">Email</th>
                <th className="px-6 py-3.5 font-semibold text-neutral-900">Role</th>
                <th className="px-6 sm:px-8 py-3.5 font-semibold text-neutral-900 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 sm:px-8 py-4 font-medium text-neutral-900">
                    {user.name}
                    {user.id === currentUser?.id && (
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        (you)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest ${roleBadgeClass(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 sm:px-8 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setRoleTarget(user)}
                      className="mr-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      Change Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {roleTarget && (
        <ChangeRoleModal
          user={roleTarget}
          currentAdminId={currentUser?.id}
          onClose={() => setRoleTarget(null)}
          onSaved={handleRoleSaved}
        />
      )}
    </div>
  )
}

export default AdminUsers
