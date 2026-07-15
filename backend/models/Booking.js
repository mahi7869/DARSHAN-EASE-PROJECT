const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    temple: { type: mongoose.Schema.Types.ObjectId, ref: "Temple", required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: "DarshanSlot", required: true },
    numberOfPeople: { type: Number, required: true, min: 1, max: 10 },
    visitorNames: [{ type: String }],
    totalAmount: { type: Number, default: 0 },
    bookingStatus: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "CONFIRMED",
    },
    bookingCode: { type: String, unique: true },
  },
  { timestamps: true }
);

// Generate a unique human-readable booking code
bookingSchema.pre("save", function (next) {
  if (!this.bookingCode) {
    this.bookingCode =
      "DE" + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
