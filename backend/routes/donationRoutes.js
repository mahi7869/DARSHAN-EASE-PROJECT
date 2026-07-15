const express = require("express");
const router = express.Router();
const {
  createDonation,
  getMyDonations,
  getAllDonations,
} = require("../controllers/donationController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.post("/", protect, createDonation);
router.get("/my", protect, getMyDonations);
router.get("/", protect, authorize("ADMIN", "ORGANIZER"), getAllDonations);

module.exports = router;
