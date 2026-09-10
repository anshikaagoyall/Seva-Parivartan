import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sevaparivartan';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    try {
      memoryServer = await MongoMemoryServer.create({
        binary: { version: '7.0.14' },
        instance: { dbName: 'sevaparivartan' },
      });

      const conn = await mongoose.connect(memoryServer.getUri(), {
        dbName: 'sevaparivartan',
      });

      console.log(`[Database] MongoMemoryServer Connected Successfully: ${conn.connection.host}`);
      return conn;
    } catch (memoryError) {
      console.warn(`[Database] Local MongoDB connection failed (${error.message}). MongoMemoryServer fallback also failed (${memoryError.message}).`);
      return null;
    }
  }
};

export const disconnectDB = async () => {
  if (memoryServer) {
    await mongoose.disconnect();
    await memoryServer.stop();
    memoryServer = null;
  } else {
    await mongoose.disconnect();
  }
};
