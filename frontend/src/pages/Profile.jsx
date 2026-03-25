import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../lib/useAuth'
import PostCard from '../components/PostCard'

export default function ProfilePage() {
  const { username } = useParams()
  const { user, setUser } = useAuth()

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [saving, setSaving] = useState(false)

  const isMe = useMemo(() => user && username && user.username === username, [user, username])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const d = await api.profile(username)
      setProfile(d.user)
      setPosts(d.posts || [])
      if (isMe) {
        setFullName(d.user.full_name || '')
        setBio(d.user.bio || '')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [username])

  return (
    <div className="space-y-4">
      {error ? <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      {profile ? (
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-3">
            <img
              alt="avatar"
              className="h-14 w-14 rounded-full border object-cover"
              src={
                profile.profile_image
                  ? `http://localhost/minisocialnetworkingapp/backend/public${profile.profile_image}`
                  : 'https://via.placeholder.com/56'
              }
            />
            <div>
              <div className="text-lg font-bold text-slate-900">{profile.full_name}</div>
              <div className="text-sm text-slate-600">@{profile.username}</div>
            </div>
          </div>

          {profile.bio ? <div className="mt-3 text-sm text-slate-700">{profile.bio}</div> : null}

          {isMe ? (
            <div className="mt-4 rounded-md bg-slate-50 p-3">
              <div className="text-sm font-semibold text-slate-900">Edit Profile</div>
              <form
                className="mt-3 space-y-2"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setSaving(true)
                  try {
                    const fd = new FormData()
                    fd.append('full_name', fullName)
                    fd.append('bio', bio)
                    if (avatar) fd.append('profile_image', avatar)
                    const d = await api.updateProfile(fd)
                    setUser(d.user)
                    await load()
                    setAvatar(null)
                  } catch (err) {
                    alert(err.message)
                  } finally {
                    setSaving(false)
                  }
                }}
              >
                <div>
                  <label className="text-sm font-medium text-slate-700">Full name</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Bio</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Avatar</label>
                  <input type="file" accept="image/*" className="mt-1 text-sm" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
                </div>
                <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800" disabled={saving}>
                  Save
                </button>
              </form>
            </div>
          ) : null}
        </div>
      ) : null}

      {loading ? <div className="text-sm text-slate-600">Loading...</div> : null}

      <div className="space-y-4">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} comments={[]} onChanged={load} />
        ))}
      </div>
    </div>
  )
}
