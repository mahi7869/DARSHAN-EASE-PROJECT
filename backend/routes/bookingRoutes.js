const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/", protect, authorize("ADMIN", "ORGANIZER"), getAllBookings);
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;
