import { useState } from "react"
import Navbar from "../components/Navbar"

function ScamDetector() {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    email: "",
    website: "",
    description: "",
  })

  const [result, setResult] = useState(null)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function analyzeInternship(event) {
    event.preventDefault()

    let score = 0
    const warnings = []

    const fullText = `
      ${formData.company}
      ${formData.role}
      ${formData.email}
      ${formData.website}
      ${formData.description}
    `.toLowerCase()

    if (
      fullText.includes("registration fee") ||
      fullText.includes("training fee") ||
      fullText.includes("security deposit") ||
      fullText.includes("pay first") ||
      fullText.includes("payment required")
    ) {
      score += 30
      warnings.push("This post mentions payment, registration fee, or deposit.")
    }

    if (
      fullText.includes("urgent hiring") ||
      fullText.includes("limited seats") ||
      fullText.includes("apply immediately") ||
      fullText.includes("last chance")
    ) {
      score += 15
      warnings.push("This post uses urgency pressure words.")
    }

    if (
      formData.email.includes("@gmail.com") ||
      formData.email.includes("@yahoo.com") ||
      formData.email.includes("@outlook.com")
    ) {
      score += 20
      warnings.push("The recruiter is using a personal email instead of a company email.")
    }

    if (
      fullText.includes("guaranteed certificate") ||
      fullText.includes("guaranteed job") ||
      fullText.includes("100% placement")
    ) {
      score += 20
      warnings.push("This post makes unrealistic guarantees.")
    }

    if (!formData.website.trim()) {
      score += 10
      warnings.push("No official company website was provided.")
    }

    if (formData.description.length < 80) {
      score += 10
      warnings.push("The internship description is too short or unclear.")
    }

    if (warnings.length === 0) {
      warnings.push("No major red flags found from basic rule checking.")
    }

    const finalScore = Math.min(score, 100)

    let level = "Low Risk"
    let color = "text-emerald-300"

    if (finalScore >= 70) {
      level = "High Risk"
      color = "text-red-300"
    } else if (finalScore >= 40) {
      level = "Medium Risk"
      color = "text-yellow-300"
    }

    setResult({
      score: finalScore,
      level,
      color,
      warnings,
    })
  }

  return (
    <main className="min-h-screen bg-[#08111f] text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <p className="mb-3 inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            Internship Scam Detector
          </p>

          <h1 className="text-4xl font-bold text-cyan-400">
            Check if an internship looks suspicious
          </h1>

          <p className="mt-4 max-w-2xl text-gray-300">
            Paste internship details below. Student CareerShield will check for
            fake fees, suspicious emails, urgency pressure, unrealistic promises,
            and missing company details.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <form
            onSubmit={analyzeInternship}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="mb-4">
              <label className="mb-2 block text-sm text-gray-300">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Example: TechNova Solutions"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm text-gray-300">
                Internship Role
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Example: Frontend Developer Intern"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm text-gray-300">
                Recruiter Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Example: hr@company.com"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm text-gray-300">
                Company Website
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Example: https://company.com"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-gray-300">
                Internship Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Paste the full internship/job post here..."
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              ></textarea>
            </div>

            <button className="w-full rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-300">
              Analyze Internship
            </button>
          </form>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">Analysis Result</h2>

            {!result ? (
              <p className="mt-4 text-gray-300">
                Fill the form and click Analyze Internship. Your scam risk
                result will appear here.
              </p>
            ) : (
              <div className="mt-6">
                <div className="rounded-2xl border border-white/10 bg-slate-950 p-6">
                  <p className="text-sm text-gray-400">Risk Score</p>
                  <h3 className={`mt-2 text-5xl font-extrabold ${result.color}`}>
                    {result.score}/100
                  </h3>
                  <p className={`mt-2 text-xl font-bold ${result.color}`}>
                    {result.level}
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="mb-3 text-lg font-bold">Detected Signals</h3>

                  <ul className="space-y-3">
                    {result.warnings.map((warning, index) => (
                      <li
                        key={index}
                        className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-gray-300"
                      >
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default ScamDetector