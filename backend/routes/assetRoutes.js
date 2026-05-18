import express from "express";
import {
  addAssetToPortfolio,
  getPortfolioAssets,
  updateAssetPrice,
  deleteAsset,
} from "../controllers/assetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/portfolios/:portfolioId/assets")
  .post(addAssetToPortfolio)
  .get(getPortfolioAssets);

router.patch("/assets/:assetId/price", updateAssetPrice);
router.delete("/assets/:assetId", deleteAsset);

export default router;