import mongoose from "mongoose"
 import { ENV } from "./env.js"


 export const connecDB = async () => {
    try {
      const conn =  await mongoose.connect(ENV.DB_URL)
      console.log("✅😂connected to mongodb:",conn.connection.host)
    } catch (error) {
        console.error("❌💀error connecting to mongoDB",error);
        process.exit(1)
    }
 }