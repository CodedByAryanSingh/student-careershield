import { useEffect, useState } from "react"
import { Link, NavLink } from "react-router"
import Icon from "./Icon"

function Navbar() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem("careerShieldTheme") || document.documentElement.dataset.theme || "light")
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
          <Link className="mobile-nav-cta" to="/scam-detector">Check an offer <Icon name="arrow" size={17} /></Link>
        </div>
        <button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} title={`${theme === "light" ? "Dark" : "Light"} mode`}>
          <Icon name={theme === "light" ? "moon" : "sun"} size={17} />
        </button>
        <Link className="nav-cta" to="/scam-detector">Check an offer <Icon name="arrow" size={17} /></Link>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation"><Icon name={open ? "close" : "menu"} /></button>
      </nav>
    </header>
  )
}

export default Navbar
