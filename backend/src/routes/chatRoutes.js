import express from "express";
import { getStreamToken } from "../controllers/chatController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router(); // <-- () lagana bhool gaye the

// ✅ correct method: .get(), not .length()
router.get("/token", protectRoute, getStreamToken);

export default router;
