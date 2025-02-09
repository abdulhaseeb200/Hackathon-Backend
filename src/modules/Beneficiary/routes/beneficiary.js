const express = require("express");
const Beneficiary = require("../models/beneficiarySchema");

const router = express.Router();

// Register Beneficiary
router.post("/register", async (req, res) => {
  const { name, cnic, contact, address, purpose, department, date } = req.body;

  try {
    const exists = await Beneficiary.findOne({ cnic: cnic.trim().toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "Beneficiary already registered" });
    }

    const beneficiary = new Beneficiary({
      name,
      cnic: cnic.trim().toLowerCase(),
      contact,
      address,
      purpose,
      department,
      date: date ? new Date(date) : new Date(),
      status: "Pending" // Default status
    });

    await beneficiary.save();
    res.status(201).json({ message: "Beneficiary registered successfully" });
  } catch (error) {
    console.error("Error during beneficiary registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Search Beneficiary by CNIC
router.get("/search/:cnic", async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findOne({ cnic: req.params.cnic.trim().toLowerCase() });
    if (!beneficiary) {
      return res.status(404).json({ message: "Beneficiary not found" });
    }
    res.json(beneficiary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reports API
router.get("/reports", async (req, res) => {
  try {
    let { fromDate, toDate, department, status } = req.query;
    let query = {};

    if (fromDate && toDate) {
      query.date = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    }

    if (department) {
      query.department = { $regex: new RegExp("^" + department.trim() + "$", "i") };
    }

    if (status) {
      query.status = status;
    }

    const beneficiaries = await Beneficiary.find(query).sort({ date: -1 });

    const total = await Beneficiary.countDocuments(query);
    const completed = await Beneficiary.countDocuments({ ...query, status: "Completed" });
    const pending = await Beneficiary.countDocuments({ ...query, status: "Pending" });
    const inProgress = await Beneficiary.countDocuments({ ...query, status: "In Progress" });

    res.json({
      total,
      completed,
      pending,
      inProgress,
      beneficiaries
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update Beneficiary Status and Remarks
router.put("/update-status", async (req, res) => {
  const { cnic, status, remarks } = req.body;

  if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const beneficiary = await Beneficiary.findOne({ cnic: cnic.trim().toLowerCase() });
    if (!beneficiary) {
      return res.status(404).json({ message: "Beneficiary not found" });
    }

    beneficiary.status = status;
    if (remarks) beneficiary.remarks = remarks;
    
    await beneficiary.save();
    res.json({ message: "Beneficiary status and remarks updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
