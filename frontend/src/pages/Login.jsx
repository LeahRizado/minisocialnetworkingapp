import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/useAuth'

export default function LoginPage() {
  const { user, login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) {
    nav('/')
    return null
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <div className="card-body">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Login</h1>
          <p className="mt-1 text-sm text-slate-600">Welcome back. Please sign in.</p>

          {error ? <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault()
              setError('')
              try {
                await login({ username, password })
                const to = loc.state?.from || '/'
                nav(to)
              } catch (err) {
                setError(err.message)
              }
            }}
          >
            <div>
              <label className="text-sm font-medium text-slate-700">Username</label>
              <input
                className="input mt-1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                className="input mt-1"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>

            <p className="text-center text-sm text-slate-600">
              No account?{' '}
              <Link to="/register" className="font-semibold text-slate-900 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
