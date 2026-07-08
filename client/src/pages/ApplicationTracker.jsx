import Navbar from "../components/Navbar"

function ApplicationTracker() {
  return (
    <main className="min-h-screen bg-[#08111f] text-white">
      <Navbar />

      <section className="px-8 py-10">
        <h1 className="text-4xl font-bold text-emerald-300">
          Application Tracker
        </h1>
        <p className="mt-4 max-w-2xl text-gray-300">
          Track your applications, deadlines, company names, interview status,
          notes, and scam risk score.
        </p>
      </section>
    </main>
  )
}

export default ApplicationTracker