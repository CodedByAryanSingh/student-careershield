import Navbar from "../components/Navbar"

function ResumeAnalyzer() {
  return (
    <main className="min-h-screen bg-[#08111f] text-white">
      <Navbar />

      <section className="px-8 py-10">
        <h1 className="text-4xl font-bold text-purple-300">Resume Analyzer</h1>
        <p className="mt-4 max-w-2xl text-gray-300">
          Upload or paste your resume. The app will check sections, ATS keywords,
          project quality, skills, and internship match score.
        </p>
      </section>
    </main>
  )
}

export default ResumeAnalyzer