async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || "Request failed. Please try again.")
  return payload
}

export const api = {
  analyzeScam: (data) => request("/api/scam/analyze", { method: "POST", body: JSON.stringify(data) }),
  analyzeResume: (data) => request("/api/resume/analyze", { method: "POST", body: JSON.stringify(data) }),
  getApplications: () => request("/api/applications"),
  createApplication: (data) => request("/api/applications", { method: "POST", body: JSON.stringify(data) }),
  updateApplication: (id, data) => request(`/api/applications/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteApplication: (id) => request(`/api/applications/${id}`, { method: "DELETE" }),
}
