import mongoose from 'mongoose';
import { Client } from 'pg';
import neo4j from 'neo4j-driver';

// MongoDB connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('User Service: Connected to MongoDB');
  } catch (error) {
    console.error('User Service: MongoDB connection error:', error);
  }
};

// PostgreSQL connection
const connectPostgreSQL = async () => {
  const client = new Client({
    connectionString: process.env.POSTGRESQL_URI,
  });
  try {
    await client.connect();
    console.log('User Service: Connected to PostgreSQL');
    return client;
  } catch (error) {
    console.error('User Service: PostgreSQL connection error:', error);
  }
};

// Neo4j connection
const connectNeo4j = async () => {
  const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
  );
  try {
    await driver.verifyConnectivity();
    console.log('User Service: Connected to Neo4j');
    return driver;
  } catch (error) {
    console.error('User Service: Neo4j connection error:', error);
  }
};

export { connectMongoDB, connectPostgreSQL, connectNeo4j };
