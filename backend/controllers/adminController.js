import User from "../models/userModel.js";
import Portfolio from "../models/portfolioModel.js";
import Asset from "../models/assetModel.js";
import Transaction from "../models/transactionModel.js";
import AuditLog from "../models/auditLogModel.js";
import { createAuditLog } from "../utils/auditLogger.js";

export const getAdminOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPortfolios = await Portfolio.countDocuments();
    const totalAssets = await Asset.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    res.status(200).json({
      success: true,
      overview: {
        totalUsers,
        totalPortfolios,
        totalAssets,
        totalTransactions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin overview.",
      error: error.message,
    });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs.",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
      error: error.message,
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.role === "admin") {
  return res.status(400).json({
    success: false,
    message: "Admin accounts cannot be disabled.",
  });
}

    const oldValue = {
      isActive: user.isActive,
    };

    user.isActive = isActive;
    const updatedUser = await user.save();

    await createAuditLog({
      user: req.user._id,
      action: isActive ? "USER_ENABLED_BY_ADMIN" : "USER_DISABLED_BY_ADMIN",
      entityType: "user",
      entityId: updatedUser._id,
      oldValue,
      newValue: {
        isActive: updatedUser.isActive,
      },
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      message: "User status updated successfully.",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user status.",
      error: error.message,
    });
  }
};