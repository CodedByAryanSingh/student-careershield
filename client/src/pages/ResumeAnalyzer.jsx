import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Icon from "../components/Icon"
import { api } from "../lib/api"
import { extractResumeText } from "../lib/resumeFile"

const sampleResume = `Aarav Mehta | aarav@email.com | linkedin.com/in/aarav | github.com/aarav\n\nEDUCATION\nB.Tech Computer Science, National Institute of Technology\n\nSKILLS\nJavaScript, React, TypeScript, HTML, CSS, REST API, Git, Figma\n\nPROJECTS\nBuilt a responsive student marketplace in React used by 400+ students. Improved page performance by 38% through code splitting and image optimization.\n\nEXPERIENCE\nDeveloped reusable UI components and implemented API integrations for a campus product. Collaborated with 4 designers and engineers to launch features on schedule.`

function ResumeAnalyzer() {
  const [targetRole, setTargetRole] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fileName, setFileName] = useState("")
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState("")

  async function submit(event) {
    event.preventDefault(); setLoading(true); setError("")
    try { setResult(await api.analyzeResume({ targetRole, resumeText })) } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  async function loadFile(file) {
    if (!file) return
    setUploading(true); setError(""); setResult(null)
    try {
      const text = (await extractResumeText(file)).trim()
      if (text.length < 80) throw new Error("We could not find enough readable text in this file. Try a text-based PDF, DOCX, or paste the resume below.")
      setResumeText(text)
      setFileName(file.name)
    } catch (err) {
      setFileName("")
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="app-page resume-page"><Navbar />
      <section className="page-intro container"><div><div className="eyebrow violet"><Icon name="sparkles" size={16}/> Role-fit resume review</div><h1>Make your resume <em>earn</em> the interview.</h1><p>Get a fast, role-specific review of structure, evidence, keywords, and recruiter readability.</p></div><div className="intro-note"><Icon name="file"/><div><strong>ATS-minded feedback</strong><span>Built around the signals early-career recruiters scan first.</span></div></div></section>
      <section className="workspace-grid container">
        <form className="workspace-panel form-panel" onSubmit={submit}>
          <div className="panel-heading"><div><span className="step-number violet-bg">01</span><div><h2>Your resume</h2><p>Upload a local file or paste the text below.</p></div></div><button type="button" className="sample-button" onClick={() => { setTargetRole("Frontend Developer Intern"); setResumeText(sampleResume); setFileName("") }}>Load example</button></div>
          <div className="form-grid single">
            <label><span>Target role *</span><div className="input-with-icon"><Icon name="target" size={18}/><input required value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. Frontend Developer Intern"/></div></label>
            <div className={`upload-dropzone ${dragging ? "is-dragging" : ""} ${fileName ? "has-file" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); loadFile(event.dataTransfer.files[0]) }}>
              <input id="resume-file" type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" onChange={(event) => loadFile(event.target.files[0])}/>
              <label htmlFor="resume-file">
                <span className="upload-icon">{uploading ? <span className="spinner dark"/> : <Icon name={fileName ? "check" : "upload"}/>}</span>
                <span><strong>{uploading ? "Reading your resume…" : fileName || "Upload resume from your computer"}</strong><small>{fileName ? "Text extracted successfully · Choose another file" : "PDF, DOCX, or TXT · Maximum 10 MB"}</small></span>
                {!uploading && <em>{fileName ? "Change" : "Browse"}</em>}
              </label>
            </div>
            <div className="upload-divider"><span>or paste resume text</span></div>
            <label><span>Resume text *</span><textarea required rows="13" value={resumeText} onChange={(e) => { setResumeText(e.target.value); setFileName("") }} placeholder="Paste your resume text here…"/><small>{resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0} words</small></label>
          </div>
          {error && <div className="form-error"><Icon name="warning" size={18}/>{error}</div>}
          <button className="button button-violet submit-button" disabled={loading || uploading}>{loading ? <><span className="spinner"/> Reviewing resume…</> : <>Review my resume <Icon name="arrow"/></>}</button>
        </form>
        <aside className={`workspace-panel result-panel ${result ? "has-result" : ""}`}>
          {!result ? <div className="empty-result resume-empty"><div className="document-preview"><span/><span/><span/><span/><Icon name="file" size={35}/></div><span className="kicker">ROLE-SPECIFIC, NOT GENERIC</span><h2>A clearer path to a stronger draft.</h2><p>Your score, matched skills, and highest-impact edits will appear here.</p></div> : <div className="result-content">
            <div className="resume-score"><div><span>Resume score</span><strong>{result.score}<small>/100</small></strong><em>{result.level}</em></div><div className="score-bars">{[1,2,3,4,5].map((bar) => <i key={bar} className={result.score >= bar * 20 - 10 ? "filled" : ""}/>)}</div><p>{result.summary}</p></div>
            <div className="metric-row"><div><span>Keyword match</span><strong>{result.keywordScore}%</strong></div><div><span>Word count</span><strong>{result.wordCount}</strong></div><div><span>Strengths</span><strong>{result.strengths.length}</strong></div></div>
            <div className="result-section"><h3>Matched role keywords <span>{result.matchedKeywords.length}</span></h3><div className="keyword-cloud">{result.matchedKeywords.map((word) => <span className="matched" key={word}><Icon name="check" size={13}/>{word}</span>)}{result.missingKeywords.slice(0, 5).map((word) => <span key={word}>+ {word}</span>)}</div></div>
            <div className="result-section"><h3>Highest-impact edits</h3>{result.improvements.map((item, index) => <div className="improvement-item" key={item}><span>{index + 1}</span><p>{item}</p></div>)}</div>
            <div className="safe-row strengths-row">{result.strengths.slice(0, 4).map((item) => <span key={item}><Icon name="check" size={15}/>{item}</span>)}</div>
          </div>}
        </aside>
      </section><Footer />
    </main>
  )
}

export default ResumeAnalyzer
