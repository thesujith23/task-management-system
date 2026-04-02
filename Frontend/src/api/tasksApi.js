const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, options)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const getTasks = (userId) =>
  request(`/tasks?userId=${encodeURIComponent(userId)}`, { headers: { 'x-user-id': userId } })

export const createTask = (userId, payload) =>
  request('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
    body: JSON.stringify(payload),
  })

export const updateTask = (userId, taskId, payload) =>
  request(`/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
    body: JSON.stringify(payload),
  })

export const deleteTask = (userId, taskId) =>
  request(`/tasks/${taskId}`, {
    method: 'DELETE',
    headers: { 'x-user-id': userId },
  })

export const addComment = (userId, taskId, payload) =>
  request(`/tasks/${taskId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
    body: JSON.stringify(payload),
  })

export const deleteComment = (userId, taskId, commentId, replyId = '') =>
  request(`/tasks/${taskId}/comments/${commentId}${replyId ? `?replyId=${encodeURIComponent(replyId)}` : ''}`, {
    method: 'DELETE',
    headers: { 'x-user-id': userId },
  })
