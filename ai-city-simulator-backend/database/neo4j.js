const neo4j = require('neo4j-driver');

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'password';

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function connectToNeo4j() {
  try {
    const session = driver.session();
    console.log('Connected to Neo4j');
    return session;
  } catch (error) {
    console.error('Neo4j connection error:', error);
    process.exit(1);
  }
}

module.exports = { connectToNeo4j };