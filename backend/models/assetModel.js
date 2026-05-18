import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    portfolio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Asset name is required"],
      trim: true,
    },

    symbol: {
      type: String,
      required: [true, "Asset symbol is required"],
      trim: true,
      uppercase: true,
    },

    assetType: {
      type: String,
      enum: ["stock", "bond", "mutual_fund", "fixed_income", "cash"],
      required: [true, "Asset type is required"],
    },

    quantity: {
      type: Number,
      default: 0,
      min: [0, "Quantity cannot be negative"],
    },

    averageBuyPrice: {
      type: Number,
      default: 0,
      min: [0, "Average buy price cannot be negative"],
    },

    currentPrice: {
      type: Number,
      default: 0,
      min: [0, "Current price cannot be negative"],
    },

    totalInvested: {
      type: Number,
      default: 0,
      min: [0, "Total invested cannot be negative"],
    },

    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

assetSchema.virtual("currentValue").get(function () {
  return this.quantity * this.currentPrice;
});

assetSchema.virtual("gainLoss").get(function () {
  return this.currentValue - this.totalInvested;
});

assetSchema.virtual("gainLossPercentage").get(function () {
  if (this.totalInvested === 0) return 0;
  return (this.gainLoss / this.totalInvested) * 100;
});

assetSchema.set("toJSON", { virtuals: true });
assetSchema.set("toObject", { virtuals: true });

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;