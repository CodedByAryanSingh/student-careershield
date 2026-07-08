function Home() {
  return (
    <main className="min-h-screen bg-[#08111f] text-white">
      <nav className="flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold">
          Student <span className="text-cyan-400">CareerShield</span>
        </h1>

        <div className="hidden gap-6 text-sm text-gray-300 md:flex">
          <a href="#" className="hover:text-cyan-400">Home</a>
          <a href="#" className="hover:text-cyan-400">Scam Detector</a>
          <a href="#" className="hover:text-cyan-400">Resume Analyzer</a>
          <a href="#" className="hover:text-cyan-400">Tracker</a>
        </div>

        <button className="rounded-full bg-cyan-400 px-5 py-2 font-semibold text-slate-950 hover:bg-cyan-300">
          Get Started
        </button>
      </nav>

      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20 text-center">
        <p className="mb-4 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
          AI-Powered Internship Safety Platform
        </p>

        <h2 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
          Detect fake internships, improve your resume, and track applications.
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-gray-300">
          Student CareerShield helps students avoid internship scams, analyze resumes,
          and manage job applications from one powerful dashboard.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button className="rounded-xl bg-cyan-400 px-7 py-3 font-bold text-slate-950 hover:bg-cyan-300">
            Analyze Internship
          </button>

          <button className="rounded-xl border border-white/20 px-7 py-3 font-bold text-white hover:border-cyan-400 hover:text-cyan-400">
            Check Resume
          </button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-bold text-cyan-300">Scam Detector</h3>
          <p className="text-gray-300">
            Check internship posts for fake fees, suspicious emails, unsafe links,
            and unrealistic promises.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-bold text-purple-300">Resume Analyzer</h3>
          <p className="text-gray-300">
            Analyze resume strength, missing sections, ATS keywords, and job match score.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-3 text-xl font-bold text-emerald-300">Application Tracker</h3>
          <p className="text-gray-300">
            Track applied jobs, interview status, deadlines, notes, and saved opportunities.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Home