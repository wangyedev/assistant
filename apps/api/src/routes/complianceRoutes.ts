import { Router } from "express";
import { searchComplianceInDB } from "../functions/complianceSearch";
import { ComplianceModel } from "../models/compliance";

const router = Router();

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const results = await searchComplianceInDB(query as string);
    res.json({ results });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

router.post("/request", async (req, res) => {
  try {
    const {
      shortName,
      longName,
      briefDescription,
      regions,
      industries,
      status,
    } = req.body;

    // Validate required fields
    if (
      !shortName ||
      !longName ||
      !briefDescription ||
      !regions ||
      !industries
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if compliance with same shortName already exists
    const existing = await ComplianceModel.findOne({ shortName });
    if (existing) {
      return res.status(409).json({
        message: "A compliance standard with this short name already exists",
      });
    }

    // Create new compliance request
    const compliance = await ComplianceModel.create({
      shortName,
      longName,
      briefDescription,
      regions,
      industries,
      status: status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json(compliance);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

export default router;
