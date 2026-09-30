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
    <main className="bg-neutral-50 min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16 lg:px-8">
        
        <header className="mb-8 border-b border-neutral-200 pb-6 animate-fade-in-up">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
            Account
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            My Profile
          </h1>
        </header>

        <div className="mt-10 bg-white shadow-sm rounded-3xl border border-neutral-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="h-28 w-28 shrink-0 flex items-center justify-center rounded-full bg-neutral-900 text-4xl font-bold text-white uppercase shadow-lg">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">{user?.name}</h2>
                <p className="text-neutral-500 mt-1">{user?.email}</p>
                {user?.role && (
                  <span className="inline-flex mt-4 items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 uppercase tracking-widest border border-neutral-200">
                    {user.role} Account
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-12 pt-10 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                to="/orders" 
                className="group flex items-center justify-between rounded-2xl bg-neutral-50 px-6 py-5 text-sm font-medium text-neutral-900 border border-neutral-100 transition-all duration-200 hover:border-neutral-300 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-600 shadow-sm transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                  </span>
                  <div>
                    <span className="block font-semibold">Order History</span>
                    <span className="text-xs text-neutral-500 font-normal mt-0.5 block">View and track orders</span>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-neutral-400 group-hover:text-neutral-900 transition-colors">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="group flex items-center justify-between rounded-2xl bg-white px-6 py-5 text-sm font-medium text-red-600 border border-red-100 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:shadow-sm text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors group-hover:bg-red-600 group-hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </span>
                  <div>
                    <span className="block font-semibold">Sign Out</span>
                    <span className="text-xs text-red-400 font-normal mt-0.5 block">End your current session</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Profile
