import Portfolio from "../models/portfolioModel.js";
import Asset from "../models/assetModel.js";
import Transaction from "../models/transactionModel.js";
import User from "../models/userModel.js";

export const getUserDashboard = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user._id });

    const assets = await Asset.find({ user: req.user._id });

    const transactions = await Transaction.find({ user: req.user._id })
      .populate("asset", "name symbol assetType")
      .sort({ createdAt: -1 })
      .limit(5);

    const totalInvested = assets.reduce(
      (sum, asset) => sum + asset.totalInvested,
      0
    );

    const totalPortfolioValue = assets.reduce(
      (sum, asset) => sum + asset.quantity * asset.currentPrice,
      0
    );

    const totalGainLoss = totalPortfolioValue - totalInvested;

    const gainLossPercentage =
      totalInvested === 0 ? 0 : (totalGainLoss / totalInvested) * 100;

    const allocationMap = {};

    assets.forEach((asset) => {
      const value = asset.quantity * asset.currentPrice;

      if (!allocationMap[asset.assetType]) {
        allocationMap[asset.assetType] = 0;
      }

      allocationMap[asset.assetType] += value;
    });

    const assetAllocation = Object.keys(allocationMap).map((type) => ({
      assetType: type,
      value: allocationMap[type],
    }));

    res.status(200).json({
      success: true,
      dashboard: {
        totalPortfolios: portfolios.length,
        totalAssets: assets.length,
        totalInvested,
        totalPortfolioValue,
        totalGainLoss,
        gainLossPercentage,
        assetAllocation,
        recentTransactions: transactions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data.",
      error: error.message,
    });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    const totalPortfolios = await Portfolio.countDocuments();
    const totalAssets = await Asset.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    const assets = await Asset.find();

    const totalInvested = assets.reduce(
      (sum, asset) => sum + asset.totalInvested,
      0
    );

    const totalPortfolioValue = assets.reduce(
      (sum, asset) => sum + asset.quantity * asset.currentPrice,
      0
    );

    res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalPortfolios,
        totalAssets,
        totalTransactions,
        totalInvested,
        totalPortfolioValue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard data.",
      error: error.message,
    });
  }
};