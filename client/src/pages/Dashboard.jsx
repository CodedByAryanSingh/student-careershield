import Navbar from "../components/Navbar"

function Dashboard() {
  const savedApplications =
    JSON.parse(localStorage.getItem("careerShieldApplications")) || []

  const totalApplications = savedApplications.length

  const selectedCount = savedApplications.filter(
    (app) => app.status === "Selected"
  ).length

  const interviewCount = savedApplications.filter(
    (app) => app.status === "Interview"
  ).length

  const suspiciousCount = savedApplications.filter(
    (app) => app.status === "Suspicious" || Number(app.scamScore) >= 70
  ).length

  const recentApplications = savedApplications.slice(0, 4)

  return (
    <main className="min-h-screen bg-[#08111f] text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <p className="mb-3 inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            Student Career Dashboard
          </p>

          <h1 className="text-4xl font-bold">
            Welcome to your CareerShield dashboard
          </h1>

          <p className="mt-4 max-w-2xl text-gray-300">
            Track your applications, monitor suspicious internships, and review
            your career progress in one place.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">Total Applications</p>
            <h2 className="mt-3 text-4xl font-extrabold text-cyan-300">
              {totalApplications}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">Interviews</p>
            <h2 className="mt-3 text-4xl font-extrabold text-purple-300">
              {interviewCount}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">Selected</p>
            <h2 className="mt-3 text-4xl font-extrabold text-emerald-300">
              {selectedCount}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">Suspicious</p>
            <h2 className="mt-3 text-4xl font-extrabold text-red-300">
              {suspiciousCount}
            </h2>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">Recent Applications</h2>

            {recentApplications.length === 0 ? (
              <p className="mt-4 text-gray-300">
                No applications found. Add applications from the tracker page.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-xl border border-white/10 bg-slate-950 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold">{app.company}</h3>
                        <p className="text-sm text-gray-400">{app.role}</p>
                      </div>

                      <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-gray-300">
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">CareerShield Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <h3 className="font-bold text-cyan-300">Scam Protection</h3>
                <p className="mt-2 text-sm text-gray-300">
                  Use the Scam Detector before applying to unknown internships.
                </p>
              </div>

              <div className="rounded-xl border border-purple-400/20 bg-purple-400/10 p-4">
                <h3 className="font-bold text-purple-300">Resume Improvement</h3>
                <p className="mt-2 text-sm text-gray-300">
                  Analyze your resume before sending it to recruiters.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <h3 className="font-bold text-emerald-300">Application Tracking</h3>
                <p className="mt-2 text-sm text-gray-300">
                  Keep all company details, deadlines, and notes organized.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Dashboard