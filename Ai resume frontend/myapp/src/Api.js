// In local dev, Vite's proxy handles "/api" → http://localhost:5000.
// In production (Vercel), set VITE_API_URL in your project's env vars to
// your deployed backend URL, e.g. https://your-app.onrender.com/api
const BASE = import.meta.env.VITE_API_URL || "/api";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  // Resumes
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    return fetch(`${BASE}/resumes/upload`, { method: "POST", body: formData }).then(handle);
  },
  listResumes: () => fetch(`${BASE}/resumes`).then(handle),
  getResume: (id) => fetch(`${BASE}/resumes/${id}`).then(handle),
  scoreResume: (id, jobDescription) =>
    fetch(`${BASE}/resumes/${id}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription })
    }).then(handle),
  deleteResume: (id) => fetch(`${BASE}/resumes/${id}`, { method: "DELETE" }).then(handle),

  // Applications
  listApplications: () => fetch(`${BASE}/applications`).then(handle),
  createApplication: (data) =>
    fetch(`${BASE}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(handle),
  updateApplication: (id, data) =>
    fetch(`${BASE}/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(handle),
  updateStatus: (id, status) =>
    fetch(`${BASE}/applications/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    }).then(handle),
  deleteApplication: (id) =>
    fetch(`${BASE}/applications/${id}`, { method: "DELETE" }).then(handle)
};