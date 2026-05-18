import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Portfolio name is required"],
      trim: true,
      maxlength: [80, "Portfolio name cannot exceed 80 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },

    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    baseCurrency: {
      type: String,
      enum: ["NGN", "USD", "GBP", "EUR"],
      default: "NGN",
    },
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;