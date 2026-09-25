import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/careershield'
});

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        company VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        description TEXT,
        website VARCHAR(255),
        scam_score INTEGER DEFAULT 0,
        scam_level VARCHAR(50),
        scam_confidence INTEGER,
        status VARCHAR(50) DEFAULT 'Reviewing',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE
      );
    `);
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Failed to initialize database:", err);
  } finally {
    client.release();
    pool.end();
  }
}

initDb();
