import { Link } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Icon from "../components/Icon"

const tools = [
  { icon: "shield", number: "01", title: "Know before you apply", text: "Spot payment requests, fake urgency, unsafe contact details, and unverifiable companies in seconds.", link: "/scam-detector", action: "Verify an internship", tone: "lime" },
  { icon: "file", number: "02", title: "Make every word count", text: "Get a role-specific resume score, identify missing ATS keywords, and sharpen the evidence recruiters notice.", link: "/resume-analyzer", action: "Review your resume", tone: "violet" },
  { icon: "trend", number: "03", title: "Turn applying into progress", text: "Keep deadlines, resume versions, risk scores, and interview stages together in one calm workspace.", link: "/application-tracker", action: "Organize applications", tone: "peach" },
]

function Home() {
  return (
    <main>
      <Navbar />
      <section className="hero-section">
        <div className="hero-grid container">
          <div className="hero-copy reveal">
            <div className="eyebrow"><span className="pulse-dot" /> Built for ambitious students</div>
            <h1>Your career deserves a <em>safer</em> start.</h1>
            <p>Verify internships, strengthen your resume, and keep every application moving—without second-guessing your next step.</p>
            <div className="hero-actions">
              <Link to="/scam-detector" className="button button-dark">Check an internship <Icon name="arrow" /></Link>
              <Link to="/dashboard" className="text-link">Explore your dashboard <Icon name="chevron" size={16} /></Link>
            </div>
            <div className="trust-row">
              <div className="avatar-stack"><span>AK</span><span>SM</span><span>RJ</span><span>+2k</span></div>
              <div><strong>2,000+ students</strong><small>applying with more confidence</small></div>
            </div>
          </div>

          <div className="hero-visual" aria-label="CareerShield analysis preview">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="hero-shield"><Icon name="shield" size={68} /><span className="scan-line" /></div>
            <div className="floating-card risk-card">
              <div className="floating-icon coral"><Icon name="warning" /></div>
              <div><small>Risk scan complete</small><strong>Low risk · 08/100</strong></div>
              <span className="status-dot" />
            </div>
            <div className="floating-card match-card">
              <div className="score-mini">84</div>
              <div><small>Resume match</small><strong>Interview ready</strong></div>
            </div>
            <div className="floating-chip chip-one"><Icon name="check" size={15} /> Domain verified</div>
            <div className="floating-chip chip-two"><Icon name="sparkles" size={15} /> 6 skills matched</div>
            <span className="spark spark-a">✦</span><span className="spark spark-b">✦</span>
          </div>
        </div>
      </section>

      <div className="signal-strip">
        <div className="signal-track">
          <span><Icon name="check" /> No upfront fees</span><b>✦</b><span><Icon name="check" /> Verified companies</span><b>✦</b><span><Icon name="check" /> Stronger resumes</span><b>✦</b><span><Icon name="check" /> Organized applications</span><b>✦</b>
          <span><Icon name="check" /> No upfront fees</span><b>✦</b><span><Icon name="check" /> Verified companies</span><b>✦</b><span><Icon name="check" /> Stronger resumes</span><b>✦</b><span><Icon name="check" /> Organized applications</span><b>✦</b>
        </div>
      </div>

      <section className="section container">
        <div className="section-heading">
          <div><span className="kicker">YOUR CAREER CONTROL CENTER</span><h2>Three tools. One clear next move.</h2></div>
          <p>CareerShield turns scattered decisions into a focused, safer job search—from the first listing to the final interview.</p>
        </div>
        <div className="tool-grid">
          {tools.map((tool) => (
            <article className={`tool-card ${tool.tone}`} key={tool.title}>
              <div className="tool-card-top"><span className="tool-icon"><Icon name={tool.icon} size={27} /></span><span>{tool.number}</span></div>
              <h3>{tool.title}</h3><p>{tool.text}</p>
              <Link to={tool.link}>{tool.action} <Icon name="arrow" size={18} /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="proof-section">
        <div className="container proof-grid">
          <div className="proof-copy">
            <span className="kicker kicker-light">DESIGNED AROUND REAL RED FLAGS</span>
            <h2>Confidence comes from knowing what to look for.</h2>
            <p>We translate common recruitment scam patterns into plain-language signals you can act on.</p>
            <Link to="/scam-detector" className="button button-lime">Run a free check <Icon name="arrow" /></Link>
          </div>
          <div className="check-list">
            {["Requests for fees or deposits", "Personal recruiter email domains", "Pressure tactics and false urgency", "Promises that sound too good"].map((item, index) => (
              <div key={item}><span>0{index + 1}</span><strong>{item}</strong><Icon name="check" /></div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section container">
        <div className="cta-card">
          <div><span className="kicker">START WITH CERTAINTY</span><h2>One check could save you weeks of doubt.</h2></div>
          <Link to="/scam-detector" className="button button-dark">Check an internship <Icon name="arrow" /></Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}

export default Home
