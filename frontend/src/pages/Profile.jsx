import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <main className="bg-neutral-50 min-h-[calc(100vh-64px)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            My Profile
          </h1>
        </div>

        <div className="mt-8 bg-white shadow-sm rounded-2xl border border-neutral-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 flex items-center justify-center rounded-full bg-neutral-900 text-3xl font-bold text-white uppercase">
                {user?.name?.[0] || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">{user?.name}</h2>
                <p className="text-sm text-neutral-500 mt-1">{user?.email}</p>
                {user?.role && (
                  <span className="inline-flex mt-2 items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 uppercase tracking-widest">
                    {user.role}
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row gap-4">
              <Link 
                to="/orders" 
                className="flex-1 text-center rounded-full bg-neutral-900 px-6 py-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800"
              >
                View My Orders
              </Link>
              <button 
                onClick={handleLogout}
                className="flex-1 rounded-full bg-white px-6 py-4 text-sm font-medium text-red-600 border border-red-200 transition-colors hover:bg-red-50 hover:border-red-300"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Profile
