import express from "express";
import {
  getAdminOverview,
  getAuditLogs,
  getAllUsers,
  updateUserStatus,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/overview", getAdminOverview);
router.get("/audit-logs", getAuditLogs);
router.get("/users", getAllUsers);
router.patch("/users/:id/status", updateUserStatus);

export default router;