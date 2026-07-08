import { Link } from "react-router"

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6">
      <Link to="/" className="text-2xl font-bold">
        Student <span className="text-cyan-400">CareerShield</span>
      </Link>

      <div className="hidden gap-6 text-sm text-gray-300 md:flex">
        <Link to="/" className="hover:text-cyan-400">
          Home
        </Link>

        <Link to="/scam-detector" className="hover:text-cyan-400">
          Scam Detector
        </Link>

        <Link to="/resume-analyzer" className="hover:text-cyan-400">
          Resume Analyzer
        </Link>

        <Link to="/application-tracker" className="hover:text-cyan-400">
          Tracker
        </Link>
      </div>

      <Link
        to="/scam-detector"
        className="rounded-full bg-cyan-400 px-5 py-2 font-semibold text-slate-950 hover:bg-cyan-300"
      >
        Get Started
      </Link>
    </nav>
  )
}

export default Navbar