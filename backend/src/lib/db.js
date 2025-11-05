import mongoose from "mongoose"
 import { ENV } from "./env.js"


 export const connecDB = async () => {
    try {
      if(!ENV.DB_URL){
throw new Error("DB_URL is not defined is env")
      }
      const conn =  await mongoose.connect(ENV.DB_URL)
      console.log("✅😂connected to mongodb:",conn.connection.host)
    } catch (error) {
        console.error("❌💀error connecting to mongoDB",error);
        process.exit(1)
    }
 }