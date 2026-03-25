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
    <div className="mx-auto max-w-md rounded-lg border bg-white p-6">
      <h1 className="text-xl font-bold text-slate-900">Register</h1>
      <p className="mt-1 text-sm text-slate-600">Create your account.</p>

      {error ? <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <form
        className="mt-5 space-y-3"
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
          <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Username</label>
          <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          <p className="mt-1 text-xs text-slate-500">Use 3-30 chars: lowercase letters, numbers, underscore.</p>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </div>
        <button className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">Create account</button>
        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-slate-900 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
