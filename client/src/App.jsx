import { BrowserRouter, Routes, Route } from "react-router"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import ScamDetector from "./pages/ScamDetector"
import ResumeAnalyzer from "./pages/ResumeAnalyzer"
import ApplicationTracker from "./pages/ApplicationTracker"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scam-detector" element={<ScamDetector />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="/application-tracker" element={<ApplicationTracker />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App