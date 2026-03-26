import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../lib/useAuth'
import UserDropdown from './UserDropdown'
import SearchResults from './SearchResults'
import { IconSearch } from './Icons'

export default function NavBar() {
  const { user } = useAuth()
  const loc = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)

  const isLogin = loc.pathname === '/login'
  const isRegister = loc.pathname === '/register'

  const primaryClasses = 'btn btn-primary px-3 py-1.5'
  const linkClasses = 'btn btn-ghost px-3 py-1.5'

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-lg font-bold tracking-tight text-slate-900">
          SocialNet
        </Link>

        {user && (
          <div className="relative mx-2 hidden flex-1 sm:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <IconSearch className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search users or posts..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSearchResults(true)
              }}
              onFocus={() => setShowSearchResults(true)}
              className="input pl-9 pr-3 py-1.5"
            />
            {showSearchResults && (
              <SearchResults 
                query={searchQuery} 
                onClose={() => setShowSearchResults(false)} 
              />
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <UserDropdown />
          ) : (
            <>
              <Link
                to="/login"
                className={isRegister ? primaryClasses : linkClasses}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={isLogin ? primaryClasses : linkClasses}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
