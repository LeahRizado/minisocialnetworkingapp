import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/useAuth'
import { IconUser, IconLogout } from './Icons'

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const nav = useNavigate()

  const handleLogout = async () => {
    await logout()
    nav('/login')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost px-3 py-1.5"
      >
        <span className="h-6 w-6 rounded-full bg-slate-300 flex items-center justify-center text-xs font-semibold text-slate-700">
          {user.username.charAt(0).toUpperCase()}
        </span>
        <span>{user.username}</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-900/10">
            <Link
              to={`/profile/${encodeURIComponent(user.username)}`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setIsOpen(false)}
            >
              <IconUser className="h-4 w-4" />
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <IconLogout className="h-4 w-4" />
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  )
}
