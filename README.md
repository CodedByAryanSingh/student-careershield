# CareerShield

A full-stack career safety workspace for students. CareerShield verifies internship listings for common scam signals, scores resumes against a target role, and keeps applications organized in a persistent pipeline.

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm run dev
```

The React app runs at `http://localhost:5173` and proxies API traffic to `http://localhost:8787`.

## Production

```bash
npm run build
npm start
```

The Node server serves the production client and API from `http://localhost:8787`.

## API

- `GET /api/health`
- `POST /api/scam/analyze`
- `POST /api/resume/analyze`
- `GET /api/applications`
- `POST /api/applications`
- `PATCH /api/applications/:id`
- `DELETE /api/applications/:id`

Application data is persisted to `server/data/applications.json`. The included records are starter demo data and can be edited or removed in the app.
