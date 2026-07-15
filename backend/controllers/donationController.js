const Donation = require("../models/Donation");

// @desc    Make a donation
// @route   POST /api/donations
// @access  Private (USER)
const createDonation = async (req, res, next) => {
  try {
    const { temple, amount, purpose, donorName, panNumber } = req.body;

    if (!temple || !amount) {
      return res
        .status(400)
        .json({ success: false, message: "Temple and amount are required" });
    }

    const donation = await Donation.create({
      user: req.user._id,
      temple,
      amount,
      purpose,
      donorName: donorName || req.user.name,
      panNumber,
    });

    res.status(201).json({
      success: true,
      message: "Thank you! Donation recorded successfully",
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's donations
// @route   GET /api/donations/my
// @access  Private
const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ user: req.user._id })
      .populate("temple", "name location")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations (admin)
// @route   GET /api/donations
// @access  Private (ADMIN, ORGANIZER)
const getAllDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find()
      .populate("user", "name email")
      .populate("temple", "name")
      .sort({ createdAt: -1 });

    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

    res.status(200).json({
      success: true,
      count: donations.length,
      totalAmount,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createDonation, getMyDonations, getAllDonations };
