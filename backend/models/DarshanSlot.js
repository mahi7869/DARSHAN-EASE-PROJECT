const mongoose = require("mongoose");

const darshanSlotSchema = new mongoose.Schema(
  {
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
    },
    date: { type: Date, required: [true, "Slot date is required"] },
    startTime: { type: String, required: [true, "Start time is required"] }, // "06:00"
    endTime: { type: String, required: [true, "End time is required"] }, // "07:00"
    totalCapacity: { type: Number, required: true, min: 1 },
    bookedCount: { type: Number, default: 0 },
    pricePerTicket: { type: Number, default: 0 }, // 0 = free darshan
    slotType: {
      type: String,
      enum: ["GENERAL", "VIP", "SPECIAL"],
      default: "GENERAL",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// virtual to compute available slots
darshanSlotSchema.virtual("availableCount").get(function () {
  return Math.max(this.totalCapacity - this.bookedCount, 0);
});

darshanSlotSchema.set("toJSON", { virtuals: true });
darshanSlotSchema.set("toObject", { virtuals: true });

darshanSlotSchema.index({ temple: 1, date: 1 });

module.exports = mongoose.model("DarshanSlot", darshanSlotSchema);
