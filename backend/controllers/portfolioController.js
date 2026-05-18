import Portfolio from "../models/portfolioModel.js";

export const createPortfolio = async (req, res) => {
  try {
    const { name, description, riskLevel, baseCurrency } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Portfolio name is required.",
      });
    }

    const portfolio = await Portfolio.create({
      user: req.user._id,
      name,
      description,
      riskLevel,
      baseCurrency,
    });

    res.status(201).json({
      success: true,
      message: "Portfolio created successfully.",
      portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create portfolio.",
      error: error.message,
    });
  }
};

export const getMyPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: portfolios.length,
      portfolios,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch portfolios.",
      error: error.message,
    });
  }
};

export const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found.",
      });
    }

    res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch portfolio.",
      error: error.message,
    });
  }
};

export const updatePortfolio = async (req, res) => {
  try {
    const { name, description, riskLevel, baseCurrency } = req.body;

    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found.",
      });
    }

    if (name !== undefined) portfolio.name = name;
    if (description !== undefined) portfolio.description = description;
    if (riskLevel !== undefined) portfolio.riskLevel = riskLevel;
    if (baseCurrency !== undefined) portfolio.baseCurrency = baseCurrency;

    const updatedPortfolio = await portfolio.save();

    res.status(200).json({
      success: true,
      message: "Portfolio updated successfully.",
      portfolio: updatedPortfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update portfolio.",
      error: error.message,
    });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found.",
      });
    }

    await portfolio.deleteOne();

    res.status(200).json({
      success: true,
      message: "Portfolio deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete portfolio.",
      error: error.message,
    });
  }
};