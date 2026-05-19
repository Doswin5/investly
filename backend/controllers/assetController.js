import Asset from "../models/assetModel.js";
import Portfolio from "../models/portfolioModel.js";
import { createAuditLog } from "../utils/auditLogger.js";

export const addAssetToPortfolio = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { name, symbol, assetType, currentPrice } = req.body;

    if (!name || !symbol || !assetType) {
      return res.status(400).json({
        success: false,
        message: "Asset name, symbol, and asset type are required.",
      });
    }

    if (currentPrice !== undefined && Number(currentPrice) < 0) {
      return res.status(400).json({
        success: false,
        message: "Current price cannot be negative.",
      });
    }

    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      user: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found.",
      });
    }

    const existingAsset = await Asset.findOne({
      portfolio: portfolioId,
      symbol: symbol.toUpperCase(),
      user: req.user._id,
    });

    if (existingAsset) {
      return res.status(409).json({
        success: false,
        message: "Asset already exists in this portfolio.",
      });
    }

    const asset = await Asset.create({
      user: req.user._id,
      portfolio: portfolioId,
      name,
      symbol,
      assetType,
      currentPrice: currentPrice || 0,
    });

    await createAuditLog({
  user: req.user._id,
  action: "ASSET_ADDED",
  entityType: "asset",
  entityId: asset._id,
  newValue: asset,
  ipAddress: req.ip,
});

    res.status(201).json({
      success: true,
      message: "Asset added successfully.",
      asset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add asset.",
      error: error.message,
    });
  }
};

export const getPortfolioAssets = async (req, res) => {
  try {
    const { portfolioId } = req.params;

    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      user: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found.",
      });
    }

    const assets = await Asset.find({
      portfolio: portfolioId,
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assets.length,
      assets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch assets.",
      error: error.message,
    });
  }
};

export const updateAssetPrice = async (req, res) => {
  try {
    const { assetId } = req.params;
    const { currentPrice } = req.body;

    if (currentPrice === undefined || Number(currentPrice) < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid current price is required.",
      });
    }

    const asset = await Asset.findOne({
      _id: assetId,
      user: req.user._id,
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found.",
      });
    }

    const oldValue = {
  currentPrice: asset.currentPrice,
};

    asset.currentPrice = Number(currentPrice);

    const updatedAsset = await asset.save();

    await createAuditLog({
  user: req.user._id,
  action: "ASSET_PRICE_UPDATED",
  entityType: "asset",
  entityId: asset._id,
  oldValue,
  newValue: {
    currentPrice: updatedAsset.currentPrice,
  },
  ipAddress: req.ip,
});

    res.status(200).json({
      success: true,
      message: "Asset price updated successfully.",
      asset: updatedAsset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update asset price.",
      error: error.message,
    });
  }
};

export const deleteAsset = async (req, res) => {
  try {
    const { assetId } = req.params;

    const asset = await Asset.findOne({
      _id: assetId,
      user: req.user._id,
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found.",
      });
    }

    if (asset.quantity > 0) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot delete an asset with active holdings. Sell the holdings first.",
      });
    }

    const oldValue = asset.toObject();

    await asset.deleteOne();

    await createAuditLog({
  user: req.user._id,
  action: "ASSET_DELETED",
  entityType: "asset",
  entityId: asset._id,
  oldValue,
  ipAddress: req.ip,
});

    res.status(200).json({
      success: true,
      message: "Asset deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete asset.",
      error: error.message,
    });
  }
};