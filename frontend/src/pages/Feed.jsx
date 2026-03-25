import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import PostCard from '../components/PostCard'

export default function FeedPage() {
  const [data, setData] = useState({ posts: [], comments: {} })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const d = await api.feed()
      setData(d)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const posts = useMemo(() => data.posts || [], [data])

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4">
        <h1 className="text-lg font-bold text-slate-900">Newsfeed</h1>
        <form
          className="mt-3 space-y-2"
          onSubmit={async (e) => {
            e.preventDefault()
            if (!content.trim()) return
            setBusy(true)
            try {
              if (image) {
                const fd = new FormData()
                fd.append('content', content)
                fd.append('image', image)
                await api.createPost(fd)
              } else {
                await api.createPost({ content })
              }
              setContent('')
              setImage(null)
              await load()
            } catch (err) {
              alert(err.message)
            } finally {
              setBusy(false)
            }
          }}
        >
          <textarea
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="What's on your mind?"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex items-center justify-between gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="text-sm"
            />
            <button
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              disabled={busy}
            >
              Post
            </button>
          </div>
        </form>
      </div>

      {error ? <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      {loading ? <div className="text-sm text-slate-600">Loading...</div> : null}

      <div className="space-y-4">
        {posts.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            comments={data.comments?.[p.id] || []}
            onChanged={load}
          />
        ))}
      </div>
    </div>
  )
}
