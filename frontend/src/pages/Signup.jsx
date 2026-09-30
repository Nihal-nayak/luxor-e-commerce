import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      const response = await fetch('http://localhost:8080/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        let msg = 'Failed to create account.'
        try {
          const errData = await response.json()
          if (errData.message || errData.error) {
            msg = errData.message || errData.error
          }
        } catch (_) {}
        throw new Error(msg)
      }

      setIsSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2000)

    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
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
            Create an account
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Join us to manage your orders and preferences
          </p>
        </div>
        
        <div className="bg-white rounded-2xl border border-neutral-100 p-8 shadow-sm relative overflow-hidden">
          {isSuccess ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white p-8 text-center animate-fade-in">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8 text-green-500">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Account created</h3>
              <p className="mt-2 text-sm text-neutral-500">Redirecting you to sign in...</p>
            </div>
          ) : null}

          <form className={`space-y-5 transition-opacity duration-300 ${isSuccess ? 'opacity-0' : 'opacity-100'}`} onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 animate-fade-in">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <div>
              <label htmlFor="name" className={labelClass}>Full Name</label>
              <input
                id="name"
                type="text"
                required
                className={inputClass}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-neutral-900 hover:underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Signup
