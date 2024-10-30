import mongoose from 'mongoose';

// Teardown process
export default async () => {
  await mongoose.disconnect();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Force close all connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close(true);
  }
};
