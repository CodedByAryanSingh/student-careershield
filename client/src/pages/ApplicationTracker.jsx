import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"

const initialForm = {
  company: "",
  role: "",
  date: "",
  deadline: "",
  status: "Applied",
  resumeVersion: "",
  scamScore: "",
  notes: "",
}

function ApplicationTracker() {
  const [formData, setFormData] = useState(initialForm)
 const [applications, setApplications] = useState(() => {
  const savedApplications = localStorage.getItem("careerShieldApplications")

  if (savedApplications) {
    return JSON.parse(savedApplications)
  }

  return []
})
  useEffect(() => {
    localStorage.setItem(
      "careerShieldApplications",
      JSON.stringify(applications)
    )
  }, [applications])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function addApplication(event) {
    event.preventDefault()

    if (!formData.company.trim() || !formData.role.trim()) {
      alert("Please add company name and role.")
      return
    }

    const newApplication = {
      id: Date.now(),
      ...formData,
    }

    setApplications([newApplication, ...applications])
    setFormData(initialForm)
  }

  function deleteApplication(id) {
    const updatedApplications = applications.filter((app) => app.id !== id)
    setApplications(updatedApplications)
  }

  function getStatusStyle(status) {
    if (status === "Selected") return "text-emerald-300 bg-emerald-400/10"
    if (status === "Interview") return "text-cyan-300 bg-cyan-400/10"
    if (status === "Shortlisted") return "text-purple-300 bg-purple-400/10"
    if (status === "Rejected") return "text-red-300 bg-red-400/10"
    if (status === "Suspicious") return "text-yellow-300 bg-yellow-400/10"

    return "text-gray-300 bg-white/10"
  }

  return (
    <main className="min-h-screen bg-[#08111f] text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <p className="mb-3 inline-block rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
            Application Tracker
          </p>

          <h1 className="text-4xl font-bold text-emerald-300">
            Track your internship applications
          </h1>

          <p className="mt-4 max-w-2xl text-gray-300">
            Save companies, roles, deadlines, resume version, status, notes, and
            scam risk score in one place.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <form
            onSubmit={addApplication}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Example: TechNova"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Frontend Intern"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Application Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
                >
                  <option>Applied</option>
                  <option>Shortlisted</option>
                  <option>Interview</option>
                  <option>Rejected</option>
                  <option>Selected</option>
                  <option>Suspicious</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Resume Version
                </label>
                <input
                  type="text"
                  name="resumeVersion"
                  value={formData.resumeVersion}
                  onChange={handleChange}
                  placeholder="Resume v1 / Frontend resume"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm text-gray-300">
                Scam Risk Score
              </label>
              <input
                type="number"
                name="scamScore"
                value={formData.scamScore}
                onChange={handleChange}
                placeholder="Example: 35"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm text-gray-300">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Interview date, HR contact, important details..."
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
              ></textarea>
            </div>

            <button className="mt-5 w-full rounded-xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 hover:bg-emerald-300">
              Add Application
            </button>
          </form>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">Saved Applications</h2>

            {applications.length === 0 ? (
              <p className="mt-4 text-gray-300">
                No applications added yet. Add your first internship application.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-2xl border border-white/10 bg-slate-950 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold">{app.company}</h3>
                        <p className="mt-1 text-gray-300">{app.role}</p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyle(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-gray-300 md:grid-cols-2">
                      <p>Applied: {app.date || "Not added"}</p>
                      <p>Deadline: {app.deadline || "Not added"}</p>
                      <p>Resume: {app.resumeVersion || "Not added"}</p>
                      <p>Scam Score: {app.scamScore || "Not added"}</p>
                    </div>

                    {app.notes && (
                      <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-gray-300">
                        {app.notes}
                      </p>
                    )}

                    <button
                      onClick={() => deleteApplication(app.id)}
                      className="mt-4 rounded-xl border border-red-400/30 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-400/10"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default ApplicationTracker