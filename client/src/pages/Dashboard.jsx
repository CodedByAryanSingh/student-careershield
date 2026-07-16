import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Icon from "../components/Icon"
import { api } from "../lib/api"

const statusOrder = ["Applied", "Shortlisted", "Interview", "Selected"]

function Dashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => { api.getApplications().then(setApplications).catch((err) => setError(err.message)).finally(() => setLoading(false)) }, [])
  const stats = useMemo(() => ({ total: applications.length, interviews: applications.filter((app) => app.status === "Interview").length, selected: applications.filter((app) => app.status === "Selected").length, safe: applications.filter((app) => Number(app.scamScore) < 38).length }), [applications])
  const maxStage = Math.max(1, ...statusOrder.map((status) => applications.filter((app) => app.status === status).length))
  const firstName = "Aryan"

  return (
    <main className="app-page dashboard-page"><Navbar />
      <section className="dashboard-hero container"><div><div className="eyebrow"><span className="pulse-dot"/> Career command center</div><h1>Good afternoon, {firstName}.</h1><p>Here’s what’s moving—and where your attention is worth spending today.</p></div><Link className="button button-dark" to="/application-tracker"><Icon name="plus"/> Add application</Link></section>
      {error && <div className="container"><div className="form-error"><Icon name="warning"/>{error}</div></div>}
      <section className="stats-grid container">
        <article><span className="stat-icon lime"><Icon name="briefcase"/></span><div><small>Total applications</small><strong>{loading ? "—" : stats.total}</strong><em>All tracked roles</em></div></article>
        <article><span className="stat-icon violet"><Icon name="clock"/></span><div><small>Interviews</small><strong>{loading ? "—" : stats.interviews}</strong><em>Active conversations</em></div></article>
        <article><span className="stat-icon peach"><Icon name="trend"/></span><div><small>Offers</small><strong>{loading ? "—" : stats.selected}</strong><em>Keep building momentum</em></div></article>
        <article><span className="stat-icon green"><Icon name="shield"/></span><div><small>Low-risk roles</small><strong>{loading ? "—" : `${stats.safe}/${stats.total}`}</strong><em>Based on saved scores</em></div></article>
      </section>
      <section className="dashboard-grid container">
        <article className="dash-card pipeline-card">
          <div className="card-heading"><div><span className="kicker">YOUR PIPELINE</span><h2>Application momentum</h2></div><Link to="/application-tracker">View all <Icon name="arrow" size={17}/></Link></div>
          <div className="pipeline">
            {statusOrder.map((status, index) => { const count = applications.filter((app) => app.status === status).length; return <div key={status}><div className="pipeline-label"><span><i className={`stage-dot stage-${index}`}/>{status}</span><strong>{count}</strong></div><div className="pipeline-track"><span className={`stage-${index}`} style={{ width: `${Math.max(count ? 12 : 0, (count / maxStage) * 100)}%` }}/></div></div> })}
          </div>
        </article>
        <article className="dash-card focus-card"><span className="kicker kicker-light">TODAY’S FOCUS</span><div className="focus-icon"><Icon name="sparkles" size={28}/></div><h2>Polish before you send.</h2><p>A role-aligned resume can make the difference at the first screen.</p><Link to="/resume-analyzer">Review my resume <Icon name="arrow" size={18}/></Link></article>
        <article className="dash-card recent-card">
          <div className="card-heading"><div><span className="kicker">RECENT ACTIVITY</span><h2>Latest applications</h2></div></div>
          <div className="application-table">
            {applications.length === 0 && !loading ? <div className="table-empty">No applications yet. Add your first one to start the pipeline.</div> : applications.slice(0, 5).map((app) => <div className="application-row" key={app.id}><span className="company-avatar">{app.company.slice(0, 2).toUpperCase()}</span><div><strong>{app.company}</strong><small>{app.role}</small></div><span className={`status status-${app.status.toLowerCase()}`}>{app.status}</span><div className="risk-cell"><small>Risk</small><strong className={Number(app.scamScore) >= 70 ? "danger" : ""}>{app.scamScore || 0}/100</strong></div><span className="row-date">{app.date ? new Date(`${app.date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</span></div>)}
          </div>
        </article>
        <article className="dash-card safety-card"><div className="safety-top"><span><Icon name="shield"/></span><small>SAFETY SNAPSHOT</small></div><strong>{applications.filter((app) => Number(app.scamScore) >= 70).length}</strong><h3>high-risk role flagged</h3><p>Review any payment requests or off-domain recruiter emails before responding.</p><Link to="/scam-detector">Run another check <Icon name="chevron" size={15}/></Link></article>
      </section><Footer />
    </main>
  )
}

export default Dashboard
