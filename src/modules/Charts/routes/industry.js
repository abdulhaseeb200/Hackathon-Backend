const express = require("express");
const router = express.Router();
const beneficiarySchema = require("../../Beneficiary/models/beneficiarySchema");

// 📌 GET: Top 5 Industries by Count
router.get("/top5", async (req, res) => {
  try {
    const industries = await beneficiarySchema.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json(industries);
  } catch (error) {
    console.error("Error fetching top industries:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
