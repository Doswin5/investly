import express from "express";
import {
  getUserDashboard,
  getAdminDashboard,
} from "../controllers/dashboardController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user", protect, getUserDashboard);
router.get("/admin", protect, adminOnly, getAdminDashboard);

export default router;