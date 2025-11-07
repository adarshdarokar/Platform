import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createSession,
  endSession,
  getActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSession,
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/", createSession, createSession);
router.get("/active", protectRoute, getActiveSessions);
router.get("/my-recent", protectRoute, getMyRecentSessions);

router.get("/:Id", protectRoute, getSessionById);
router.get("/:Id/join", protectRoute, joinSession);
router.post("/:id/end", protectRoute, endSession);

export default router;
