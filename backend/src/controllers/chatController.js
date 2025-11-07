import { chatClient } from "../lib/stream.js";

// Controller: getStreamToken
// Purpose: Generates a Stream Chat token for the logged-in user
export async function getStreamToken(req, res) {
  try {
    // 🔑 Create a Stream chat token using the user's unique Clerk ID
    // Note: Make sure it's req.user._id (MongoDB ID) or req.user.clerkId (Clerk ID) — depends on your setup
    const token = chatClient.createToken(req.user._id);

    // ✅ Send back the token and some basic user info
    res.status(200).json({
      token,                        // Stream chat token
      userId: req.user.clerkId,     // Clerk user ID (used in Stream)
      userName: req.user.name,      // Display name of the user
      userImage: req.user.image     // Profile image of the user
    });

  } catch (error) {
    // ⚠️ Catch and log any errors that occur during token generation
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
