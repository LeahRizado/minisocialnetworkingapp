import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/useAuth'

export default function NavBar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()

  const isLogin = loc.pathname === '/login'
  const isRegister = loc.pathname === '/register'

  const primaryClasses = 'rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800'
  const linkClasses = 'text-sm font-medium text-slate-700 hover:text-slate-900'

  return (
    <div className="border-b bg-white">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-slate-900">
          SocialNet
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/search" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                Search
              </Link>
              <Link
                to={`/profile/${encodeURIComponent(user.username)}`}
                className="text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                {user.username}
              </Link>
              <button
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
                onClick={async () => {
                  await logout()
                  nav('/login')
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={isRegister ? primaryClasses : linkClasses}>
                Login
              </Link>
              <Link to="/register" className={isLogin ? primaryClasses : linkClasses}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
