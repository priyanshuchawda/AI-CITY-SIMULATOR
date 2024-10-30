const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/citySimulator',
});

async function connectToPostgreSQL() {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL');
    return client;
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
}

module.exports = { connectToPostgreSQL };