import mongoose from "mongoose";

const complianceSchema = new mongoose.Schema({
  shortName: {
    type: String,
    required: true,
    unique: true,
  },
  longName: {
    type: String,
    required: true,
  },
  briefDescription: {
    type: String,
    required: true,
  },
  regions: {
    type: [String],
    required: true,
  },
  industries: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "pending", "inactive"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamps on save
complianceSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const ComplianceModel = mongoose.model("Compliance", complianceSchema);
