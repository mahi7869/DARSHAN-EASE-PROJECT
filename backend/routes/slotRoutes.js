const express = require("express");
const router = express.Router();
const {
  getSlotsByTemple,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot,
} = require("../controllers/slotController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.get("/temple/:templeId", getSlotsByTemple);
router.get("/:id", getSlotById);
router.post("/", protect, authorize("ADMIN", "ORGANIZER"), createSlot);
router.put("/:id", protect, authorize("ADMIN", "ORGANIZER"), updateSlot);
router.delete("/:id", protect, authorize("ADMIN", "ORGANIZER"), deleteSlot);

module.exports = router;
