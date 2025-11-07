import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

//  Middleware: Protect routes that require authentication
export const protectRoute = [
  // ✅ First middleware: Ensures the user is authenticated via Clerk
  requireAuth(),

  // ✅ Second middleware: Verifies the authenticated user exists in MongoDB
  async (req, res, next) => {
    try {
      // 🔑 Get Clerk user ID from auth
      const clerkId = req.auth.userId; // ❗ Fixed: removed () — it's a property, not a function

      if (!clerkId)
        return res.status(401).json({ message: "Unauthorized - invalid token" });

      //  Find user in your database
      const user = await User.findOne({ clerkId }); // ❗ Fixed: typo (was clerkiId)

      if (!user)
        return res.status(404).json({ message: "User not found" });

      //  Attach user object to request for downstream use
      req.user = user;

      //  Move to the next middleware or route handler
      next();
    } catch (error) {
      console.error("Error in protectRoute middleware:", error.message); // ❗ Fixed: was capital 'Error'
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
