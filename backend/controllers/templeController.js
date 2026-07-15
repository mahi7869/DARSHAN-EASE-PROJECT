const Temple = require("../models/Temple");
const DarshanSlot = require("../models/DarshanSlot");

// @desc    Get all temples (with optional search / filter / pagination)
// @route   GET /api/temples
// @access  Public
const getTemples = async (req, res, next) => {
  try {
    const { search, city, page = 1, limit = 9 } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }
    if (city) {
      query["location.city"] = { $regex: city, $options: "i" };
    }

    const temples = await Temple.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Temple.countDocuments(query);

    res.status(200).json({
      success: true,
      count: temples.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: temples,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single temple by ID
// @route   GET /api/temples/:id
// @access  Public
const getTempleById = async (req, res, next) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) {
      return res.status(404).json({ success: false, message: "Temple not found" });
    }
    res.status(200).json({ success: true, data: temple });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new temple
// @route   POST /api/temples
// @access  Private (ADMIN, ORGANIZER)
const createTemple = async (req, res, next) => {
  try {
    const temple = await Temple.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, message: "Temple added successfully", data: temple });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a temple
// @route   PUT /api/temples/:id
// @access  Private (ADMIN, ORGANIZER)
const updateTemple = async (req, res, next) => {
  try {
    const temple = await Temple.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!temple) {
      return res.status(404).json({ success: false, message: "Temple not found" });
    }
    res.status(200).json({ success: true, message: "Temple updated", data: temple });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete (deactivate) a temple
// @route   DELETE /api/temples/:id
// @access  Private (ADMIN)
const deleteTemple = async (req, res, next) => {
  try {
    const temple = await Temple.findByIdAndDelete(req.params.id);
    if (!temple) {
      return res.status(404).json({ success: false, message: "Temple not found" });
    }
    // Also remove related slots
    await DarshanSlot.deleteMany({ temple: req.params.id });
    res.status(200).json({ success: true, message: "Temple deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTemples, getTempleById, createTemple, updateTemple, deleteTemple };
