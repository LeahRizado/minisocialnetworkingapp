import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import IconButton from '../components/IconButton'
import { IconSearch } from '../components/Icons'

export default function SearchPage() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('users')
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4">
        <h1 className="text-lg font-bold text-slate-900">Search</h1>
        <form
          className="mt-3 flex flex-col gap-2 sm:flex-row"
          onSubmit={async (e) => {
            e.preventDefault()
            setLoading(true)
            setError('')
            try {
              const d = await api.search(q, type)
              setResults(d.results || [])
            } catch (err) {
              setError(err.message)
            } finally {
              setLoading(false)
            }
          }}
        >
          <input
            className="flex-1 rounded-md border px-3 py-2 text-sm"
            placeholder={type === 'users' ? 'Search users by name/username...' : 'Search posts by keyword...'}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select className="rounded-md border px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="users">Users</option>
            <option value="posts">Posts</option>
          </select>
          <IconButton as="button" type="submit" label="Search" className="bg-slate-900 text-white hover:bg-slate-800">
            <IconSearch className="h-5 w-5" />
          </IconButton>
        </form>
        {loading ? <div className="mt-3 text-sm text-slate-600">Searching...</div> : null}
        {error ? <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      </div>

      <div className="space-y-3">
        {results.map((r) =>
          type === 'users' ? (
            <div key={r.id} className="rounded-lg border bg-white p-4">
              <div className="text-sm font-bold text-slate-900">
                <Link to={`/profile/${encodeURIComponent(r.username)}`} className="hover:underline">
                  @{r.username}
                </Link>
              </div>
              <div className="text-sm text-slate-700">{r.full_name}</div>
              {r.bio ? <div className="mt-2 text-sm text-slate-600">{r.bio}</div> : null}
            </div>
          ) : (
            <div key={r.id} className="rounded-lg border bg-white p-4">
              <div className="text-sm font-semibold text-slate-900">
                <Link to={`/profile/${encodeURIComponent(r.username)}`} className="hover:underline">
                  @{r.username}
                </Link>
              </div>
              <div className="mt-2 whitespace-pre-wrap text-sm text-slate-800">{r.content}</div>
              <div className="mt-2 text-xs text-slate-500">Likes: {r.like_count} | Comments: {r.comment_count}</div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
