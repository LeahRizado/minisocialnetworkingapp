import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../lib/useAuth'
import IconButton from './IconButton'
import { IconChat, IconEdit, IconHeart, IconSend, IconTrash } from './Icons'

function fmtDate(ts) {
  try {
    return new Date(ts).toLocaleString()
  } catch {
    return ts
  }

}

export default function PostCard({ post, comments = [], onChanged }) {
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(post.content)
  const [commentText, setCommentText] = useState('')
  const isMine = useMemo(() => user && String(user.id) === String(post.user_id), [user, post.user_id])

  return (
    <div className="card">
      <div className="card-body">
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
              <IconButton
                as="button"
                type="button"
                label={editing ? 'Cancel edit' : 'Edit post'}
                onClick={() => {
                  setEditing((v) => !v)
                  setContent(post.content)
                }}
              >
                <IconEdit className="h-4 w-4" />
              </IconButton>
              <IconButton
                as="button"
                type="button"
                label="Delete post"
                className="text-red-700"
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
                <IconTrash className="h-4 w-4" />
              </IconButton>
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
            <textarea className="textarea" rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
            <button className="btn btn-primary" disabled={busy}>
              Save
            </button>
          </form>
        ) : (
          <div className="mt-3 whitespace-pre-wrap text-sm text-slate-800">{post.content}</div>
        )}

        {post.image ? (
          <img
            alt="post"
            src={`http://localhost/minisocialnetworkingapp/backend/public${post.image}`}
            className="mt-3 w-full rounded-lg border border-slate-200 object-cover"
          />
        ) : null}

        <div className="mt-4 flex items-center gap-3">
          <button
            className={`pill ${post.liked_by_me ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-700'} hover:bg-slate-200`}
            aria-label="Toggle like"
            title="Like"
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
            <IconHeart filled={!!post.liked_by_me} className="h-4 w-4" />
            <span>{post.like_count}</span>
          </button>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600" aria-label="Comment count" title="Comments">
            <IconChat className="h-4 w-4" />
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
              className="input flex-1"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <IconButton
              as="button"
              type="submit"
              label="Send comment"
              className="btn btn-primary"
              disabled={busy}
            >
              <IconSend className="h-4 w-4" />
            </IconButton>
          </form>
        </div>
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
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-semibold text-slate-700">
          @{comment.username}
          <span className="ml-2 text-[11px] font-normal text-slate-500">{fmtDate(comment.created_at)}</span>
        </div>
        {isMine ? (
          <div className="flex items-center gap-2">
            <IconButton
              as="button"
              type="button"
              label={editing ? 'Cancel edit comment' : 'Edit comment'}
              onClick={() => {
                setEditing((v) => !v)
                setText(comment.content)
              }}
            >
              <IconEdit className="h-4 w-4" />
            </IconButton>
            <IconButton
              as="button"
              type="button"
              label="Delete comment"
              className="text-red-700"
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
              <IconTrash className="h-4 w-4" />
            </IconButton>
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
          <input className="input flex-1 px-2 py-1" value={text} onChange={(e) => setText(e.target.value)} />
          <button className="btn btn-primary px-3 py-1.5" disabled={busy}>
            Save
          </button>
        </form>
      ) : (
        <div className="mt-1 text-sm text-slate-800">{comment.content}</div>
      )}
    </div>
  )
}
