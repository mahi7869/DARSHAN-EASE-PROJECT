const Booking = require("../models/Booking");
const DarshanSlot = require("../models/DarshanSlot");

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (USER)
const createBooking = async (req, res, next) => {
  try {
    const { slotId, numberOfPeople, visitorNames } = req.body;

    if (!slotId || !numberOfPeople) {
      return res.status(400).json({
        success: false,
        message: "slotId and numberOfPeople are required",
      });
    }

    const slot = await DarshanSlot.findById(slotId);
    if (!slot || !slot.isActive) {
      return res.status(404).json({ success: false, message: "Darshan slot not found" });
    }

    const availableCount = slot.totalCapacity - slot.bookedCount;
    if (numberOfPeople > availableCount) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableCount} tickets available for this slot`,
      });
    }

    const totalAmount = slot.pricePerTicket * numberOfPeople;

    const booking = await Booking.create({
      user: req.user._id,
      temple: slot.temple,
      slot: slot._id,
      numberOfPeople,
      visitorNames: visitorNames || [],
      totalAmount,
    });

    slot.bookedCount += numberOfPeople;
    await slot.save();

    const populatedBooking = await booking.populate([
      { path: "temple", select: "name location imageUrl" },
      { path: "slot", select: "date startTime endTime slotType" },
    ]);

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("temple", "name location imageUrl")
      .populate("slot", "date startTime endTime slotType")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private (ADMIN, ORGANIZER)
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("temple", "name")
      .populate("slot", "date startTime endTime")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (owner or ADMIN)
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Only the booking owner or an admin can cancel
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== "ADMIN"
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this booking" });
    }

    if (booking.bookingStatus === "CANCELLED") {
      return res.status(400).json({ success: false, message: "Booking is already cancelled" });
    }

    booking.bookingStatus = "CANCELLED";
    await booking.save();

    // Free up the slot capacity
    const slot = await DarshanSlot.findById(booking.slot);
    if (slot) {
      slot.bookedCount = Math.max(slot.bookedCount - booking.numberOfPeople, 0);
      await slot.save();
    }

    res.status(200).json({ success: true, message: "Booking cancelled successfully", data: booking });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, cancelBooking };
