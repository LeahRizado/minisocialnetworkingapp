import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/useAuth'

export default function RegisterPage() {
  const { register } = useAuth()
  const nav = useNavigate()

  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <div className="card-body">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Register</h1>
          <p className="mt-1 text-sm text-slate-600">Create your account.</p>

          {error ? <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault()
              setError('')
              try {
                await register({ full_name: fullName, username, password })
                nav('/')
              } catch (err) {
                setError(err.message)
              }
            }}
          >
            <div>
              <label className="text-sm font-medium text-slate-700">Full name</label>
              <input className="input mt-1" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Username</label>
              <input className="input mt-1" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
              <p className="mt-1 text-xs text-slate-500">Use 3-30 chars: lowercase letters, numbers, underscore.</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Create account
            </button>
            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-slate-900 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
