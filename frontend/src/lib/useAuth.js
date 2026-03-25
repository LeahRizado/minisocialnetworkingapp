import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react'
import { api } from './api'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    api.me()
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
  }, [])

  const value = useMemo(() => ({
    user,
    setUser,
    login: async (payload) => {
      const d = await api.login(payload)
      setUser(d.user)
      return d.user
    },
    register: async (payload) => {
      const d = await api.register(payload)
      setUser(d.user)
      return d.user
    },
    logout: async () => {
      await api.logout()
      setUser(null)
    }
  }), [user])

  return createElement(AuthCtx.Provider, { value }, children)
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
