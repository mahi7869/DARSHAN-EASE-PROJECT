const DarshanSlot = require("../models/DarshanSlot");
const Temple = require("../models/Temple");

// @desc    Get all slots for a temple (optionally filter by date)
// @route   GET /api/slots/temple/:templeId
// @access  Public
const getSlotsByTemple = async (req, res, next) => {
  try {
    const { date } = req.query;
    const query = { temple: req.params.templeId, isActive: true };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    } else {
      // default: only upcoming slots
      query.date = { $gte: new Date(new Date().setHours(0, 0, 0, 0)) };
    }

    const slots = await DarshanSlot.find(query).sort({ date: 1, startTime: 1 });
    res.status(200).json({ success: true, count: slots.length, data: slots });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single slot
// @route   GET /api/slots/:id
// @access  Public
const getSlotById = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.findById(req.params.id).populate("temple", "name location");
    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found" });
    }
    res.status(200).json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new darshan slot
// @route   POST /api/slots
// @access  Private (ADMIN, ORGANIZER)
const createSlot = async (req, res, next) => {
  try {
    const temple = await Temple.findById(req.body.temple);
    if (!temple) {
      return res.status(404).json({ success: false, message: "Temple not found" });
    }
    const slot = await DarshanSlot.create(req.body);
    res.status(201).json({ success: true, message: "Slot created successfully", data: slot });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a slot
// @route   PUT /api/slots/:id
// @access  Private (ADMIN, ORGANIZER)
const updateSlot = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found" });
    }
    res.status(200).json({ success: true, message: "Slot updated", data: slot });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a slot
// @route   DELETE /api/slots/:id
// @access  Private (ADMIN, ORGANIZER)
const deleteSlot = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.findByIdAndDelete(req.params.id);
    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found" });
    }
    res.status(200).json({ success: true, message: "Slot deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSlotsByTemple, getSlotById, createSlot, updateSlot, deleteSlot };
