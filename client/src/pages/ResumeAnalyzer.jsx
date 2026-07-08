import { useState } from "react"
import Navbar from "../components/Navbar"

function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [result, setResult] = useState(null)

  function analyzeResume(event) {
    event.preventDefault()

    const text = resumeText.toLowerCase()
    let score = 0
    const strengths = []
    const improvements = []

    if (text.includes("email") || text.includes("@")) {
      score += 10
      strengths.push("Contact email found.")
    } else {
      improvements.push("Add a professional email address.")
    }

    if (text.includes("education") || text.includes("b.tech") || text.includes("degree")) {
      score += 10
      strengths.push("Education section found.")
    } else {
      improvements.push("Add an Education section.")
    }

    if (text.includes("skills")) {
      score += 15
      strengths.push("Skills section found.")
    } else {
      improvements.push("Add a clear Skills section.")
    }

    if (text.includes("project") || text.includes("projects")) {
      score += 20
      strengths.push("Project section found.")
    } else {
      improvements.push("Add at least 2 strong projects with links.")
    }

    if (text.includes("github") || text.includes("linkedin")) {
      score += 10
      strengths.push("GitHub or LinkedIn link found.")
    } else {
      improvements.push("Add GitHub and LinkedIn profile links.")
    }

    if (
      text.includes("developed") ||
      text.includes("built") ||
      text.includes("created") ||
      text.includes("designed") ||
      text.includes("implemented")
    ) {
      score += 15
      strengths.push("Action words found in resume.")
    } else {
      improvements.push("Use strong action words like Built, Developed, Designed, Implemented.")
    }

    if (resumeText.length > 500) {
      score += 10
      strengths.push("Resume has enough content for basic analysis.")
    } else {
      improvements.push("Resume content looks too short. Add more details about projects and skills.")
    }

    if (targetRole.trim()) {
      const roleWords = targetRole.toLowerCase().split(" ")
      const matchedWords = roleWords.filter((word) => text.includes(word))

      if (matchedWords.length > 0) {
        score += 10
        strengths.push(`Resume matches some target role keywords: ${matchedWords.join(", ")}.`)
      } else {
        improvements.push("Add more keywords related to your target role.")
      }
    }

    const finalScore = Math.min(score, 100)

    let level = "Needs Improvement"
    let color = "text-red-300"

    if (finalScore >= 75) {
      level = "Strong Resume"
      color = "text-emerald-300"
    } else if (finalScore >= 50) {
      level = "Good, But Can Improve"
      color = "text-yellow-300"
    }

    setResult({
      score: finalScore,
      level,
      color,
      strengths,
      improvements,
    })
  }

  return (
    <main className="min-h-screen bg-[#08111f] text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <p className="mb-3 inline-block rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-2 text-sm text-purple-300">
            Resume Analyzer
          </p>

          <h1 className="text-4xl font-bold text-purple-300">
            Analyze your resume strength
          </h1>

          <p className="mt-4 max-w-2xl text-gray-300">
            Paste your resume content below. Student CareerShield will check contact
            details, education, skills, projects, links, action words, and target role match.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <form
            onSubmit={analyzeResume}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="mb-4">
              <label className="mb-2 block text-sm text-gray-300">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                placeholder="Example: Frontend Developer Intern"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-purple-400"
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-gray-300">
                Paste Resume Text
              </label>
              <textarea
                value={resumeText}
                onChange={(event) => setResumeText(event.target.value)}
                rows="14"
                placeholder="Paste your resume text here..."
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-purple-400"
              ></textarea>
            </div>

            <button className="w-full rounded-xl bg-purple-400 px-6 py-3 font-bold text-slate-950 hover:bg-purple-300">
              Analyze Resume
            </button>
          </form>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">Resume Result</h2>

            {!result ? (
              <p className="mt-4 text-gray-300">
                Paste your resume and click Analyze Resume. Your score and suggestions
                will appear here.
              </p>
            ) : (
              <div className="mt-6">
                <div className="rounded-2xl border border-white/10 bg-slate-950 p-6">
                  <p className="text-sm text-gray-400">Resume Score</p>
                  <h3 className={`mt-2 text-5xl font-extrabold ${result.color}`}>
                    {result.score}/100
                  </h3>
                  <p className={`mt-2 text-xl font-bold ${result.color}`}>
                    {result.level}
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="mb-3 text-lg font-bold text-emerald-300">
                    Strengths
                  </h3>

                  <ul className="space-y-3">
                    {result.strengths.map((item, index) => (
                      <li
                        key={index}
                        className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-gray-300"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <h3 className="mb-3 text-lg font-bold text-yellow-300">
                    Improvements
                  </h3>

                  <ul className="space-y-3">
                    {result.improvements.map((item, index) => (
                      <li
                        key={index}
                        className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-gray-300"
                      >
                        {item}
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

export default ResumeAnalyzer