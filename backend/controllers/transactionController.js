import Asset from "../models/assetModel.js";
import Portfolio from "../models/portfolioModel.js";
import Transaction from "../models/transactionModel.js";
import { createAuditLog } from "../utils/auditLogger.js";

export const buyAsset = async (req, res) => {
  try {
    const { portfolioId, assetId, quantity, price, note } = req.body;

    if (!portfolioId || !assetId || !quantity || !price) {
      return res.status(400).json({
        success: false,
        message: "Portfolio, asset, quantity, and price are required.",
      });
    }

    if (Number(quantity) <= 0 || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity and price must be greater than 0.",
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

    const asset = await Asset.findOne({
      _id: assetId,
      portfolio: portfolioId,
      user: req.user._id,
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found in this portfolio.",
      });
    }

    const buyQuantity = Number(quantity);
    const buyPrice = Number(price);
    const totalAmount = buyQuantity * buyPrice;

    const oldQuantity = asset.quantity;
    const oldTotalInvested = asset.totalInvested;

    const newQuantity = oldQuantity + buyQuantity;
    const newTotalInvested = oldTotalInvested + totalAmount;

    if (!Number.isFinite(buyQuantity) || !Number.isFinite(buyPrice)) {
      return res.status(400).json({
        success: false,
        message: "Quantity and price must be valid numbers.",
      });
    }

    if (buyQuantity > 100000000 || buyPrice > 1000000000) {
      return res.status(400).json({
        success: false,
        message: "Quantity or price is too large.",
      });
    }

    asset.quantity = newQuantity;
    asset.totalInvested = newTotalInvested;
    asset.averageBuyPrice = newTotalInvested / newQuantity;
    asset.currentPrice = buyPrice;
    asset.isClosed = false;

    await asset.save();

    const transaction = await Transaction.create({
      user: req.user._id,
      portfolio: portfolioId,
      asset: assetId,
      type: "buy",
      quantity: buyQuantity,
      price: buyPrice,
      totalAmount,
      note,
    });

    await createAuditLog({
      user: req.user._id,
      action: "BUY_TRANSACTION_CREATED",
      entityType: "transaction",
      entityId: transaction._id,
      newValue: {
        transaction,
        updatedAsset: asset,
      },
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: "Buy transaction recorded successfully.",
      transaction,
      asset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to record buy transaction.",
      error: error.message,
    });
  }
};

export const sellAsset = async (req, res) => {
  try {
    const { portfolioId, assetId, quantity, price, note } = req.body;

    if (!portfolioId || !assetId || !quantity || !price) {
      return res.status(400).json({
        success: false,
        message: "Portfolio, asset, quantity, and price are required.",
      });
    }

    if (Number(quantity) <= 0 || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity and price must be greater than 0.",
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

    const asset = await Asset.findOne({
      _id: assetId,
      portfolio: portfolioId,
      user: req.user._id,
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found in this portfolio.",
      });
    }

    const sellQuantity = Number(quantity);
    const sellPrice = Number(price);

    if (sellQuantity > asset.quantity) {
      return res.status(400).json({
        success: false,
        message: "You cannot sell more than your current holding.",
      });
    }

    const totalAmount = sellQuantity * sellPrice;

    const costBasisSold = asset.averageBuyPrice * sellQuantity;

    if (!Number.isFinite(sellQuantity) || !Number.isFinite(sellPrice)) {
      return res.status(400).json({
        success: false,
        message: "Quantity and price must be valid numbers.",
      });
    }

    if (sellQuantity > 100000000 || sellPrice > 1000000000) {
      return res.status(400).json({
        success: false,
        message: "Quantity or price is too large.",
      });
    }

    asset.quantity = asset.quantity - sellQuantity;
    asset.totalInvested = asset.totalInvested - costBasisSold;

    if (asset.quantity === 0) {
      asset.averageBuyPrice = 0;
      asset.totalInvested = 0;
      asset.isClosed = true;
    }

    asset.currentPrice = sellPrice;

    await asset.save();

    const transaction = await Transaction.create({
      user: req.user._id,
      portfolio: portfolioId,
      asset: assetId,
      type: "sell",
      quantity: sellQuantity,
      price: sellPrice,
      totalAmount,
      note,
    });

    await createAuditLog({
      user: req.user._id,
      action: "SELL_TRANSACTION_CREATED",
      entityType: "transaction",
      entityId: transaction._id,
      newValue: {
        transaction,
        updatedAsset: asset,
      },
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: "Sell transaction recorded successfully.",
      transaction,
      asset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to record sell transaction.",
      error: error.message,
    });
  }
};

export const getPortfolioTransactions = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid portfolio ID.",
      });
    }
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

    const transactions = await Transaction.find({
      portfolio: portfolioId,
      user: req.user._id,
    })
      .populate("asset", "name symbol assetType")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions.",
      error: error.message,
    });
  }
};
