import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import { clerkMiddleware } from "@clerk/express";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

const app = express();
const __dirname = path.resolve();

// Parse incoming JSON requests
app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

// Apply Clerk authentication middleware
app.use(clerkMiddleware());

// Register Inngest webhook route for background functions
app.use("/api/inngest", serve({ client: inngest, functions }));

// Register chat-related API routes
app.use("/api/chat", chatRoutes);

// Register session-related API routes
app.use("/api/sessions", sessionRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ msg: "API is up and running" });
});

// Serve frontend in production mode
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Handle all other routes by serving index.html (for React Router)
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Start server and connect to MongoDB
const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    app.listen(ENV.PORT, () => {
      console.log("Server is running on port:", ENV.PORT);
    });
  } catch (error) {
    console.log("Error starting the server:", error);
  }
};

// Start the server (default port 3000 if ENV not set)
app.listen(ENV.PORT || 3000, () => {
  console.log(`Server is running on port ${ENV.PORT || 3000}`);
});
