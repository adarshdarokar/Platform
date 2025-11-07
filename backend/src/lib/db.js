import mongoose from "mongoose";
import { ENV } from "./env.js";

//  Function: connectDB
// Purpose: Connects your app to MongoDB using Mongoose
export const connectDB = async () => {
  try {
    // ⚠️ Check if the DB_URL exists in your environment variables
    if (!ENV.DB_URL) {
      throw new Error("DB_URL is not defined in env");
    }

    // 🔗 Attempt to connect to MongoDB using Mongoose
    const conn = await mongoose.connect(ENV.DB_URL);

    // ✅ Log success message with connected host name
    console.log("✅ Connected to MongoDB:", conn.connection.host);

  } catch (error) {
    // ❌ If connection fails, log error and stop the app
    console.error("❌💀 Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with failure code
  }
};
