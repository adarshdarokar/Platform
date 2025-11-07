import Session from "../models/Session.js";
import { chatClient, streamClient } from "../lib/stream.js";

/* 
=====================================================
Function: createSession
Purpose: Creates a new coding session with Stream call & chat channel
=====================================================
*/
export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    // Validate required fields
    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ message: "problem and difficulty are required" });
    }

    // Unique callId for the session
    const callId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    // Create a new session in MongoDB
    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });

    // Create a video call in Stream
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { problem, difficulty, sessionId: session._id.toString() },
      },
    });

    // Create a chat channel for the session
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/* 
=====================================================
Function: getActiveSessions
Purpose: Fetch all currently active sessions
=====================================================
*/
export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/* 
=====================================================
Function: getMyRecentSessions
Purpose: Fetch recent sessions completed by the logged-in user
=====================================================
*/
export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/* 
=====================================================
Function: getSessionById
Purpose: Fetch details of a specific session using session ID
=====================================================
*/
export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/* 
=====================================================
Function: joinSession
Purpose: Allow a user to join a specific session
=====================================================
*/
export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.participant)
      return res.status(400).json({ message: "Session is full" });

    // Add participant to session
    session.participant = userId;
    await session.save();

    // Add participant to chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/* 
=====================================================
Function: endSession
Purpose: End a session (only host can end)
=====================================================
*/
export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // Only host can end session
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only host can end the session" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // Update session status to completed
    session.status = "completed";
    await session.save();

    // Delete Stream video call
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    // Delete chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    res
      .status(200)
      .json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
