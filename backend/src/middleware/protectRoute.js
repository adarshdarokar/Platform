import { requireAuth } from "@clerk/express";

import User from "../models/User.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId)
        return res.status(401).json({ msg: "Unauthorized - invalid token" });

      const user = await User.findOne({ clerkiId });

      if (!user) return res.status(404).json({ message: "User nor found" });
      req.user = user;
        
      next();


    } catch (error) {
      console.error("Error in protectroute middleware", Error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
