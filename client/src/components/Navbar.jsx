import { useEffect, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router"
import Icon from "./Icon"
import { useAuth } from "../context/AuthContext"

function Navbar() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem("careerShieldTheme") || document.documentElement.dataset.theme || "light")
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const links = [
    ["/dashboard", "Overview"],
    ["/scam-detector", "Verify a role"],
    ["/resume-analyzer", "Resume check"],
    ["/application-tracker", "Applications"],
  ]

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem("careerShieldTheme", theme)
  }, [theme])

  const handleLogout = () => {
    logout()
    navigate('/')
    setOpen(false)
  }

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark"><Icon name="shield" size={21} /></span>
          <span>Career<span>Shield</span></span>
        </Link>
        <div className={`nav-links ${open ? "is-open" : ""}`}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "active" : ""}>{label}</NavLink>
          ))}
          {user ? (
            <button onClick={handleLogout} className="text-sm font-medium hover:text-[var(--primary-color)] transition-colors ml-4 hidden md:block">Sign Out</button>
          ) : (
            <Link to="/auth" className="text-sm font-medium hover:text-[var(--primary-color)] transition-colors ml-4 hidden md:block">Sign In</Link>
          )}
          <Link className="mobile-nav-cta" to="/scam-detector">Check an offer <Icon name="arrow" size={17} /></Link>
          
          {/* Mobile Auth Links */}
          <div className="md:hidden mt-4 pt-4 border-t border-[var(--border-color)]">
            {user ? (
              <button onClick={handleLogout} className="block w-full text-left py-2 text-[var(--danger-color)]">Sign Out</button>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="block w-full text-left py-2 text-[var(--primary-color)]">Sign In</Link>
            )}
          </div>
        </div>
        <button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} title={`${theme === "light" ? "Dark" : "Light"} mode`}>
          <Icon name={theme === "light" ? "moon" : "sun"} size={17} />
        </button>
        {user ? (
          <Link className="nav-cta" to="/application-tracker">Track Apps <Icon name="arrow" size={17} /></Link>
        ) : (
          <Link className="nav-cta" to="/auth">Sign In <Icon name="arrow" size={17} /></Link>
        )}
        <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation"><Icon name={open ? "close" : "menu"} /></button>
      </nav>
    </header>
  )
}

export default Navbar
