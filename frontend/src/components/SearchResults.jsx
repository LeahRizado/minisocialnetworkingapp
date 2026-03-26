import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function SearchResults({ query, onClose }) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [type, setType] = useState('users')
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    const searchTimer = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await api.search(query, type)
        setResults(data.results || [])
      } catch (err) {
        setError(err.message)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(searchTimer)
  }, [query, type])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  if (query.trim().length < 2) return null

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10" ref={dropdownRef}>
      <div className="border-b border-slate-200/70 p-2">
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          className="input px-2 py-1"
        >
          <option value="users">Users</option>
          <option value="posts">Posts</option>
        </select>
      </div>

      {loading && (
        <div className="p-4 text-sm text-slate-600 text-center">
          Searching...
        </div>
      )}

      {error && (
        <div className="p-4 text-sm text-red-700 text-center">
          {error}
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="p-4 text-sm text-slate-500 text-center">
          No {type} found for "{query}"
        </div>
      )}

      {!loading && !error && results.map((result) =>
        type === 'users' ? (
          <Link
            key={result.id}
            to={`/profile/${encodeURIComponent(result.username)}`}
            className="block border-b border-slate-100 p-3 hover:bg-slate-50 last:border-b-0"
            onClick={onClose}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-semibold text-slate-700">
                {result.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  @{result.username}
                </div>
                <div className="text-sm text-slate-700">
                  {result.full_name}
                </div>
                {result.bio && (
                  <div className="text-xs text-slate-500 mt-1">
                    {result.bio.length > 50 ? `${result.bio.substring(0, 50)}...` : result.bio}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ) : (
          <Link
            key={result.id}
            to={`/profile/${encodeURIComponent(result.username)}`}
            className="block border-b border-slate-100 p-3 hover:bg-slate-50 last:border-b-0"
            onClick={onClose}
          >
            <div className="text-sm font-semibold text-slate-900 mb-1">
              @{result.username}
            </div>
            <div className="text-sm text-slate-800 whitespace-pre-wrap">
              {result.content.length > 100 ? `${result.content.substring(0, 100)}...` : result.content}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Likes: {result.like_count} | Comments: {result.comment_count}
            </div>
          </Link>
        )
      )}
    </div>
  )
}
