async function request(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { "Content-Type": "application/json", ...options.headers }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(path, {
    headers,
    ...options,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || "Request failed. Please try again.")
  return payload
}

export const api = {
  signup: (data) => request("/api/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => request("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
  analyzeScam: (data) => request("/api/scam/analyze", { method: "POST", body: JSON.stringify(data) }),
  analyzeResume: (data) => request("/api/resume/analyze", { method: "POST", body: JSON.stringify(data) }),
  getApplications: () => request("/api/applications"),
  createApplication: (data) => request("/api/applications", { method: "POST", body: JSON.stringify(data) }),
  updateApplication: (id, data) => request(`/api/applications/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteApplication: (id) => request(`/api/applications/${id}`, { method: "DELETE" }),
}
