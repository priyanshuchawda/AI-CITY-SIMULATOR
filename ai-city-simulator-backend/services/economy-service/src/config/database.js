import mongoose from 'mongoose';
import { Client } from 'pg';
import neo4j from 'neo4j-driver';

// MongoDB connection
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Economy Service: Connected to MongoDB');
  } catch (error) {
    console.error('Economy Service: MongoDB connection error:', error);
  }
};

// PostgreSQL connection
export const connectPostgreSQL = async () => {
  const client = new Client({
    connectionString: process.env.POSTGRESQL_URI,
  });
  try {
    await client.connect();
    console.log('Economy Service: Connected to PostgreSQL');
    return client;
  } catch (error) {
    console.error('Economy Service: PostgreSQL connection error:', error);
  }
};

// Neo4j connection
export const connectNeo4j = async () => {
  const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
  );
  try {
    await driver.verifyConnectivity();
    console.log('Economy Service: Connected to Neo4j');
    return driver;
  } catch (error) {
    console.error('Economy Service: Neo4j connection error:', error);
  }
};
