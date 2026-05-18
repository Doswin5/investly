import express from "express";
import {
  createPortfolio,
  getMyPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
} from "../controllers/portfolioController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createPortfolio).get(getMyPortfolios);

router
  .route("/:id")
  .get(getPortfolioById)
  .patch(updatePortfolio)
  .delete(deletePortfolio);

export default router;