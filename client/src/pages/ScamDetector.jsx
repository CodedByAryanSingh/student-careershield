import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Icon from "../components/Icon"
import { api } from "../lib/api"

const emptyForm = { company: "", role: "", email: "", website: "", description: "" }
const sample = { company: "BrightPath Careers", role: "Marketing Intern", email: "career.brightpath@gmail.com", website: "", description: "Urgent hiring — limited seats! Pay a refundable training fee of ₹2,999 today to receive a guaranteed certificate and 100% placement. Contact us on WhatsApp only to secure your position." }

function ScamDetector() {
  const [form, setForm] = useState(emptyForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function submit(event) {
    event.preventDefault(); setLoading(true); setError("")
    try { setResult(await api.analyzeScam(form)) } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  const ringStyle = result ? { "--score": result.score, "--ring-color": result.score >= 70 ? "#f36f56" : result.score >= 38 ? "#f2b84b" : "#5bca93" } : {}

  return (
    <main className="app-page">
      <Navbar />
      <section className="page-intro container">
        <div><div className="eyebrow"><span className="pulse-dot" /> Internship verification</div><h1>Pause. Check. <em>Then</em> apply.</h1><p>Paste the opportunity details and get a practical risk assessment based on common recruitment scam signals.</p></div>
        <div className="intro-note"><Icon name="shield" /><div><strong>Private by design</strong><span>Your checks are analyzed in real time and never published.</span></div></div>
      </section>

      <section className="workspace-grid container">
        <form className="workspace-panel form-panel" onSubmit={submit}>
          <div className="panel-heading"><div><span className="step-number">01</span><div><h2>Opportunity details</h2><p>Add as much information as you have.</p></div></div><button type="button" className="sample-button" onClick={() => setForm(sample)}>Try suspicious example</button></div>
          <div className="form-grid">
            <label><span>Company name *</span><input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. Acme Technologies" /></label>
            <label><span>Internship role</span><input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Product Design Intern" /></label>
            <label><span>Recruiter email</span><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@company.com" /></label>
            <label><span>Company website</span><input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://company.com" /></label>
            <label className="full"><span>Internship description *</span><textarea required rows="8" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Paste the full listing, recruiter message, or offer details here…"/><small>{form.description.length} characters</small></label>
          </div>
          {error && <div className="form-error"><Icon name="warning" size={18} />{error}</div>}
          <button className="button button-dark submit-button" disabled={loading}>{loading ? <><span className="spinner" /> Checking signals…</> : <>Analyze opportunity <Icon name="sparkles" /></>}</button>
        </form>

        <aside className={`workspace-panel result-panel ${result ? "has-result" : ""}`}>
          {!result ? <div className="empty-result"><div className="radar"><span/><Icon name="search" size={38} /></div><span className="kicker">YOUR RESULT WILL APPEAR HERE</span><h2>See the signals, not just a score.</h2><p>We’ll explain every flag and give you a short verification checklist.</p><div className="empty-signals"><span/><span/><span/></div></div> : <div className="result-content">
            <div className="result-top"><div className="score-ring" style={ringStyle}><div><strong>{result.score}</strong><span>/100</span></div></div><div><span className={`risk-pill risk-${result.score >= 70 ? "high" : result.score >= 38 ? "medium" : "low"}`}>{result.level}</span><h2>{result.score >= 70 ? "Several serious flags found" : result.score >= 38 ? "Verify before proceeding" : "No major risk patterns found"}</h2><p>{result.confidence}% analysis confidence</p></div></div>
            <div className="result-section"><h3>Signals detected <span>{result.signals.length}</span></h3>{result.signals.map((signal) => <div className="signal-item" key={signal.label}><span className={`signal-icon ${signal.severity}`}><Icon name={signal.severity === "low" ? "check" : "warning"} size={17}/></span><div><strong>{signal.label}</strong><p>{signal.detail}</p></div></div>)}</div>
            {!!result.safeSignals.length && <div className="safe-row">{result.safeSignals.map((item) => <span key={item}><Icon name="check" size={15}/>{item}</span>)}</div>}
            <div className="result-section checklist"><h3>Your next steps</h3>{result.checklist.map((item) => <div key={item}><Icon name="check" size={16}/><span>{item}</span></div>)}</div>
          </div>}
        </aside>
      </section>
      <Footer />
    </main>
  )
}

export default ScamDetector
