import { Link } from "react-router"
import Icon from "./Icon"

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div>
          <Link to="/" className="brand brand-light"><span className="brand-mark"><Icon name="shield" size={21} /></span><span>Career<span>Shield</span></span></Link>
          <p>Career clarity and scam protection for the next generation of talent.</p>
        </div>
        <div className="footer-links">
          <Link to="/scam-detector">Verify an offer</Link>
          <Link to="/resume-analyzer">Review resume</Link>
          <Link to="/application-tracker">Track applications</Link>
        </div>
        <span className="footer-note">© 2026 CareerShield</span>
      </div>
    </footer>
  )
}

export default Footer
