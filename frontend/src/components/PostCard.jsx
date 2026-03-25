import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../lib/useAuth'

function fmtDate(ts) {
  try {
    return new Date(ts).toLocaleString()
  } catch {
    return ts
  }

}

function HeartIcon({ filled, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6c-1.6-1.6-4.2-1.6-5.8 0L12 7.6 9 4.6C7.4 3 4.8 3 3.2 4.6c-1.8 1.8-1.8 4.6 0 6.4L12 19.8l8.8-8.8c1.8-1.8 1.8-4.6 0-6.4z" />
    </svg>
  )
}

function ChatIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  )
}

export default function PostCard({ post, comments = [], onChanged }) {
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(post.content)
  const [commentText, setCommentText] = useState('')
  const isMine = useMemo(() => user && String(user.id) === String(post.user_id), [user, post.user_id])

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">
            <Link to={`/profile/${encodeURIComponent(post.username)}`} className="hover:underline">
              @{post.username}
            </Link>
            <span className="ml-2 text-xs font-normal text-slate-500">{fmtDate(post.created_at)}</span>
          </div>
          <div className="text-xs text-slate-500">{post.full_name}</div>
        </div>

        {isMine ? (
          <div className="flex items-center gap-2">
            <button
              className="text-xs font-semibold text-slate-700 hover:underline"
              onClick={() => {
                setEditing((v) => !v)
                setContent(post.content)
              }}
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button
              className="text-xs font-semibold text-red-700 hover:underline"
              disabled={busy}
              onClick={async () => {
                setBusy(true)
                try {
                  await api.deletePost(post.id)
                  onChanged?.()
                } finally {
                  setBusy(false)
                }
              }}
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>

      {editing ? (
        <form
          className="mt-3 space-y-2"
          onSubmit={async (e) => {
            e.preventDefault()
            setBusy(true)
            try {
              await api.updatePost(post.id, { content })
              setEditing(false)
              onChanged?.()
            } catch (err) {
              alert(err.message)
            } finally {
              setBusy(false)
            }
          }}
        >
          <textarea className="w-full rounded-md border px-3 py-2 text-sm" rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
          <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800" disabled={busy}>
            Save
          </button>
        </form>
      ) : (
        <div className="mt-3 whitespace-pre-wrap text-sm text-slate-800">{post.content}</div>
      )}

      {post.image ? (
        <img alt="post" src={`http://localhost/minisocialnetworkingapp/backend/public${post.image}`} className="mt-3 w-full rounded-md border object-cover" />
      ) : null}

      <div className="mt-4 flex items-center gap-3">
        <button
          className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold ${post.liked_by_me ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-700'} hover:bg-slate-200`}
          disabled={busy}
          onClick={async () => {
            setBusy(true)
            try {
              await api.toggleLike(post.id)
              onChanged?.()
            } finally {
              setBusy(false)
            }
          }}
        >
          <HeartIcon filled={!!post.liked_by_me} className="h-4 w-4" />
          <span>{post.like_count}</span>
        </button>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <ChatIcon className="h-4 w-4" />
          <span>{post.comment_count}</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} onChanged={onChanged} />
        ))}

        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault()
            if (!commentText.trim()) return
            setBusy(true)
            try {
              await api.addComment(post.id, { content: commentText })
              setCommentText('')
              onChanged?.()
            } catch (err) {
              alert(err.message)
            } finally {
              setBusy(false)
            }
          }}
        >
          <input
            className="flex-1 rounded-md border px-3 py-2 text-sm"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800" disabled={busy}>
            Post
          </button>
        </form>
      </div>
    </div>
  )
}

function CommentItem({ comment, onChanged }) {
  const { user } = useAuth()
  const isMine = user && String(user.id) === String(comment.user_id)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(comment.content)
  const [busy, setBusy] = useState(false)

  return (
    <div className="rounded-md bg-slate-50 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-semibold text-slate-700">
          @{comment.username}
          <span className="ml-2 text-[11px] font-normal text-slate-500">{fmtDate(comment.created_at)}</span>
        </div>
        {isMine ? (
          <div className="flex items-center gap-2">
            <button className="text-[11px] font-semibold text-slate-700 hover:underline" onClick={() => { setEditing((v) => !v); setText(comment.content) }}>
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button
              className="text-[11px] font-semibold text-red-700 hover:underline"
              disabled={busy}
              onClick={async () => {
                setBusy(true)
                try {
                  await api.deleteComment(comment.id)
                  onChanged?.()
                } finally {
                  setBusy(false)
                }
              }}
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>

      {editing ? (
        <form
          className="mt-2 flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault()
            setBusy(true)
            try {
              await api.updateComment(comment.id, { content: text })
              setEditing(false)
              onChanged?.()
            } catch (err) {
              alert(err.message)
            } finally {
              setBusy(false)
            }
          }}
        >
          <input className="flex-1 rounded-md border px-2 py-1 text-sm" value={text} onChange={(e) => setText(e.target.value)} />
          <button className="rounded-md bg-slate-900 px-2 py-1 text-sm font-semibold text-white hover:bg-slate-800" disabled={busy}>
            Save
          </button>
        </form>
      ) : (
        <div className="mt-1 text-sm text-slate-800">{comment.content}</div>
      )}
    </div>
  )
}
