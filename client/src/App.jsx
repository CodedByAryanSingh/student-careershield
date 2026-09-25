import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import ScamDetector from "./pages/ScamDetector"
import ResumeAnalyzer from "./pages/ResumeAnalyzer"
import ApplicationTracker from "./pages/ApplicationTracker"
import Auth from "./pages/Auth"
import { AuthProvider, useAuth } from "./context/AuthContext"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/scam-detector" element={<ScamDetector />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/application-tracker" element={
            <ProtectedRoute>
              <ApplicationTracker />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
