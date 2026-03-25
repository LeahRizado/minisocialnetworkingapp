const API_BASE = 'http://localhost/minisocialnetworkingapp/backend/public'

async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(headers || {})
    },
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
    credentials: 'include'
  })

  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { raw: text }
  }

  if (!res.ok) {
    const msg = data?.error || 'Request failed'
    const err = new Error(msg)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

export const api = {
  health: () => request('/api/health'),
  me: () => request('/api/auth/me'),
  register: (payload) => request('/api/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: payload }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),

  feed: () => request('/api/feed'),
  createPost: (payload) => request('/api/posts', { method: 'POST', body: payload }),
  updatePost: (id, payload) => request(`/api/posts/${id}`, { method: 'PUT', body: payload }),
  deletePost: (id) => request(`/api/posts/${id}`, { method: 'DELETE' }),

  addComment: (postId, payload) => request(`/api/posts/${postId}/comments`, { method: 'POST', body: payload }),
  updateComment: (id, payload) => request(`/api/comments/${id}`, { method: 'PUT', body: payload }),
  deleteComment: (id) => request(`/api/comments/${id}`, { method: 'DELETE' }),

  toggleLike: (postId) => request(`/api/posts/${postId}/like`, { method: 'POST' }),

  profile: (username) => request(`/api/profile/${encodeURIComponent(username)}`),
  updateProfile: (formData) => request('/api/profile/update', { method: 'POST', body: formData }),

  search: (q, type = 'users') => request(`/api/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}`)
}
