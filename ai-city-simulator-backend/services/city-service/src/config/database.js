import mongoose from 'mongoose';
import { Client } from 'pg';
import neo4j from 'neo4j-driver';

// MongoDB connection for City Service
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('City Service: Connected to MongoDB');
  } catch (error) {
    console.error('City Service: MongoDB connection error:', error);
  }
};

// PostgreSQL connection for City Service
export const connectPostgreSQL = async () => {
  const client = new Client({
    connectionString: process.env.POSTGRESQL_URI,
  });
  try {
    await client.connect();
    console.log('City Service: Connected to PostgreSQL');
    return client;
  } catch (error) {
    console.error('City Service: PostgreSQL connection error:', error);
  }
};

// Neo4j connection for City Service
export const connectNeo4j = async () => {
  const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
  );
  try {
    await driver.verifyConnectivity();
    console.log('City Service: Connected to Neo4j');
    return driver;
  } catch (error) {
    console.error('City Service: Neo4j connection error:', error);
  }
};

// Disconnection methods for City Service
export const disconnectMongoDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('City Service: Disconnected from MongoDB');
  } catch (error) {
    console.error('City Service: MongoDB disconnection error:', error);
  }
};

export const disconnectPostgreSQL = async (client) => {
  try {
    await client.end();
    console.log('City Service: Disconnected from PostgreSQL');
  } catch (error) {
    console.error('City Service: PostgreSQL disconnection error:', error);
  }
};

export const disconnectNeo4j = async (driver) => {
  try {
    await driver.close();
    console.log('City Service: Disconnected from Neo4j');
  } catch (error) {
    console.error('City Service: Neo4j disconnection error:', error);
  }
};
