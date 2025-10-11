// server/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectDB = async () => {
    console.log("fgjhgkedkl");
    
    console.log("Connecting to MongoDB...", process.env.MONGO_URI);
    
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};
