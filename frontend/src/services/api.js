const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api'

export function getToken() {
  return localStorage.getItem('mtaafix_token')
}

export async function apiRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
  if (!isFormData && options.body !== undefined && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`)
  return data
}

export { API_URL }