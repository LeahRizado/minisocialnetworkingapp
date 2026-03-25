import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './lib/useAuth'
import NavBar from './components/NavBar'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import FeedPage from './pages/Feed'
import ProfilePage from './pages/Profile'
import SearchPage from './pages/Search'

function RequireAuth({ children }) {
  const { user } = useAuth()
  const loc = useLocation()

  if (user === undefined) return null
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return children
}

export default function App() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <FeedPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/search"
            element={
              <RequireAuth>
                <SearchPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}
