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

  const inputClass = "mt-2 block w-full rounded-lg border border-neutral-200 bg-white py-3 px-4 text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 sm:text-sm transition-colors"
  const labelClass = "block text-sm font-medium text-neutral-900"

  return (
    <main className="bg-neutral-50 min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-neutral-900">
            Create an account
          </h2>
        </div>
        
        {isSuccess ? (
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <h3 className="text-sm font-medium text-green-800">Account created successfully!</h3>
            <p className="mt-2 text-sm text-green-700">Redirecting to login...</p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full Name
                </label>
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
                <label htmlFor="email" className={labelClass}>
                  Email address
                </label>
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
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
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
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-neutral-900 px-6 py-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
            
            <p className="mt-4 text-center text-sm text-neutral-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-neutral-900 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </main>
  )
}

export default Signup
