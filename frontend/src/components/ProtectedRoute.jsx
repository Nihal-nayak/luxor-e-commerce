import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, requireRole = null }) {
  const { isAuthenticated, isAuthLoading, user } = useAuth()
  const location = useLocation()

  if (isAuthLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-500">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireRole && user?.role !== requireRole) {
    // If they are logged in but don't have the right role, send them home
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
