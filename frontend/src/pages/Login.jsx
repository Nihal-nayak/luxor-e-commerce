import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/shop'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const result = await login(email, password)
    setIsLoading(false)

    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.error)
    }
  }

  const inputClass = 'mt-2 block w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-3.5 px-4 text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:bg-white focus:border-neutral-400 focus:shadow-sm sm:text-sm'
  const labelClass = 'block text-sm font-medium text-neutral-700'

  return (
    <main className="bg-neutral-50 min-h-[calc(100vh-72px)] flex items-center justify-center py-16 px-6">
      <div className="w-full max-w-[420px] animate-fade-in-up">
        {/* Brand */}
        <div className="text-center mb-10">
          <Link to="/" className="text-2xl font-bold tracking-[0.3em] text-neutral-900 uppercase">
            LUXOR
          </Link>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-8 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 animate-fade-in">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <div>
              <label htmlFor="email" className={labelClass}>Email address</label>
              <input
                id="email"
                type="email"
                required
                className={inputClass}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className={labelClass}>Password</label>
              <input
                id="password"
                type="password"
                required
                className={inputClass}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-neutral-900 px-6 py-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-neutral-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-neutral-900 hover:underline underline-offset-2">
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Login
