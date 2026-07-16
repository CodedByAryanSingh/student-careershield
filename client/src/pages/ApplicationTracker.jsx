import { useEffect, useMemo, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Icon from "../components/Icon"
import { api } from "../lib/api"

const emptyForm = { company: "", role: "", date: new Date().toISOString().slice(0, 10), deadline: "", status: "Applied", resumeVersion: "", scamScore: "", notes: "" }
const filters = ["All", "Applied", "Shortlisted", "Interview", "Selected", "Suspicious"]

function ApplicationTracker() {
  const [applications, setApplications] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [filter, setFilter] = useState("All")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => { api.getApplications().then(setApplications).catch((err) => setError(err.message)).finally(() => setLoading(false)) }, [])
  const visible = useMemo(() => filter === "All" ? applications : applications.filter((app) => app.status === filter), [applications, filter])

  async function addApplication(event) {
    event.preventDefault(); setSaving(true); setError("")
    try { const created = await api.createApplication(form); setApplications((items) => [created, ...items]); setForm(emptyForm); setOpen(false) } catch (err) { setError(err.message) } finally { setSaving(false) }
  }
  async function changeStatus(id, status) { try { const updated = await api.updateApplication(id, { status }); setApplications((items) => items.map((item) => item.id === id ? updated : item)) } catch (err) { setError(err.message) } }
  async function remove(id) { if (!window.confirm("Remove this application from your tracker?")) return; try { await api.deleteApplication(id); setApplications((items) => items.filter((item) => item.id !== id)) } catch (err) { setError(err.message) } }

  return (
    <main className="app-page tracker-page"><Navbar />
      <section className="dashboard-hero container"><div><div className="eyebrow peach"><Icon name="briefcase" size={16}/> Application workspace</div><h1>Keep every opportunity <em>moving.</em></h1><p>One organized view for deadlines, next steps, resume versions, and safety notes.</p></div><button className="button button-dark" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "plus"}/>{open ? "Close form" : "Add application"}</button></section>
      {open && <section className="container add-form-wrap"><form className="workspace-panel add-form" onSubmit={addApplication}><div className="panel-heading"><div><span className="step-number peach-bg">+</span><div><h2>Add a new opportunity</h2><p>Required fields are marked with an asterisk.</p></div></div></div><div className="form-grid three"><label><span>Company *</span><input required value={form.company} onChange={(e) => setForm({...form, company:e.target.value})} placeholder="Company name"/></label><label><span>Role *</span><input required value={form.role} onChange={(e) => setForm({...form, role:e.target.value})} placeholder="Internship title"/></label><label><span>Status</span><select value={form.status} onChange={(e) => setForm({...form,status:e.target.value})}>{filters.slice(1).map((item)=><option key={item}>{item}</option>)}</select></label><label><span>Applied on</span><input type="date" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})}/></label><label><span>Deadline</span><input type="date" value={form.deadline} onChange={(e)=>setForm({...form,deadline:e.target.value})}/></label><label><span>Resume version</span><input value={form.resumeVersion} onChange={(e)=>setForm({...form,resumeVersion:e.target.value})} placeholder="e.g. Product v2"/></label><label><span>Risk score</span><input type="number" min="0" max="100" value={form.scamScore} onChange={(e)=>setForm({...form,scamScore:e.target.value})} placeholder="0–100"/></label><label className="span-two"><span>Notes</span><input value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})} placeholder="Interview details, recruiter name, next step…"/></label></div>{error&&<div className="form-error"><Icon name="warning"/>{error}</div>}<div className="form-actions"><button type="button" className="text-button" onClick={()=>setOpen(false)}>Cancel</button><button className="button button-dark" disabled={saving}>{saving ? "Saving…" : "Save application"}<Icon name="arrow"/></button></div></form></section>}
      <section className="container tracker-shell">
        <div className="filter-bar"><div className="filter-scroll">{filters.map((item)=><button key={item} onClick={()=>setFilter(item)} className={filter===item?"active":""}>{item}<span>{item === "All" ? applications.length : applications.filter((app)=>app.status===item).length}</span></button>)}</div><span className="api-status"><i/> API synced</span></div>
        {error&&!open&&<div className="form-error"><Icon name="warning"/>{error}</div>}
        <div className="tracker-list-head"><span>Opportunity</span><span>Stage</span><span>Timeline</span><span>Safety</span><span/></div>
        <div className="tracker-list">
          {loading ? <div className="list-message"><span className="spinner dark"/> Loading applications…</div> : visible.length===0 ? <div className="list-message">No applications in this stage.</div> : visible.map((app)=><article className="tracker-item" key={app.id}><div className="tracker-company"><span className="company-avatar large">{app.company.slice(0,2).toUpperCase()}</span><div><strong>{app.company}</strong><span>{app.role}</span>{app.resumeVersion&&<small><Icon name="file" size={13}/>{app.resumeVersion}</small>}</div></div><div><select className={`status-select status-${app.status.toLowerCase()}`} value={app.status} onChange={(e)=>changeStatus(app.id,e.target.value)}>{filters.slice(1).map((item)=><option key={item}>{item}</option>)}</select></div><div className="timeline-cell"><span><Icon name="clock" size={15}/>Applied {app.date||"—"}</span><small>Deadline {app.deadline||"Not set"}</small></div><div className="safety-cell"><span className={Number(app.scamScore)>=70?"danger":"safe"}>{app.scamScore||0}</span><div><strong>{Number(app.scamScore)>=70?"High risk":"Low risk"}</strong><small>out of 100</small></div></div><button className="icon-button danger-button" onClick={()=>remove(app.id)} aria-label={`Delete ${app.company}`}><Icon name="trash" size={18}/></button>{app.notes&&<p className="tracker-notes">{app.notes}</p>}</article>)}
        </div>
      </section><Footer />
    </main>
  )
}

export default ApplicationTracker
