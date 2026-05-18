import express from "express";
import {
  buyAsset,
  sellAsset,
  getPortfolioTransactions,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/buy", buyAsset);
router.post("/sell", sellAsset);
router.get("/:portfolioId", getPortfolioTransactions);

export default router;