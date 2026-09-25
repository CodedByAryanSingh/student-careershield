import { createServer } from "node:http"
import { readFile, stat } from "node:fs/promises"
import { extname, join, normalize } from "node:path"
import { fileURLToPath } from "node:url"
import { randomUUID } from "node:crypto"
import pg from "pg"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const root = fileURLToPath(new URL("..", import.meta.url))
const clientDist = join(root, "client", "dist")
const port = Number(process.env.PORT) || 8787

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/careershield'
});

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
}

const roleKeywords = {
  frontend: ["react", "javascript", "typescript", "css", "html", "api", "git", "responsive"],
  backend: ["node", "python", "api", "database", "sql", "cloud", "testing", "git"],
  data: ["python", "sql", "excel", "analytics", "statistics", "tableau", "data", "visualization"],
  design: ["figma", "prototype", "research", "wireframe", "design system", "accessibility", "portfolio"],
  marketing: ["campaign", "analytics", "content", "seo", "social", "research", "conversion", "brand"],
  product: ["roadmap", "research", "metrics", "stakeholder", "agile", "strategy", "experiments", "user"],
}

function send(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" })
  res.end(JSON.stringify(payload))
}

async function readBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > 1_000_000) throw new Error("Request body is too large")
    chunks.push(chunk)
  }
  if (!chunks.length) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"))
  } catch {
    throw new Error("Invalid JSON body")
  }
}

async function authenticate(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    send(res, 401, { error: 'Unauthorized' });
    return false;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return true;
  } catch (err) {
    send(res, 401, { error: 'Invalid token' });
    return false;
  }
}

function mapApp(row) {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    description: row.description,
    website: row.website,
    scamScore: row.scam_score,
    scamLevel: row.scam_level,
    scamConfidence: row.scam_confidence,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function analyzeScam(input) {
  const fullText = Object.values(input).join(" ").toLowerCase()
  const signals = []
  const safeSignals = []
  let score = 4

  const rules = [
    { points: 32, pattern: /registration fee|training fee|security deposit|pay first|payment required|refundable fee/, label: "Upfront payment requested", detail: "Legitimate employers do not charge candidates to secure an internship." },
    { points: 16, pattern: /urgent hiring|limited seats|apply immediately|last chance|today only/, label: "Pressure tactics detected", detail: "Artificial urgency can be used to prevent careful verification." },
    { points: 22, pattern: /guaranteed certificate|guaranteed job|100% placement|no interview/, label: "Unrealistic guarantee", detail: "Guaranteed outcomes are a common recruitment scam pattern." },
    { points: 18, pattern: /whatsapp only|telegram|contact on whatsapp|dm only/, label: "Unusual communication channel", detail: "A formal hiring process should include verifiable company communication." },
    { points: 14, pattern: /crypto|gift card|wire transfer|upi payment/, label: "Unsafe payment method", detail: "Requests for hard-to-reverse payments are a critical warning sign." },
  ]

  for (const rule of rules) {
    if (rule.pattern.test(fullText)) {
      score += rule.points
      signals.push({ label: rule.label, detail: rule.detail, severity: rule.points >= 22 ? "high" : "medium" })
    }
  }

  const email = String(input.email || "").toLowerCase()
  if (/@(gmail|yahoo|outlook|hotmail)\./.test(email)) {
    score += 17
    signals.push({ label: "Personal recruiter email", detail: "The email domain does not match a company-owned domain.", severity: "medium" })
  } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    safeSignals.push("Recruiter uses a company-style email address")
    score -= 3
  }

  const website = String(input.website || "").trim()
  if (!website) {
    score += 11
    signals.push({ label: "No company website", detail: "There is no official website to verify the employer.", severity: "medium" })
  } else if (/^https:\/\//i.test(website)) {
    safeSignals.push("A secure company website was provided")
    score -= 2
  }

  const description = String(input.description || "")
  if (description.length < 100) {
    score += 10
    signals.push({ label: "Vague job description", detail: "The post lacks enough detail about responsibilities or expectations.", severity: "low" })
  } else {
    safeSignals.push("Role description contains meaningful detail")
  }

  score = Math.max(0, Math.min(Math.round(score), 100))
  const level = score >= 70 ? "High risk" : score >= 38 ? "Review carefully" : "Low risk"

  return {
    id: randomUUID(),
    score,
    level,
    confidence: Math.min(96, 72 + Math.round(description.length / 80) + signals.length * 3),
    signals: signals.length ? signals : [{ label: "No obvious red flags", detail: "Our rules did not find a common scam pattern. Always verify independently.", severity: "low" }],
    safeSignals,
    checklist: ["Search the company and recruiter independently", "Confirm the role on the official careers page", "Never pay to apply or receive an offer"],
    analyzedAt: new Date().toISOString(),
  }
}

function analyzeResume(input) {
  const text = String(input.resumeText || "")
  const lower = text.toLowerCase()
  const targetRole = String(input.targetRole || "")
  const roleLower = targetRole.toLowerCase()
  const category = Object.keys(roleKeywords).find((key) => roleLower.includes(key)) || "frontend"
  const keywords = roleKeywords[category]
  const matchedKeywords = keywords.filter((keyword) => lower.includes(keyword))
  const missingKeywords = keywords.filter((keyword) => !lower.includes(keyword))
  const strengths = []
  const improvements = []
  let score = 18

  const checks = [
    { points: 8, found: /@|email|phone|linkedin/.test(lower), strength: "Clear contact details", improvement: "Add email, phone, and LinkedIn near the top" },
    { points: 10, found: /education|university|college|b\.tech|degree|bachelor/.test(lower), strength: "Education is easy to find", improvement: "Add a clearly labeled Education section" },
    { points: 12, found: /skills|technologies|toolkit/.test(lower), strength: "Skills are grouped for quick scanning", improvement: "Add a concise Skills section" },
    { points: 14, found: /projects?|portfolio|case stud/.test(lower), strength: "Project evidence is included", improvement: "Show 2–3 relevant projects with links and outcomes" },
    { points: 8, found: /github|behance|dribbble|portfolio/.test(lower), strength: "Proof-of-work link found", improvement: "Add a portfolio or GitHub link" },
    { points: 12, found: /built|created|led|improved|designed|implemented|launched|delivered/.test(lower), strength: "Strong action verbs communicate ownership", improvement: "Start bullets with decisive action verbs" },
    { points: 8, found: /\d+%|\d+x|\d+ users|\d+ customers|\d+ projects/.test(lower), strength: "Impact is supported with numbers", improvement: "Quantify results with percentages, scale, or time saved" },
  ]

  checks.forEach((check) => {
    if (check.found) {
      score += check.points
      strengths.push(check.strength)
    } else {
      improvements.push(check.improvement)
    }
  })

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  if (wordCount >= 180 && wordCount <= 850) score += 6
  else if (wordCount < 180) {
    score -= 18
    improvements.push("Add more evidence—your resume is currently very brief")
  } else {
    score -= 8
    improvements.push("Tighten the resume to the most relevant experience")
  }

  const keywordScore = Math.round((matchedKeywords.length / keywords.length) * 100)
  score += Math.round(keywordScore * 0.12)
  score = Math.max(0, Math.min(96, Math.round(score)))

  return {
    id: randomUUID(),
    score,
    level: score >= 80 ? "Interview ready" : score >= 60 ? "Strong foundation" : "Needs focus",
    wordCount,
    keywordScore,
    matchedKeywords,
    missingKeywords,
    strengths,
    improvements: improvements.slice(0, 5),
    summary: score >= 80 ? "Your resume is clear, evidence-led, and well aligned to the role." : score >= 60 ? "The fundamentals are here. Stronger metrics and role keywords will lift it." : "Focus on structure, proof of work, and measurable outcomes before applying.",
    analyzedAt: new Date().toISOString(),
  }
}

async function serveStatic(req, res) {
  let requestPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname)
  if (requestPath === "/") requestPath = "/index.html"
  const safePath = normalize(requestPath).replace(/^(\.\.(\/|\\|$))+/, "")
  let filePath = join(clientDist, safePath)
  try {
    const fileStat = await stat(filePath)
    if (fileStat.isDirectory()) filePath = join(filePath, "index.html")
    const content = await readFile(filePath)
    res.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream", "Cache-Control": extname(filePath) === ".html" ? "no-cache" : "public, max-age=31536000, immutable" })
    res.end(content)
  } catch {
    try {
      const content = await readFile(join(clientDist, "index.html"))
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
      res.end(content)
    } catch {
      send(res, 404, { error: "Client build not found. Run npm run build first." })
    }
  }
}

const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS")
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.setHeader("X-Frame-Options", "DENY")
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")
  if (req.method === "OPTIONS") return send(res, 204, {})

  const url = new URL(req.url, \`http://\${req.headers.host}\`)

  try {
    if (req.method === "GET" && url.pathname === "/api/health") return send(res, 200, { status: "ok", service: "CareerShield API", timestamp: new Date().toISOString() })
    
    // Auth Routes
    if (req.method === "POST" && url.pathname === "/api/auth/signup") {
      const body = await readBody(req);
      if (!body.email || !body.password) return send(res, 400, { error: "Email and password required." });
      
      const client = await pool.connect();
      try {
        const check = await client.query('SELECT id FROM users WHERE email = $1', [body.email]);
        if (check.rows.length > 0) return send(res, 400, { error: "Email already in use." });
        
        const hash = await bcrypt.hash(body.password, 10);
        const result = await client.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email', [body.email, hash]);
        
        const user = result.rows[0];
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        return send(res, 201, { user, token });
      } catch (error) {
        return send(res, 500, { error: "Database error." });
      } finally {
        client.release();
      }
    }
    
    if (req.method === "POST" && url.pathname === "/api/auth/login") {
      const body = await readBody(req);
      if (!body.email || !body.password) return send(res, 400, { error: "Email and password required." });
      
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [body.email]);
        const user = result.rows[0];
        if (!user) return send(res, 401, { error: "Invalid credentials." });
        
        const isValid = await bcrypt.compare(body.password, user.password);
        if (!isValid) return send(res, 401, { error: "Invalid credentials." });
        
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        return send(res, 200, { user: { id: user.id, email: user.email }, token });
      } catch (error) {
        return send(res, 500, { error: "Database error." });
      } finally {
        client.release();
      }
    }

    if (req.method === "POST" && url.pathname === "/api/scam/analyze") {
      const body = await readBody(req)
      if (!body.company || !body.description) return send(res, 400, { error: "Company and internship description are required." })
      return send(res, 200, analyzeScam(body))
    }
    if (req.method === "POST" && url.pathname === "/api/resume/analyze") {
      const body = await readBody(req)
      if (!body.targetRole || String(body.resumeText || "").length < 80) return send(res, 400, { error: "Add a target role and at least 80 characters of resume text." })
      return send(res, 200, analyzeResume(body))
    }

    // Authenticated API Routes
    if (req.method === "GET" && url.pathname === "/api/applications") {
      if (!(await authenticate(req, res))) return;
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC', [req.user.userId]);
        return send(res, 200, result.rows.map(mapApp));
      } finally {
        client.release();
      }
    }

    if (req.method === "POST" && url.pathname === "/api/applications") {
      if (!(await authenticate(req, res))) return;
      const body = await readBody(req)
      if (!body.company?.trim() || !body.role?.trim()) return send(res, 400, { error: "Company and role are required." })
      
      const client = await pool.connect();
      try {
        const result = await client.query(
          \`INSERT INTO applications (user_id, company, role, description, website, scam_score, scam_level, scam_confidence, status) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *\`,
          [
            req.user.userId, 
            body.company, 
            body.role, 
            body.description || null, 
            body.website || null, 
            Number(body.scamScore) || 0, 
            body.scamLevel || null, 
            body.scamConfidence || null, 
            body.status || 'Reviewing'
          ]
        );
        return send(res, 201, mapApp(result.rows[0]));
      } finally {
        client.release();
      }
    }
    
    const applicationMatch = url.pathname.match(/^\\/api\\/applications\\/([^/]+)$/)
    if (applicationMatch && req.method === "PATCH") {
      if (!(await authenticate(req, res))) return;
      const body = await readBody(req)
      
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT id FROM applications WHERE id = $1 AND user_id = $2', [applicationMatch[1], req.user.userId]);
        if (result.rows.length === 0) return send(res, 404, { error: "Application not found." });
        
        // fields mapping
        const dbFieldsMap = {
          company: 'company',
          role: 'role',
          description: 'description',
          website: 'website',
          scamScore: 'scam_score',
          scamLevel: 'scam_level',
          scamConfidence: 'scam_confidence',
          status: 'status'
        };

        const updates = [];
        const values = [];
        let idx = 1;

        for (const [jsonField, dbField] of Object.entries(dbFieldsMap)) {
          if (body[jsonField] !== undefined) {
            updates.push(\`\${dbField} = $\${idx}\`);
            values.push(body[jsonField]);
            idx++;
          }
        }

        if (updates.length > 0) {
          values.push(applicationMatch[1]);
          const updateQuery = \`UPDATE applications SET \${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $\${idx} RETURNING *\`;
          const updateResult = await client.query(updateQuery, values);
          return send(res, 200, mapApp(updateResult.rows[0]));
        } else {
          return send(res, 200, {});
        }
      } catch (error) {
        return send(res, 500, { error: "Database error." });
      } finally {
        client.release();
      }
    }

    if (applicationMatch && req.method === "DELETE") {
      if (!(await authenticate(req, res))) return;
      const client = await pool.connect();
      try {
        const result = await client.query('DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING id', [applicationMatch[1], req.user.userId]);
        if (result.rows.length === 0) return send(res, 404, { error: "Application not found." });
        return send(res, 200, { deleted: true });
      } finally {
        client.release();
      }
    }
    if (url.pathname.startsWith("/api/")) return send(res, 404, { error: "API route not found." })
    return serveStatic(req, res)
  } catch (error) {
    console.error(error)
    return send(res, error.message.includes("Invalid JSON") || error.message.includes("too large") ? 400 : 500, { error: error.message || "Something went wrong." })
  }
})

server.listen(port, () => {
  console.log(\`CareerShield API running at http://localhost:\${port}\`)
})
